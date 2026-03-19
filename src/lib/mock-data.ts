// =========================================
// AGROCAPITAL — Mock Data (Datos Simulados)
// =========================================

export type Region = 'costa-norte' | 'costa-sur' | 'sierra' | 'selva-alta' | 'selva-baja';

export interface CropData {
  name: string;
  emoji: string;
  image: string;
  yieldMin: number; // kg/Ha
  yieldMax: number;
  yieldSqm: number; // kg/m2 (yieldAvg / 10000)
  priceMin: number; // S/./kg (Legacy)
  priceMax: number;
  priceFarm: number; // Precio chacra (S/./kg)
  priceWholesale: number; // Precio mayorista (S/./kg)
  priceIntl: number; // Precio intl promedio (USD/kg)
  costRatio: number; // 0.40–0.55
  initialCostAvg: number; // S/. per Ha
  returnMonths: number; // 6–18 (Financial return)
  durationMonths: number; // Duración campaña agrícola
  tirMin: number;
  tirMax: number;
  description: string;
}

export interface RegionData {
  name: string;
  crops: CropData[];
  departments: string[];
}

export const REGIONS: Record<Region, RegionData> = {
  'costa-norte': {
    name: 'Costa Norte',
    departments: ['Piura', 'La Libertad', 'Lambayeque', 'Tumbes', 'Ancash'],
    crops: [
      {
        name: 'Espárrago', emoji: '🌿', image: 'https://images.unsplash.com/photo-1515003612716-16174bbdfa0b?q=80&w=600&auto=format&fit=crop',
        yieldMin: 8000, yieldMax: 12000, yieldSqm: 1.0,
        priceMin: 3.50, priceMax: 5.00, priceFarm: 3.50, priceWholesale: 6.00, priceIntl: 3.20,
        costRatio: 0.48, initialCostAvg: 18000, returnMonths: 8, durationMonths: 6,
        tirMin: 22, tirMax: 32, description: 'Alta demanda en Europa y EE.UU. Suelo arenoso ideal.'
      },
      {
        name: 'Palta Hass', emoji: '🥑', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600&auto=format&fit=crop',
        yieldMin: 9000, yieldMax: 13000, yieldSqm: 1.1,
        priceMin: 3.80, priceMax: 5.50, priceFarm: 4.00, priceWholesale: 7.50, priceIntl: 3.80,
        costRatio: 0.45, initialCostAvg: 22000, returnMonths: 10, durationMonths: 8,
        tirMin: 18, tirMax: 28, description: 'Excelente retorno en exportación.'
      },
    ]
  },
  'costa-sur': {
    name: 'Costa Sur',
    departments: ['Ica', 'Arequipa', 'Moquegua', 'Tacna', 'Lima'],
    crops: [
      {
        name: 'Uva de Mesa', emoji: '🍇', image: 'https://images.unsplash.com/photo-1596395567341-9c88a83dc757?q=80&w=600&auto=format&fit=crop',
        yieldMin: 10000, yieldMax: 15000, yieldSqm: 1.25,
        priceMin: 4.00, priceMax: 6.50, priceFarm: 4.50, priceWholesale: 8.00, priceIntl: 4.20,
        costRatio: 0.50, initialCostAvg: 25000, returnMonths: 9, durationMonths: 7,
        tirMin: 20, tirMax: 35, description: 'Variedad Red Globe con fuerte demanda asiática.'
      },
    ]
  },
  'sierra': {
    name: 'Sierra Central/Sur',
    departments: ['Cusco', 'Puno', 'Ayacucho', 'Huancavelica', 'Junín', 'Apurímac', 'Huánuco'],
    crops: [
      {
        name: 'Papa Nativa', emoji: '🥔', image: '/img/potato_harvest_aesthetic_1773866034246.png',
        yieldMin: 15000, yieldMax: 25000, yieldSqm: 2.0,
        priceMin: 0.90, priceMax: 2.50, priceFarm: 1.20, priceWholesale: 2.80, priceIntl: 1.50,
        costRatio: 0.40, initialCostAvg: 12000, returnMonths: 6, durationMonths: 5,
        tirMin: 14, tirMax: 22, description: 'Creciente valorización gastronómica premium.'
      },
      {
        name: 'Quinua', emoji: '🌾', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
        yieldMin: 12000, yieldMax: 20000, yieldSqm: 1.6,
        priceMin: 2.00, priceMax: 4.00, priceFarm: 2.50, priceWholesale: 5.00, priceIntl: 3.50,
        costRatio: 0.41, initialCostAvg: 11000, returnMonths: 7, durationMonths: 6,
        tirMin: 16, tirMax: 24, description: 'Supergrano orgánico para exportación.'
      },
    ]
  },
  'selva-alta': {
    name: 'Selva Alta',
    departments: ['San Martín', 'Amazonas', 'Cajamarca'],
    crops: [
      {
        name: 'Café Especial', emoji: '☕', image: '/img/coffee_crop_aesthetic_1773865968771.png',
        yieldMin: 1500, yieldMax: 2800, yieldSqm: 0.2,
        priceMin: 10.00, priceMax: 18.00, priceFarm: 14.00, priceWholesale: 22.00, priceIntl: 9.50,
        costRatio: 0.48, initialCostAvg: 16000, returnMonths: 12, durationMonths: 9,
        tirMin: 18, tirMax: 32, description: 'Café especial de altura con perfil Q-Grader.'
      },
      {
        name: 'Cacao Fino', emoji: '🍫', image: 'https://plus.unsplash.com/premium_photo-1667055747683-1ab5b5f2a13f?q=80&w=600&auto=format&fit=crop',
        yieldMin: 1200, yieldMax: 2500, yieldSqm: 0.18,
        priceMin: 12.00, priceMax: 22.00, priceFarm: 15.00, priceWholesale: 28.00, priceIntl: 12.00,
        costRatio: 0.45, initialCostAvg: 14000, returnMonths: 12, durationMonths: 8,
        tirMin: 20, tirMax: 38, description: 'Cacao de aroma premiado internacionalmente.'
      },
    ]
  },
  'selva-baja': {
    name: 'Selva Baja',
    departments: ['Ucayali', 'Loreto', 'Madre de Dios'],
    crops: [
      {
        name: 'Camu Camu', emoji: '🫐', image: 'https://images.unsplash.com/photo-1598064601445-6490db20755a?q=80&w=600&auto=format&fit=crop',
        yieldMin: 3000, yieldMax: 7000, yieldSqm: 0.5,
        priceMin: 8.00, priceMax: 15.00, priceFarm: 10.00, priceWholesale: 18.00, priceIntl: 15.00,
        costRatio: 0.46, initialCostAvg: 10000, returnMonths: 14, durationMonths: 10,
        tirMin: 18, tirMax: 30, description: 'Superfruto con 60x vitamina C para exportación.'
      },
    ]
  }
};

