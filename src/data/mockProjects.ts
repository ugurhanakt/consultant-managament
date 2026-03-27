import { Project } from '../types/project'

export const mockProjects: Project[] = [
  {
    id: 'pr1',
    name: 'S/4HANA Migration',
    clientId: 'cl1', // Arçelik A.Ş.
    description: 'Arçelik A.Ş. için SAP ECC sisteminin S/4HANA\'ya geçiş projesi. Finans, satın alma ve üretim modülleri kapsanmaktadır.',
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-09-30',
    requiredSkills: ['SAP FI', 'SAP CO', 'ABAP', 'S/4HANA'],
    assignedConsultantIds: ['c1', 'c7', 'c4'],
    colorTag: '#9333ea',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pr2',
    name: 'CRM & SD Entegrasyonu',
    clientId: 'cl3', // Türk Telekom
    description: 'Türk Telekom\'un müşteri yönetim süreçlerinin SAP SD ve Fiori arayüzleriyle modernizasyonu.',
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-07-31',
    requiredSkills: ['SAP SD', 'Fiori', 'SAP CO'],
    assignedConsultantIds: ['c2', 'c3'],
    colorTag: '#f59e0b',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pr3',
    name: 'EWM Depo Yönetimi',
    clientId: 'cl4', // Migros
    description: 'Migros lojistik operasyonları için SAP Extended Warehouse Management kurulumu ve optimizasyonu.',
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-08-15',
    requiredSkills: ['SAP WM', 'SAP EWM', 'ABAP'],
    assignedConsultantIds: ['c6'],
    colorTag: '#10b981',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pr4',
    name: 'HR Modernizasyonu',
    clientId: 'cl2', // Koç Holding
    description: 'Koç Holding İK süreçlerinin SuccessFactors ile entegrasyonu ve bordro süreçlerinin yeniden yapılandırılması.',
    status: 'planned',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    requiredSkills: ['SAP HR', 'SuccessFactors', 'Payroll'],
    assignedConsultantIds: ['c5'],
    colorTag: '#0ea5e9',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pr5',
    name: 'BTP Platform Geliştirme',
    clientId: 'cl5', // İç Proje
    description: 'Şirket içi SAP BTP altyapısının kurulumu, ABAP OO geliştirmeleri ve iç süreç otomasyonları.',
    status: 'on-hold',
    startDate: '2026-04-01',
    requiredSkills: ['BTP', 'ABAP OO', 'S/4HANA Migration'],
    assignedConsultantIds: ['c7', 'c4'],
    colorTag: '#6b7280',
    createdAt: new Date().toISOString(),
  },
]
