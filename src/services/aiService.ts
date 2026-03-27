import Anthropic from '@anthropic-ai/sdk'
import { TaskEntry } from '../types/plan'

export interface AISuggestion {
  title: string
  category: string
  estimatedHours: number
  isBillable: boolean
}

// ─── Offline ERP Kural Motoru ────────────────────────────────────────────────

const ERP_RULE_MAP: { keywords: RegExp; suggestions: AISuggestion[] }[] = [
  {
    keywords: /proje|kickoff|başlangıç|yönetim/i,
    suggestions: [
      { title: 'Proje Risk Matrisi Hazırlama', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'Kapsam Yönetimi Belgesi', category: 'Doküman', estimatedHours: 3, isBillable: true },
      { title: 'Kaynak Planlama Analizi', category: 'Planlama', estimatedHours: 2, isBillable: true },
      { title: 'Paydaş İletişim Planı', category: 'Yönetim', estimatedHours: 2, isBillable: true },
    ],
  },
  {
    keywords: /modül|konfigür|kurulum|setup/i,
    suggestions: [
      { title: 'Modül Entegrasyon Testi', category: 'Test', estimatedHours: 4, isBillable: true },
      { title: 'Kullanıcı Kabul Testi Senaryoları', category: 'Test', estimatedHours: 3, isBillable: true },
      { title: 'Teknik Mimari Dokümantasyonu', category: 'Doküman', estimatedHours: 4, isBillable: true },
      { title: 'Konfigürasyon Kontrol Listesi', category: 'Yönetim', estimatedHours: 2, isBillable: true },
    ],
  },
  {
    keywords: /test|uat|doğrulama|validasyon/i,
    suggestions: [
      { title: 'Test Senaryoları Hazırlama', category: 'Test', estimatedHours: 3, isBillable: true },
      { title: 'Hata Kayıt ve Takip Yönetimi', category: 'Test', estimatedHours: 2, isBillable: true },
      { title: 'Performans Test Analizi', category: 'Analiz', estimatedHours: 4, isBillable: true },
      { title: 'Test Sonuç Raporu', category: 'Doküman', estimatedHours: 2, isBillable: true },
    ],
  },
  {
    keywords: /analiz|gap|as-is|to-be|süreç/i,
    suggestions: [
      { title: 'As-Is Süreç Dokümantasyonu', category: 'Analiz', estimatedHours: 4, isBillable: true },
      { title: 'Gap Analiz Raporu', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'To-Be Süreç Tasarımı', category: 'Tasarım', estimatedHours: 4, isBillable: true },
      { title: 'Gereksinim Belgesi Hazırlama', category: 'Doküman', estimatedHours: 3, isBillable: true },
    ],
  },
  {
    keywords: /geliştirme|abap|kod|program|yazılım/i,
    suggestions: [
      { title: 'ABAP Unit Test Yazımı', category: 'Test', estimatedHours: 3, isBillable: true },
      { title: 'Teknik Spesifikasyon Belgesi', category: 'Doküman', estimatedHours: 3, isBillable: true },
      { title: 'Code Review ve Optimizasyon', category: 'Geliştirme', estimatedHours: 2, isBillable: true },
      { title: 'Geliştirici Rehberi Güncelleme', category: 'Doküman', estimatedHours: 2, isBillable: true },
    ],
  },
  {
    keywords: /entegrasyon|integration|api|arayüz|interface/i,
    suggestions: [
      { title: 'Veri Haritalama Belgesi', category: 'Doküman', estimatedHours: 3, isBillable: true },
      { title: 'Entegrasyon Uyum Kontrolü', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'Entegrasyon Hata Yönetimi Planı', category: 'Planlama', estimatedHours: 2, isBillable: true },
      { title: 'API Test Senaryoları', category: 'Test', estimatedHours: 4, isBillable: true },
    ],
  },
  {
    keywords: /fi|finans|muhasebe|hesap|bütçe|maliyet/i,
    suggestions: [
      { title: 'FI-CO Uyum Kontrolü', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'Hesap Planı Revizyonu', category: 'Geliştirme', estimatedHours: 2, isBillable: true },
      { title: 'Finansal Raporlama Konfigürasyonu', category: 'Geliştirme', estimatedHours: 4, isBillable: true },
      { title: 'Bütçe Planlama Analizi', category: 'Analiz', estimatedHours: 3, isBillable: true },
    ],
  },
  {
    keywords: /mm|satın|tedarik|malzeme|stok|depo/i,
    suggestions: [
      { title: 'Satın Alma Süreç Optimizasyonu', category: 'Analiz', estimatedHours: 4, isBillable: true },
      { title: 'Stok Değerleme Analizi', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'Tedarikçi Değerlendirme Belgesi', category: 'Doküman', estimatedHours: 2, isBillable: true },
      { title: 'Malzeme Master Veri Temizleme', category: 'Geliştirme', estimatedHours: 4, isBillable: true },
    ],
  },
  {
    keywords: /sd|satış|sipariş|müşteri|fiyat|teklif/i,
    suggestions: [
      { title: 'Satış Süreç Haritalama', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'Fiyatlandırma Konfigürasyonu', category: 'Geliştirme', estimatedHours: 4, isBillable: true },
      { title: 'Müşteri Master Veri Analizi', category: 'Analiz', estimatedHours: 2, isBillable: true },
      { title: 'Sipariş Yönetimi Test Senaryoları', category: 'Test', estimatedHours: 3, isBillable: true },
    ],
  },
  {
    keywords: /hr|insan|personel|bordro|izin|maaş/i,
    suggestions: [
      { title: 'İnsan Kaynakları Süreç Analizi', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'Bordro Konfigürasyon Testi', category: 'Test', estimatedHours: 4, isBillable: true },
      { title: 'Çalışan Self-Servis Kılavuzu', category: 'Doküman', estimatedHours: 2, isBillable: true },
      { title: 'SuccessFactors Entegrasyon Testi', category: 'Test', estimatedHours: 4, isBillable: true },
    ],
  },
  {
    keywords: /pp|üretim|planlama|kapasite|mrp/i,
    suggestions: [
      { title: 'Üretim Planlama Optimizasyonu', category: 'Analiz', estimatedHours: 4, isBillable: true },
      { title: 'Kapasite Planlama Analizi', category: 'Planlama', estimatedHours: 3, isBillable: true },
      { title: 'MRP Konfigürasyon Revizyonu', category: 'Geliştirme', estimatedHours: 4, isBillable: true },
      { title: 'Üretim Emri Test Senaryoları', category: 'Test', estimatedHours: 3, isBillable: true },
    ],
  },
  {
    keywords: /eğitim|training|workshop|seminer/i,
    suggestions: [
      { title: 'Eğitim Materyali Hazırlama', category: 'Eğitim', estimatedHours: 4, isBillable: true },
      { title: 'Son Kullanıcı Eğitimi', category: 'Eğitim', estimatedHours: 6, isBillable: true },
      { title: 'Eğitim Değerlendirme Formu', category: 'Eğitim', estimatedHours: 1, isBillable: true },
      { title: 'Kullanıcı Kılavuzu Güncelleme', category: 'Doküman', estimatedHours: 3, isBillable: true },
    ],
  },
  {
    keywords: /rapor|raporlama|bi|bw|analytics|dashboard|görsel/i,
    suggestions: [
      { title: 'Rapor Gereksinim Analizi', category: 'Analiz', estimatedHours: 2, isBillable: true },
      { title: 'Dashboard Tasarımı ve Geliştirme', category: 'Tasarım', estimatedHours: 5, isBillable: true },
      { title: 'Veri Kalite Kontrolü', category: 'Analiz', estimatedHours: 3, isBillable: true },
      { title: 'SAC Entegrasyon Testi', category: 'Test', estimatedHours: 4, isBillable: true },
    ],
  },
  {
    keywords: /migrasyon|migration|geçiş|cutover|s\/4|s4hana/i,
    suggestions: [
      { title: 'Veri Kalite Analizi ve Temizleme', category: 'Analiz', estimatedHours: 5, isBillable: true },
      { title: 'Migrasyon Test Senaryoları', category: 'Test', estimatedHours: 4, isBillable: true },
      { title: 'Cutover Planı Hazırlama', category: 'Planlama', estimatedHours: 3, isBillable: true },
      { title: 'Veri Haritalama Belgesi', category: 'Doküman', estimatedHours: 3, isBillable: true },
    ],
  },
  {
    keywords: /sap|erp|sistem|platform|altyapı/i,
    suggestions: [
      { title: 'SAP Transport Yönetimi', category: 'Yönetim', estimatedHours: 2, isBillable: true },
      { title: 'Kullanıcı Yetkilendirme Revizyonu', category: 'Yönetim', estimatedHours: 3, isBillable: true },
      { title: 'SAP Performans Optimizasyonu', category: 'Geliştirme', estimatedHours: 4, isBillable: true },
      { title: 'Sistem Sağlık Kontrol Raporu', category: 'Analiz', estimatedHours: 2, isBillable: true },
    ],
  },
]