export type ProjectStatus = 'buscando' | 'en-revision' | 'activo' | 'financiado' | 'completado';

export interface Project {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhoto: string;
  farmerAge: number;
  farmerYearsExperience: number;
  region: Region;
  department: string;
  province: string;
  lat: number;
  lng: number;
  hectares: number;
  crop: CropData;
  story: string;
  storyShort: string;
  status: ProjectStatus;
  amountNeeded: number; // USD
  amountRaised: number; // USD
  roiEstimated: number; // %
  tirEstimated: number; // %
  vanEstimated: number; // USD
  incomeGross: number; // S/.
  operatingCosts: number; // S/.
  netProfit: number; // S/.
  returnMonths: number;
  investorsCount: number;
  createdAt: string;
  tags: string[];
  familyMembers: number;
  previousProduction: string;
  investmentPurpose: string;
  coverImage: string;
  hasPurchaseOrders: boolean;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    farmerId: 'farmer-001',
    farmerName: 'Feliciano Quispe Mamani',
    farmerPhoto: '/img/andean_farmer_portrait_1773865948608.png',
    farmerAge: 52,
    farmerYearsExperience: 28,
    region: 'sierra',
    department: 'Cusco',
    province: 'Quispicanchi',
    lat: -13.7563,
    lng: -71.3872,
    hectares: 4.5,
    crop: REGIONS['sierra'].crops[0],
    story: `Me llamo Feliciano Quispe Mamani y tengo 52 años. Nací en esta misma tierra que mis padres me enseñaron a amar...`,
    storyShort: 'Feliciano cultiva 40 variedades de papa nativa que los mejores restaurantes del mundo buscan.',
    status: 'activo',
    amountNeeded: 8500,
    amountRaised: 5780,
    roiEstimated: 22,
    tirEstimated: 24,
    vanEstimated: 4200,
    incomeGross: 56250,
    operatingCosts: 22500,
    netProfit: 33750,
    returnMonths: 6,
    investorsCount: 4,
    createdAt: '2026-01-15',
    tags: ['Orgánico', 'Exportación', 'Ancestral'],
    familyMembers: 5,
    previousProduction: '18 toneladas/año',
    investmentPurpose: 'Semillas certificadas (25%), Almacén en frío (60%), Logística (15%)',
    coverImage: '/img/potato_harvest_aesthetic_1773866034246.png',
    hasPurchaseOrders: true
  },
  {
    id: 'proj-002',
    farmerId: 'farmer-002',
    farmerName: 'María Angélica Saavedra',
    farmerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    farmerAge: 44,
    farmerYearsExperience: 18,
    region: 'selva-alta',
    department: 'Amazonas',
    province: 'Rodríguez de Mendoza',
    lat: -6.3933,
    lng: -77.5011,
    hectares: 2.5,
    crop: REGIONS['selva-alta'].crops[0],
    story: `Me llamo María Angélica Saavedra Chumbe, tengo 44 años y produzco café especial en las montañas de Amazonas...`,
    storyShort: 'El café de María tiene 87 puntos Q-Grader. Tu inversión le da acceso a mercados premium directos.',
    status: 'activo',
    amountNeeded: 9800,
    amountRaised: 7350,
    roiEstimated: 28,
    tirEstimated: 30,
    vanEstimated: 5600,
    incomeGross: 63000,
    operatingCosts: 30240,
    netProfit: 32760,
    returnMonths: 12,
    investorsCount: 5,
    createdAt: '2026-02-01',
    tags: ['Café Especial', 'Q-Grader', 'Exportación'],
    familyMembers: 3,
    previousProduction: '3.5 ton café pergamino/año',
    investmentPurpose: 'Despulpadora eléctrica (40%), Mesas de secado (35%), Certificaciones (25%)',
    coverImage: '/img/coffee_crop_aesthetic_1773865968771.png',
    hasPurchaseOrders: false
  },
  {
    id: 'proj-003',
    farmerId: 'farmer-003',
    farmerName: 'Eulogio Condori Apaza',
    farmerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    farmerAge: 61,
    farmerYearsExperience: 40,
    region: 'sierra',
    department: 'Puno',
    province: 'Azángaro',
    lat: -14.9108,
    lng: -70.1936,
    hectares: 4.0,
    crop: REGIONS['sierra'].crops[1],
    story: `Mi nombre es Eulogio Condori Apaza. Tengo 61 años y he dedicado mis años a la quinua altiplánica...`,
    storyShort: 'Eulogio produce quinua premium a 3,820 msnm. Tu inversión le da independencia financiera.',
    status: 'buscando',
    amountNeeded: 6500,
    amountRaised: 1800,
    roiEstimated: 19,
    tirEstimated: 21,
    vanEstimated: 3100,
    incomeGross: 98000,
    operatingCosts: 40180,
    netProfit: 57820,
    returnMonths: 7,
    investorsCount: 2,
    createdAt: '2026-02-10',
    tags: ['Altiplánico', 'Orgánico', 'Certificado'],
    familyMembers: 2,
    previousProduction: '8 toneladas/año',
    investmentPurpose: 'Semillas orgánicas (30%), Mano de obra local (50%), Transporte (20%)',
    coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop',
    hasPurchaseOrders: true
  },
  {
    id: 'proj-004',
    farmerId: 'farmer-004',
    farmerName: 'Rosa Luz Huamán',
    farmerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    farmerAge: 38,
    farmerYearsExperience: 15,
    region: 'costa-norte',
    department: 'La Libertad',
    province: 'Virú',
    lat: -8.4167,
    lng: -78.7500,
    hectares: 6.0,
    crop: REGIONS['costa-norte'].crops[0],
    story: `Rosa Luz es una líder en su comunidad de Virú. Busca tecnificar su riego para espárragos de exportación...`,
    storyShort: 'Espárragos premium para mercado europeo con riego tecnificado.',
    status: 'activo',
    amountNeeded: 12000,
    amountRaised: 4500,
    roiEstimated: 24,
    tirEstimated: 26,
    vanEstimated: 6500,
    incomeGross: 120000,
    operatingCosts: 55000,
    netProfit: 65000,
    returnMonths: 8,
    investorsCount: 8,
    createdAt: '2026-03-01',
    tags: ['Exportación', 'Riego Tecnificado'],
    familyMembers: 4,
    previousProduction: '12 ton/Ha',
    investmentPurpose: 'Sistema de goteo (70%), Fertilizantes orgánicos (30%)',
    coverImage: 'https://images.unsplash.com/photo-1515003612716-16174bbdfa0b?q=80&w=800&auto=format&fit=crop',
    hasPurchaseOrders: true
  },
  {
    id: 'proj-005',
    farmerId: 'farmer-005',
    farmerName: 'Victor Raúl Quispe',
    farmerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    farmerAge: 47,
    farmerYearsExperience: 25,
    region: 'costa-sur',
    department: 'Ica',
    province: 'Pisco',
    lat: -13.7000,
    lng: -76.2000,
    hectares: 3.5,
    crop: REGIONS['costa-sur'].crops[0],
    story: `Victor Raúl produce uvas Red Globe en el valle de Ica. Necesita ampliar su capacidad de empaque...`,
    storyShort: 'Uva de mesa premium con destino al mercado asiático.',
    status: 'activo',
    amountNeeded: 15000,
    amountRaised: 12500,
    roiEstimated: 32,
    tirEstimated: 35,
    vanEstimated: 8900,
    incomeGross: 145000,
    operatingCosts: 72500,
    netProfit: 72500,
    returnMonths: 9,
    investorsCount: 12,
    createdAt: '2026-02-20',
    tags: ['Exportación', 'Asia Market'],
    familyMembers: 6,
    previousProduction: '15 ton/Ha',
    investmentPurpose: 'Centro de empaque (60%), Logística de frío (40%)',
    coverImage: 'https://images.unsplash.com/photo-1596395567341-9c88a83dc757?q=80&w=800&auto=format&fit=crop',
    hasPurchaseOrders: true
  },
  {
    id: 'proj-006',
    farmerId: 'farmer-006',
    farmerName: 'Carmen Rosa Valdés',
    farmerPhoto: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop',
    farmerAge: 41,
    farmerYearsExperience: 12,
    region: 'selva-alta',
    department: 'San Martín',
    province: 'Tarapoto',
    lat: -6.4833,
    lng: -76.3667,
    hectares: 3.0,
    crop: REGIONS['selva-alta'].crops[1],
    story: `Carmen Rosa lidera una cooperativa de mujeres productoras de cacao fino de aroma...`,
    storyShort: 'Cacao orgánico premiado para chocolatería fina.',
    status: 'activo',
    amountNeeded: 8000,
    amountRaised: 6200,
    roiEstimated: 26,
    tirEstimated: 29,
    vanEstimated: 4100,
    incomeGross: 75000,
    operatingCosts: 33750,
    netProfit: 41250,
    returnMonths: 12,
    investorsCount: 6,
    createdAt: '2026-01-28',
    tags: ['Orgánico', 'Comercio Justo'],
    familyMembers: 3,
    previousProduction: '2.2 ton/Ha',
    investmentPurpose: 'Fermentadores de madera (50%), Secadores solares (50%)',
    coverImage: 'https://plus.unsplash.com/premium_photo-1667055747683-1ab5b5f2a13f?q=80&w=800&auto=format&fit=crop',
    hasPurchaseOrders: false
  },
  {
    id: 'proj-007',
    farmerId: 'farmer-007',
    farmerName: 'Segundo Antonio Jares',
    farmerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    farmerAge: 55,
    farmerYearsExperience: 30,
    region: 'costa-norte',
    department: 'Piura',
    province: 'Sullana',
    lat: -4.9039,
    lng: -80.6853,
    hectares: 5.0,
    crop: REGIONS['costa-norte'].crops[1],
    story: `Segundo Antonio cultiva palta Hass en Piura. Busca certificación Global GAP...`,
    storyShort: 'Palta Hass de exportación con certificación Global GAP.',
    status: 'en-revision',
    amountNeeded: 20000,
    amountRaised: 0,
    roiEstimated: 25,
    tirEstimated: 28,
    vanEstimated: 12000,
    incomeGross: 180000,
    operatingCosts: 81000,
    netProfit: 99000,
    returnMonths: 10,
    investorsCount: 0,
    createdAt: '2026-03-10',
    tags: ['Global GAP', 'Exportación'],
    familyMembers: 5,
    previousProduction: '14 ton/Ha',
    investmentPurpose: 'Implementación Global GAP (40%), Insumos certificados (60%)',
    coverImage: 'https://images.unsplash.com/photo-1550828553-3dbad5c723f5?q=80&w=800&auto=format&fit=crop', // Better Avocado/Palta image
    hasPurchaseOrders: true
  },
  {
    id: 'proj-008',
    farmerId: 'farmer-008',
    farmerName: 'Juana de Dios Poma',
    farmerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    farmerAge: 49,
    farmerYearsExperience: 22,
    region: 'sierra',
    department: 'Huancavelica',
    province: 'Acobamba',
    lat: -12.8408,
    lng: -74.5714,
    hectares: 2.8,
    crop: REGIONS['sierra'].crops[0],
    story: `Juana protege la biodiversidad de papas nativas en las alturas de Huancavelica...`,
    storyShort: 'Papas nativas ancestrales para el mercado gourmet limeño.',
    status: 'activo',
    amountNeeded: 5500,
    amountRaised: 4200,
    roiEstimated: 20,
    tirEstimated: 23,
    vanEstimated: 2800,
    incomeGross: 45000,
    operatingCosts: 18000,
    netProfit: 27000,
    returnMonths: 6,
    investorsCount: 3,
    createdAt: '2026-02-15',
    tags: ['Ancestral', ' Gourmet'],
    familyMembers: 4,
    previousProduction: '16 ton/Ha',
    investmentPurpose: 'Semillas seleccionadas (30%), Logística de transporte (70%)',
    coverImage: 'https://images.unsplash.com/photo-1518977676601-b53f02bad188?q=80&w=800&auto=format&fit=crop',
    hasPurchaseOrders: false
  },
  {
    id: 'proj-009',
    farmerId: 'farmer-009',
    farmerName: 'Máximo Inga',
    farmerPhoto: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop',
    farmerAge: 58,
    farmerYearsExperience: 35,
    region: 'selva-baja',
    department: 'Ucayali',
    province: 'Coronel Portillo',
    lat: -8.3833,
    lng: -74.5500,
    hectares: 4.2,
    crop: REGIONS['selva-baja'].crops[0],
    story: `Máximo es pionero en el cultivo sostenible de Camu Camu en zonas inundables...`,
    storyShort: 'Superfruto amazónico con alto contenido de Vitamina C.',
    status: 'buscando',
    amountNeeded: 11000,
    amountRaised: 2300,
    roiEstimated: 22,
    tirEstimated: 25,
    vanEstimated: 5200,
    incomeGross: 85000,
    operatingCosts: 39100,
    netProfit: 45900,
    returnMonths: 14,
    investorsCount: 3,
    createdAt: '2026-03-05',
    tags: ['Superfood', 'Amazonía'],
    familyMembers: 7,
    previousProduction: '6.5 ton/Ha',
    investmentPurpose: 'Bote para transporte (50%), Procesamiento post-cosecha (50%)',
    coverImage: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=800&auto=format&fit=crop', // River/Amazon jungle aesthetic
    hasPurchaseOrders: true
  },
  {
    id: 'proj-010',
    farmerId: 'farmer-010',
    farmerName: 'Teodora Quispe',
    farmerPhoto: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop',
    farmerAge: 53,
    farmerYearsExperience: 20,
    region: 'sierra',
    department: 'Ayacucho',
    province: 'Cangallo',
    lat: -13.6333,
    lng: -74.1500,
    hectares: 5.5,
    crop: REGIONS['sierra'].crops[1],
    story: `Teodora produce quinua de colores bajo estándares orgánicos internacionales...`,
    storyShort: 'Quinua orgánica de colores para exportación directa.',
    status: 'activo',
    amountNeeded: 13500,
    amountRaised: 11000,
    roiEstimated: 23,
    tirEstimated: 25,
    vanEstimated: 6800,
    incomeGross: 130000,
    operatingCosts: 53300,
    netProfit: 76700,
    returnMonths: 7,
    investorsCount: 9,
    createdAt: '2026-02-28',
    tags: ['Orgánico', 'Colores'],
    familyMembers: 4,
    previousProduction: '18 ton/Ha',
    investmentPurpose: 'Certificación orgánica (20%), Cosechadora mecánica (80%)',
    coverImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop', // Harvest fields aesthetic
    hasPurchaseOrders: true
  }
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agricultor' | 'inversor' | 'admin';
  photo?: string;
}

