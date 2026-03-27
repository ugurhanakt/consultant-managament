import { create } from 'zustand'
import { Consultant, Team } from '../types/consultant'
import { Plan } from '../types/plan'
import { Client } from '../types/client'
import { Project } from '../types/project'
import { mockConsultants, mockTeams } from '../data/mockConsultants'
import { mockClients } from '../data/mockClients'
import { mockPlans } from '../data/mockPlans'
import { mockProjects } from '../data/mockProjects'
import { startOfWeek } from 'date-fns'

interface AppStore {
  // Data
  consultants: Consultant[]
  plans: Plan[]
  clients: Client[]
  teams: Team[]
  projects: Project[]

  // Calendar state
  currentWeekStart: Date
  filteredConsultantIds: string[]

  // Plan modal state
  isPlanModalOpen: boolean
  isPlanDetailOpen: boolean
  editingPlan: Plan | null
  selectedPlan: Plan | null
  prefillDate: string | null
  prefillConsultantId: string | null

  // Project modal state
  isProjectModalOpen: boolean
  editingProject: Project | null

  // Plan actions
  setCurrentWeek: (date: Date) => void
  setFilteredConsultants: (ids: string[]) => void
  openAddModal: (date?: string, consultantId?: string) => void
  openEditModal: (plan: Plan) => void
  openDetailModal: (plan: Plan) => void
  closeModals: () => void
  addPlan: (plan: Plan) => void
  updatePlan: (plan: Plan) => void
  deletePlan: (planId: string) => void
  addClient: (client: Client) => void

  // Project actions
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void
  openProjectModal: (project?: Project) => void
  closeProjectModal: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  consultants: mockConsultants,
  plans: mockPlans,
  clients: mockClients,
  teams: mockTeams,
  projects: mockProjects,

  currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
  filteredConsultantIds: [],

  isPlanModalOpen: false,
  isPlanDetailOpen: false,
  editingPlan: null,
  selectedPlan: null,
  prefillDate: null,
  prefillConsultantId: null,

  isProjectModalOpen: false,
  editingProject: null,

  setCurrentWeek: (date) => set({ currentWeekStart: date }),
  setFilteredConsultants: (ids) => set({ filteredConsultantIds: ids }),

  openAddModal: (date, consultantId) =>
    set({ isPlanModalOpen: true, isPlanDetailOpen: false, editingPlan: null, prefillDate: date ?? null, prefillConsultantId: consultantId ?? null }),

  openEditModal: (plan) =>
    set({ isPlanModalOpen: true, isPlanDetailOpen: false, editingPlan: plan, prefillDate: null, prefillConsultantId: null }),

  openDetailModal: (plan) =>
    set({ isPlanDetailOpen: true, isPlanModalOpen: false, selectedPlan: plan }),

  closeModals: () =>
    set({ isPlanModalOpen: false, isPlanDetailOpen: false, editingPlan: null, selectedPlan: null, prefillDate: null, prefillConsultantId: null }),

  addPlan: (plan) => set((s) => ({ plans: [...s.plans, plan] })),
  updatePlan: (plan) => set((s) => ({ plans: s.plans.map((p) => (p.id === plan.id ? plan : p)) })),
  deletePlan: (planId) => set((s) => ({ plans: s.plans.filter((p) => p.id !== planId) })),
  addClient: (client) => set((s) => ({ clients: [...s.clients, client] })),

  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (project) => set((s) => ({ projects: s.projects.map((p) => (p.id === project.id ? project : p)) })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  openProjectModal: (project) => set({ isProjectModalOpen: true, editingProject: project ?? null }),
  closeProjectModal: () => set({ isProjectModalOpen: false, editingProject: null }),
}))
