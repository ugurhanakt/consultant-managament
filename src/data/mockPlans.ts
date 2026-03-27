import { Plan } from '../types/plan'
import { format, addDays, startOfWeek } from 'date-fns'

const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
const d = (offset: number) => format(addDays(weekStart, offset), 'yyyy-MM-dd')

let idCounter = 1
const id = () => `p${idCounter++}`

export const mockPlans: Plan[] = [
  // Ahmet Yılmaz (c1)
  {
    id: id(), consultantId: 'c1', clientId: 'cl1', date: d(0), startTime: '09:00', endTime: '17:00',
    type: 'onsite', status: 'confirmed',
    location: 'Arçelik Genel Merkez, Beşiktaş', notes: 'SAP FI modül konfigürasyon toplantısı.',
    tasks: [
      { id: 't1', title: 'SAP FI Konfigürasyonu', estimatedHours: 4, isBillable: true, category: 'Geliştirme' },
      { id: 't2', title: 'Kullanıcı Kabul Testleri', estimatedHours: 3, isBillable: true, category: 'Test' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c1', clientId: 'cl1', date: d(1), startTime: '10:00', endTime: '16:00',
    type: 'remote', status: 'confirmed',
    location: 'Remote', notes: 'FI-CO entegrasyon testi uzaktan yapılacak.',
    tasks: [
      { id: 't3', title: 'FI-CO Entegrasyon Testi', estimatedHours: 6, isBillable: true, category: 'Test' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c1', clientId: 'cl2', date: d(3), startTime: '09:30', endTime: '14:30',
    type: 'onsite', status: 'tentative',
    location: 'Koç Holding Merkez, Nakkaştepe', notes: 'Proje kick-off toplantısı.',
    tasks: [
      { id: 't4', title: 'Proje Modülü Geliştirmeleri', estimatedHours: 5, isBillable: true, category: 'Geliştirme' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },

  // Elif Kaya (c2)
  {
    id: id(), consultantId: 'c2', clientId: 'cl3', date: d(0), startTime: '08:30', endTime: '17:30',
    type: 'onsite', status: 'confirmed',
    location: 'Türk Telekom, Ankara', notes: 'MM modülü gap analizi.',
    tasks: [
      { id: 't5', title: 'MM Gap Analizi', estimatedHours: 8, isBillable: true, category: 'Analiz' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c2', clientId: 'cl3', date: d(1), startTime: '09:00', endTime: '17:00',
    type: 'onsite', status: 'confirmed',
    location: 'Türk Telekom, Ankara', notes: 'SD süreç tasarımı workshop.',
    tasks: [
      { id: 't6', title: 'SD Süreç Tasarımı', estimatedHours: 6, isBillable: true, category: 'Tasarım' },
      { id: 't7', title: 'Workshop Sunumu', estimatedHours: 2, isBillable: true, category: 'Yönetim' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c2', clientId: 'cl3', date: d(2), startTime: '10:00', endTime: '15:00',
    type: 'remote', status: 'confirmed',
    location: 'Remote', notes: 'Doküman hazırlama.',
    tasks: [
      { id: 't8', title: 'Fonksiyonel Spec Hazırlama', estimatedHours: 5, isBillable: true, category: 'Doküman' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c2', clientId: 'cl5', date: d(4), startTime: '14:00', endTime: '16:00',
    type: 'internal', status: 'confirmed',
    location: 'Ofis', notes: 'Haftalık ekip toplantısı.',
    tasks: [
      { id: 't9', title: 'Sprint Review', estimatedHours: 2, isBillable: false, category: 'Yönetim' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },

  // Mert Demir (c3)
  {
    id: id(), consultantId: 'c3', clientId: 'cl4', date: d(0), type: 'onsite', status: 'confirmed',
    location: 'Migros Depo Merkezi, İkitelli', notes: 'PP modülü üretim planlama.',
    tasks: [
      { id: 't10', title: 'Üretim Planlama Konfigürasyonu', estimatedHours: 7, isBillable: true, category: 'Geliştirme' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c3', clientId: 'cl4', date: d(2), type: 'remote', status: 'confirmed',
    location: 'Remote', notes: 'PM modülü bakım yönetimi.',
    tasks: [
      { id: 't11', title: 'Bakım Yönetimi Analizi', estimatedHours: 4, isBillable: true, category: 'Analiz' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c3', clientId: 'cl4', date: d(3), type: 'onsite', status: 'confirmed',
    location: 'Migros Depo Merkezi, İkitelli', notes: 'MES entegrasyon testi.',
    tasks: [
      { id: 't12', title: 'MES Entegrasyon Testi', estimatedHours: 6, isBillable: true, category: 'Test' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },

  // Zeynep Arslan (c4)
  {
    id: id(), consultantId: 'c4', clientId: 'cl2', date: d(0), type: 'onsite', status: 'confirmed',
    location: 'Koç Holding Merkez', notes: 'BI raporlama toplantısı.',
    tasks: [
      { id: 't13', title: 'BI Dashboard Tasarımı', estimatedHours: 5, isBillable: true, category: 'Tasarım' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c4', clientId: 'cl5', date: d(2), type: 'internal', status: 'confirmed',
    location: 'Ofis', notes: 'Proje durum değerlendirme.',
    tasks: [
      { id: 't14', title: 'Proje Durum Raporu', estimatedHours: 3, isBillable: false, category: 'Yönetim' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c4', clientId: 'cl1', date: d(4), type: 'onsite', status: 'confirmed',
    location: 'Arçelik Genel Merkez', notes: 'ABAP geliştirme review.',
    tasks: [
      { id: 't15', title: 'ABAP Code Review', estimatedHours: 4, isBillable: true, category: 'Geliştirme' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },

  // Can Öztürk (c5)
  {
    id: id(), consultantId: 'c5', clientId: 'cl1', date: d(1), type: 'remote', status: 'confirmed',
    location: 'Remote', notes: 'SAP HR yapılandırması.',
    tasks: [
      { id: 't16', title: 'HR Modülü Konfigürasyonu', estimatedHours: 6, isBillable: true, category: 'Geliştirme' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c5', clientId: 'cl2', date: d(3), type: 'onsite', status: 'tentative',
    location: 'Koç Holding Merkez', notes: 'SuccessFactors entegrasyon.',
    tasks: [
      { id: 't17', title: 'SuccessFactors Entegrasyon Analizi', estimatedHours: 5, isBillable: true, category: 'Analiz' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },

  // Selin Çelik (c6)
  {
    id: id(), consultantId: 'c6', clientId: 'cl4', date: d(0), type: 'onsite', status: 'confirmed',
    location: 'Migros Ana Depo', notes: 'WM depo yönetimi optimizasyonu.',
    tasks: [
      { id: 't18', title: 'Depo Süreç Optimizasyonu', estimatedHours: 8, isBillable: true, category: 'Analiz' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c6', clientId: 'cl4', date: d(1), type: 'onsite', status: 'confirmed',
    location: 'Migros Ana Depo', notes: 'EWM geçiş planlaması.',
    tasks: [
      { id: 't19', title: 'EWM Geçiş Planı', estimatedHours: 7, isBillable: true, category: 'Planlama' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c6', clientId: 'cl5', date: d(4), type: 'training', status: 'confirmed',
    location: 'Ofis', notes: 'TM modülü iç eğitim.',
    tasks: [
      { id: 't20', title: 'TM Modülü Eğitimi', estimatedHours: 4, isBillable: false, category: 'Eğitim' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },

  // Burak Şahin (c7)
  {
    id: id(), consultantId: 'c7', clientId: 'cl2', date: d(0), type: 'onsite', status: 'confirmed',
    location: 'Koç Holding Merkez', notes: 'S/4HANA migration kick-off.',
    tasks: [
      { id: 't21', title: 'S/4HANA Migration Planlaması', estimatedHours: 6, isBillable: true, category: 'Planlama' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c7', clientId: 'cl2', date: d(1), type: 'onsite', status: 'confirmed',
    location: 'Koç Holding Merkez', notes: 'BTP entegrasyon mimarisi.',
    tasks: [
      { id: 't22', title: 'BTP Mimari Tasarımı', estimatedHours: 5, isBillable: true, category: 'Tasarım' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c7', clientId: 'cl2', date: d(2), type: 'remote', status: 'confirmed',
    location: 'Remote', notes: 'ABAP OO geliştirme.',
    tasks: [
      { id: 't23', title: 'ABAP OO Geliştirme', estimatedHours: 7, isBillable: true, category: 'Geliştirme' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c7', clientId: 'cl2', date: d(3), type: 'onsite', status: 'confirmed',
    location: 'Koç Holding Merkez', notes: 'Göç testi.',
    tasks: [
      { id: 't24', title: 'Migration Test Senaryoları', estimatedHours: 6, isBillable: true, category: 'Test' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },

  // Deniz Yıldız (c8)
  {
    id: id(), consultantId: 'c8', clientId: 'cl3', date: d(0), type: 'remote', status: 'confirmed',
    location: 'Remote', notes: 'SAP BW raporlama.',
    tasks: [
      { id: 't25', title: 'BW Sorgu Geliştirme', estimatedHours: 5, isBillable: true, category: 'Geliştirme' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c8', clientId: 'cl3', date: d(2), type: 'onsite', status: 'confirmed',
    location: 'Türk Telekom, Ankara', notes: 'Analytics Cloud entegrasyonu.',
    tasks: [
      { id: 't26', title: 'SAC Entegrasyon Testi', estimatedHours: 6, isBillable: true, category: 'Test' },
    ],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: id(), consultantId: 'c8', clientId: 'cl5', date: d(4), type: 'leave', status: 'confirmed',
    location: '-', notes: 'Yıllık izin.',
    tasks: [],
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
]