export const MOCK_USERS: User[] = [
  { id: 'user-001', name: 'Feliciano Quispe', email: 'feliciano@campo.com', role: 'agricultor', photo: '/img/andean_farmer_portrait_1773865948608.png' },
  { id: 'user-002', name: 'Elena Rodríguez', email: 'elena@inversion.com', role: 'inversor' },
  { id: 'user-003', name: 'Admin AgroCapital', email: 'admin@agrocapital.pe', role: 'admin' },
];

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('agrocapital_user');
  if (stored) return JSON.parse(stored);
  return null;
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('agrocapital_user', JSON.stringify(user));
    // Also save to all known local users for persistence across logins
    const users = getLocalUsers();
    if (!users.find(u => u.id === user.id)) {
      saveLocalUser(user);
    }
  } else {
    localStorage.removeItem('agrocapital_user');
  }
}

export function getLocalUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('agrocapital_all_users');
  if (stored) return JSON.parse(stored);
  return [];
}

export function saveLocalUser(user: User) {
  if (typeof window === 'undefined') return;
  const existing = getLocalUsers();
  // Update or add
  const updated = existing.filter(u => u.id !== user.id);
  updated.push(user);
  localStorage.setItem('agrocapital_all_users', JSON.stringify(updated));
}

// Helper: Get user's created projects locally
export function getLocalProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('agrocapital_projects');
  if (stored) return JSON.parse(stored);
  return [];
}