const getRuleBasedSuggestions = (
  taskInput: string,
  existingTasks: TaskEntry[]
): AISuggestion[] => {
  const existingTitles = existingTasks.map((t) => t.title.toLowerCase())
  const seen = new Set<string>()
  const results: AISuggestion[] = []

  for (const rule of ERP_RULE_MAP) {
    if (rule.keywords.test(taskInput)) {
      for (const s of rule.suggestions) {
        const key = s.title.toLowerCase()
        if (!seen.has(key) && !existingTitles.some((e) => e.includes(key.slice(0, 10)))) {
          seen.add(key)
          results.push(s)
        }
        if (results.length >= 5) return results
      }
    }
  }

  // Generic fallback if no keyword matched
  if (results.length === 0) {
    const generic: AISuggestion[] = [
      { title: 'Gereksinim Toplantısı ve Belgeleme', category: 'Analiz', estimatedHours: 2, isBillable: true },
      { title: 'Çözüm Tasarım Belgesi', category: 'Doküman', estimatedHours: 3, isBillable: true },
      { title: 'Kullanıcı Kabul Testi', category: 'Test', estimatedHours: 4, isBillable: true },
      { title: 'Durum Raporu Hazırlama', category: 'Yönetim', estimatedHours: 1, isBillable: true },
    ]
    return generic.filter((s) => !existingTitles.some((e) => e.includes(s.title.toLowerCase().slice(0, 10))))
  }

  return results
}

