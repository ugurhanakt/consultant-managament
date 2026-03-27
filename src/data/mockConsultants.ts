import { Consultant, Team } from '../types/consultant'

export const mockConsultants: Consultant[] = [
  {
    id: 'c1', name: 'Ahmet Yılmaz', role: 'Kıdemli Danışman',
    email: 'ahmet.yilmaz@erp.com', avatarInitials: 'AY',
    colorTag: '#9333ea', skills: ['SAP FI', 'SAP CO', 'S/4HANA'], teamId: 't1', isActive: true,
  },
  {
    id: 'c2', name: 'Elif Kaya', role: 'Danışman',
    email: 'elif.kaya@erp.com', avatarInitials: 'EK',
    colorTag: '#7e22ce', skills: ['SAP MM', 'SAP SD', 'Fiori'], teamId: 't1', isActive: true,
  },
  {
    id: 'c3', name: 'Mert Demir', role: 'Uzman Danışman',
    email: 'mert.demir@erp.com', avatarInitials: 'MD',
    colorTag: '#a855f7', skills: ['SAP PP', 'SAP PM', 'MES'], teamId: 't2', isActive: true,
  },
  {
    id: 'c4', name: 'Zeynep Arslan', role: 'Müdür',
    email: 'zeynep.arslan@erp.com', avatarInitials: 'ZA',
    colorTag: '#6b21a8', skills: ['Proje Yönetimi', 'SAP BI', 'ABAP'], teamId: 't2', isActive: true,
  },
  {
    id: 'c5', name: 'Can Öztürk', role: 'Danışman',
    email: 'can.ozturk@erp.com', avatarInitials: 'CÖ',
    colorTag: '#c084fc', skills: ['SAP HR', 'SuccessFactors', 'Payroll'], teamId: 't1', isActive: true,
  },
  {
    id: 'c6', name: 'Selin Çelik', role: 'Kıdemli Danışman',
    email: 'selin.celik@erp.com', avatarInitials: 'SÇ',
    colorTag: '#d8b4fe', skills: ['SAP WM', 'SAP EWM', 'TM'], teamId: 't2', isActive: true,
  },
  {
    id: 'c7', name: 'Burak Şahin', role: 'Takım Lideri',
    email: 'burak.sahin@erp.com', avatarInitials: 'BŞ',
    colorTag: '#581c87', skills: ['S/4HANA Migration', 'ABAP OO', 'BTP'], teamId: 't1', isActive: true,
  },
  {
    id: 'c8', name: 'Deniz Yıldız', role: 'Danışman',
    email: 'deniz.yildiz@erp.com', avatarInitials: 'DY',
    colorTag: '#e9d5ff', skills: ['SAP BW', 'Analytics Cloud', 'HANA'], teamId: 't2', isActive: true,
  },
]

export const mockTeams: Team[] = [
  { id: 't1', name: 'ERP Takımı Alpha', leadId: 'c7' },
  { id: 't2', name: 'ERP Takımı Beta', leadId: 'c4' },
]