export function saveLocalProject(project: Project) {
  if (typeof window === 'undefined') return;
  const existing = getLocalProjects();
  localStorage.setItem('agrocapital_projects', JSON.stringify([project, ...existing]));
}

export interface Investor {
  id: string;
  name: string;
  email: string;
  country: string;
  joinedAt: string;
  totalInvested: number;
  projectsCount: number;
  badges: string[];
  familiesSupported: number;
  hectaresFinanced: number;
  foodGeneratedKg: number;
}

export const MOCK_INVESTORS: Investor[] = [
  {
    id: 'inv-001', name: 'Elena Rodríguez', email: 'elena@inversion.com',
    country: 'España', joinedAt: '2025-12-01', totalInvested: 25000,
    projectsCount: 4, badges: ['Pionero', 'Impacto Real', 'x3 Proyectos'],
    familiesSupported: 18, hectaresFinanced: 14.5, foodGeneratedKg: 85000
  },
  {
    id: 'inv-002', name: 'James Carter', email: 'james@email.com',
    country: 'Estados Unidos', joinedAt: '2026-01-15', totalInvested: 15000,
    projectsCount: 2, badges: ['Pionero', 'Impacto Real'],
    familiesSupported: 8, hectaresFinanced: 7.5, foodGeneratedKg: 45000
  },
  {
    id: 'inv-003', name: 'Kenji Watanabe', email: 'kenji@email.com',
    country: 'Japón', joinedAt: '2026-02-01', totalInvested: 32000,
    projectsCount: 5, badges: ['Pionero', 'Impacto Real', 'x3 Proyectos', 'Top Impacto'],
    familiesSupported: 24, hectaresFinanced: 21.0, foodGeneratedKg: 120000
  },
];

