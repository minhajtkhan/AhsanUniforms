export type UniformGender = 'boys' | 'girls'
export type UniformType = 'shirt' | 'pants'
export type UniformSizeType = 'collar' | 'waist'

export interface UniformSizePrice {
  size: string // e.g. '10.5"', '11.0"', '28"', etc.
  price: number // Selling price in PKR
  costPrice?: number // Optional cost price in PKR
}

export interface UniformProductConfig {
  id: string
  name: string
  gender: UniformGender
  type: UniformType
  sizeType: UniformSizeType
  sizeLabel: string // 'Collar Size' | 'Waist Size'
  defaultSize: string
  pricing: UniformSizePrice[]
}

export const DEFAULT_COLLAR_SIZES: UniformSizePrice[] = [
  { size: '10.5"', price: 650, costPrice: 420 },
  { size: '11.0"', price: 680, costPrice: 440 },
  { size: '11.5"', price: 720, costPrice: 460 },
  { size: '12.0"', price: 750, costPrice: 480 },
  { size: '12.5"', price: 790, costPrice: 510 },
  { size: '13.0"', price: 830, costPrice: 540 },
  { size: '13.5"', price: 870, costPrice: 570 },
  { size: '14.0"', price: 920, costPrice: 600 },
  { size: '14.5"', price: 970, costPrice: 630 },
  { size: '15.0"', price: 1020, costPrice: 660 },
  { size: '15.5"', price: 1080, costPrice: 700 },
  { size: '16.0"', price: 1150, costPrice: 750 },
]

export const DEFAULT_WAIST_SIZES: UniformSizePrice[] = [
  { size: '20"', price: 700, costPrice: 450 },
  { size: '22"', price: 750, costPrice: 480 },
  { size: '24"', price: 800, costPrice: 520 },
  { size: '26"', price: 860, costPrice: 560 },
  { size: '28"', price: 920, costPrice: 600 },
  { size: '30"', price: 990, costPrice: 650 },
  { size: '32"', price: 1070, costPrice: 700 },
  { size: '34"', price: 1150, costPrice: 750 },
  { size: '36"', price: 1240, costPrice: 810 },
  { size: '38"', price: 1340, costPrice: 880 },
  { size: '40"', price: 1450, costPrice: 950 },
]

export const DEFAULT_UNIFORM_CONFIGS: UniformProductConfig[] = [
  {
    id: 'uni-boys-shirt',
    name: 'Boys School Uniform White Shirt',
    gender: 'boys',
    type: 'shirt',
    sizeType: 'collar',
    sizeLabel: 'Collar Size',
    defaultSize: '13.5"',
    pricing: DEFAULT_COLLAR_SIZES.map((item) => ({ ...item })),
  },
  {
    id: 'uni-boys-pants',
    name: 'Boys School Uniform Grey Pants',
    gender: 'boys',
    type: 'pants',
    sizeType: 'waist',
    sizeLabel: 'Waist Size',
    defaultSize: '28"',
    pricing: DEFAULT_WAIST_SIZES.map((item) => ({ ...item })),
  },
  {
    id: 'uni-girls-shirt',
    name: 'Girls School Uniform Shirt / Kameez',
    gender: 'girls',
    type: 'shirt',
    sizeType: 'collar',
    sizeLabel: 'Collar Size',
    defaultSize: '12.5"',
    pricing: DEFAULT_COLLAR_SIZES.map((item) => ({ ...item, price: item.price + 30 })),
  },
  {
    id: 'uni-girls-pants',
    name: 'Girls School Uniform White Shalwar / Pants',
    gender: 'girls',
    type: 'pants',
    sizeType: 'waist',
    sizeLabel: 'Waist Size',
    defaultSize: '26"',
    pricing: DEFAULT_WAIST_SIZES.map((item) => ({ ...item, price: item.price + 20 })),
  },
]

const STORAGE_KEY = 'ahsan_shop_uniform_pricing'

/**
 * Get uniform pricing configuration from localStorage or default values
 */
export function getUniformConfigs(): UniformProductConfig[] {
  if (typeof window === 'undefined') {
    return DEFAULT_UNIFORM_CONFIGS
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error loading uniform pricing from localStorage', err)
  }

  return DEFAULT_UNIFORM_CONFIGS
}

/**
 * Save updated uniform pricing configuration to localStorage
 */
export function saveUniformConfigs(configs: UniformProductConfig[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
    window.dispatchEvent(new Event('ahsan_uniform_pricing_updated'))
  } catch (err) {
    console.error('Error saving uniform pricing to localStorage', err)
  }
}

/**
 * Reset uniform pricing configuration back to factory defaults
 */
export function resetUniformConfigs(): UniformProductConfig[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new Event('ahsan_uniform_pricing_updated'))
    } catch (err) {
      console.error(err)
    }
  }
  return DEFAULT_UNIFORM_CONFIGS
}

/**
 * Detect if a product is a uniform item and retrieve its sizing configuration
 */
export function matchUniformConfig(
  productName: string,
  categoryName?: string,
  configs?: UniformProductConfig[]
): UniformProductConfig | null {
  const list = configs || getUniformConfigs()
  const nameLower = (productName || '').toLowerCase()
  const catLower = (categoryName || '').toLowerCase()

  const isBoysCategory = catLower.includes('boy') || nameLower.includes('boy')
  const isGirlsCategory = catLower.includes('girl') || nameLower.includes('girl')

  const isShirt =
    nameLower.includes('shirt') ||
    nameLower.includes('kameez') ||
    nameLower.includes('kurta') ||
    nameLower.includes('blouse')

  const isPants =
    nameLower.includes('pant') ||
    nameLower.includes('trouser') ||
    nameLower.includes('shalwar') ||
    nameLower.includes('salwar')

  if (isBoysCategory) {
    if (isShirt) return list.find((c) => c.id === 'uni-boys-shirt') || null
    if (isPants) return list.find((c) => c.id === 'uni-boys-pants') || null
  }

  if (isGirlsCategory) {
    if (isShirt) return list.find((c) => c.id === 'uni-girls-shirt') || null
    if (isPants) return list.find((c) => c.id === 'uni-girls-pants') || null
  }

  // Fallback by keyword only
  if (isShirt && nameLower.includes('boy')) {
    return list.find((c) => c.id === 'uni-boys-shirt') || null
  }
  if (isShirt && nameLower.includes('girl')) {
    return list.find((c) => c.id === 'uni-girls-shirt') || null
  }
  if (isPants && nameLower.includes('boy')) {
    return list.find((c) => c.id === 'uni-boys-pants') || null
  }
  if (isPants && nameLower.includes('girl')) {
    return list.find((c) => c.id === 'uni-girls-pants') || null
  }

  return null
}

/**
 * Helper to get the price of a specific size for a uniform config
 */
export function getUniformPriceForSize(
  config: UniformProductConfig,
  size: string
): number {
  const match = config.pricing.find((p) => p.size.trim() === size.trim())
  if (match) return match.price
  // fallback to default or first
  return config.pricing[0]?.price || 0
}
