import { Consultant } from '../types/consultant'

export interface ConsultantMatch {
  consultant: Consultant
  matchCount: number
  matchRate: number
  matchedSkills: string[]
}

export const suggestConsultantsForProject = (
  requiredSkills: string[],
  consultants: Consultant[],
  alreadyAssignedIds: string[] = []
): ConsultantMatch[] => {
  if (requiredSkills.length === 0) return []

  return consultants
    .filter((c) => c.isActive && !alreadyAssignedIds.includes(c.id))
    .map((c) => {
      const matchedSkills = c.skills.filter((s) => requiredSkills.includes(s))
      const matchCount = matchedSkills.length
      const matchRate = Math.round((matchCount / requiredSkills.length) * 100)
      return { consultant: c, matchCount, matchRate, matchedSkills }
    })
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => b.matchRate - a.matchRate)
    .slice(0, 5)
}
