import { Package, Zap, Battery, Droplet, Wrench, Sparkles, Leaf } from 'lucide-react'

export const categories = [
  {
    id: 'diy-flavors-components',
    titleKey: 'categories.diyFlavorsComponents',
    icon: Wrench,
    subcategories: [
      {
        id: 'base-liquids',
        titleKey: 'categories.subcategories.baseLiquids'
      }
    ]
  },
  {
    id: 'electronic-cigarettes',
    titleKey: 'categories.electronicCigarettes',
    icon: Zap,
    subcategories: [
      {
        id: 'starter-kits',
        titleKey: 'categories.subcategories.starterKits'
      }
    ]
  },
  {
    id: 'coils-pods',
    titleKey: 'categories.coilsPods',
    icon: Battery,
    subcategories: [
      {
        id: 'replacement-coils',
        titleKey: 'categories.subcategories.replacementCoils'
      }
    ]
  },
  {
    id: 'tanks',
    titleKey: 'categories.tanks',
    icon: Droplet,
    subcategories: [
      {
        id: 'sub-ohm-tanks',
        titleKey: 'categories.subcategories.subOhmTanks'
      }
    ]
  },
  {
    id: 'accessories',
    titleKey: 'categories.accessories',
    icon: Package,
    subcategories: [
      {
        id: 'chargers',
        titleKey: 'categories.subcategories.chargers'
      }
    ]
  },
  {
    id: 'flavors',
    titleKey: 'categories.flavors',
    icon: Sparkles,
    subcategories: [
      {
        id: 'premium-flavors',
        titleKey: 'categories.subcategories.premiumFlavors'
      }
    ]
  },
  {
    id: 'tobacco-substitutes',
    titleKey: 'categories.tobaccoSubstitutes',
    icon: Leaf,
    subcategories: [
      {
        id: 'nicotine-salts',
        titleKey: 'categories.subcategories.nicotineSalts'
      }
    ]
  }
]

// Helper function to get category by ID
export function getCategoryById(id) {
  return categories.find(cat => cat.id === id)
}

// Helper function to get subcategory by IDs
export function getSubcategoryByIds(categoryId, subcategoryId) {
  const category = getCategoryById(categoryId)
  return category?.subcategories.find(sub => sub.id === subcategoryId)
}

// Get all category IDs for easy filtering
export const categoryIds = categories.map(cat => cat.id)

// Get all subcategory IDs flattened
export const allSubcategoryIds = categories.flatMap(cat => 
  cat.subcategories.map(sub => `${cat.id}/${sub.id}`)
)