// ─── API Key Kontrolü ─────────────────────────────────────────────────────────

const getApiKey = () => import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined
const hasRealApiKey = () => {
  const key = getApiKey()
  return !!key && key !== 'your_api_key_here' && key.startsWith('sk-ant-')
}

// ─── Ana Fonksiyon (Hibrit) ───────────────────────────────────────────────────

export const getSuggestions = async (
  taskInput: string,
  existingTasks: TaskEntry[],
  clientIndustry: string
): Promise<AISuggestion[]> => {
  if (!taskInput || taskInput.trim().length < 3) return []

  // Gerçek API key varsa Claude'u dene, yoksa / hata olursa kural motoruna düş
  if (hasRealApiKey()) {
    try {
      const client = new Anthropic({
        apiKey: getApiKey(),
        dangerouslyAllowBrowser: true,
      })

      const existingTitles = existingTasks.map((t) => t.title).join(', ')
      const prompt = `Sen bir ERP danışmanlık proje planlama asistanısın. Danışmanın girdiği görev başlığına göre, ilgili ve faturalabilir (billable) ek görev önerileri sun.

Danışmanın girdiği görev: "${taskInput}"
Müşteri sektörü: ${clientIndustry}
Zaten eklenen görevler (bunları tekrar önerme): ${existingTitles || 'yok'}

3-5 adet ilgili, faturalabilir ek görev öner. Gerçekçi ERP danışmanlık görevleri olsun.
Sadece JSON array döndür, başka hiçbir şey yazma:
[
  { "title": "görev adı", "category": "kategori", "estimatedHours": saat_sayısı, "isBillable": true },
  ...
]

Kategori örnekleri: Geliştirme, Analiz, Test, Dokümantasyon, Eğitim, Yönetim, Tasarım, Planlama`

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].type === 'text' ? response.content[0].text : ''
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) return getRuleBasedSuggestions(taskInput, existingTasks)

      const parsed = JSON.parse(jsonMatch[0]) as AISuggestion[]
      return Array.isArray(parsed) && parsed.length > 0
        ? parsed.slice(0, 5)
        : getRuleBasedSuggestions(taskInput, existingTasks)
    } catch {
      // API hatası → kural motoruna düş
      return getRuleBasedSuggestions(taskInput, existingTasks)
    }
  }

  // API key yok → direkt kural motoru
  return getRuleBasedSuggestions(taskInput, existingTasks)
}
