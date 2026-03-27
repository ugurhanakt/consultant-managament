export type ConsultantRole = 'Kıdemli Danışman' | 'Danışman' | 'Uzman Danışman' | 'Müdür' | 'Takım Lideri'

export interface Consultant {
  id: string
  name: string
  role: ConsultantRole
  email: string
  avatarInitials: string
  colorTag: string
  skills: string[]
  teamId: string
  isActive: boolean
}

export interface Team {
  id: string
  name: string
  leadId: string
}