export const PLATFORM_STATS = {
  activeProjects: 10,
  investors: 42,
  totalInvestedUSD: 520000,
  familiesImpacted: 280,
};

export function calcFinancials(hectares: number, crop: CropData) {
  const yieldAvg = (crop.yieldMin + crop.yieldMax) / 2;
  const priceAvg = (crop.priceFarm);
  const incomeGross = yieldAvg * hectares * priceAvg;
  const operatingCosts = incomeGross * crop.costRatio;
  const netProfit = incomeGross - operatingCosts;
  const investmentNeeded = operatingCosts * 0.6; 
  const roi = ((netProfit / investmentNeeded) * 100);
  const tir = (crop.tirMin + crop.tirMax) / 2;
  const van = netProfit / (1 + 0.08) - investmentNeeded;
  return {
    incomeGross: Math.round(incomeGross),
    operatingCosts: Math.round(operatingCosts),
    netProfit: Math.round(netProfit),
    investmentNeeded: Math.round(investmentNeeded / 3.7), 
    roi: Math.round(roi),
    tir: Math.round(tir),
    van: Math.round(van / 3.7),
  };
}

export function generateMeetingLink(): string {
  const id = Math.random().toString(36).substring(2, 12);
  return `https://meet.google.com/${id.substring(0,3)}-${id.substring(3,7)}-${id.substring(7,10)}`;
}

// Portfolio & Investment Persistence
export interface LocalInvestment {
  userId: string;
  projectId: string;
  amount: number;
  date: string;
}

export function getLocalInvestments(userId: string): LocalInvestment[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('agrocapital_investments');
  const all: LocalInvestment[] = stored ? JSON.parse(stored) : [];
  return all.filter(inv => inv.userId === userId);
}

export function recordInvestment(userId: string, projectId: string, amount: number) {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('agrocapital_investments');
  const all: LocalInvestment[] = stored ? JSON.parse(stored) : [];
  const newInv: LocalInvestment = {
    userId,
    projectId,
    amount,
    date: new Date().toISOString()
  };
  localStorage.setItem('agrocapital_investments', JSON.stringify([...all, newInv]));
}
