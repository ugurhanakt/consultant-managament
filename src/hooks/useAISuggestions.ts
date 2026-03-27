import { useState, useEffect, useRef } from 'react'
import { TaskEntry } from '../types/plan'
import { getSuggestions, AISuggestion } from '../services/aiService'

const cache = new Map<string, AISuggestion[]>()

export const useAISuggestions = (
  taskInput: string,
  existingTasks: TaskEntry[],
  clientIndustry: string,
  enabled: boolean
) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled || !taskInput || taskInput.trim().length < 3) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    const cacheKey = `${taskInput.trim()}|${clientIndustry}`
    if (cache.has(cacheKey)) {
      setSuggestions(cache.get(cacheKey)!)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getSuggestions(taskInput.trim(), existingTasks, clientIndustry)
        cache.set(cacheKey, result)
        setSuggestions(result)
      } catch {
        setError('Öneriler yüklenemedi')
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 600)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [taskInput, clientIndustry, enabled])

  const clearSuggestions = () => setSuggestions([])

  return { suggestions, isLoading, error, clearSuggestions }
}
