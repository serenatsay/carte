export type DietaryCategory =
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "halal"
  | "kosher"
  | "none";

export type Allergen =
  | "nuts"
  | "peanuts"
  | "dairy"
  | "gluten"
  | "soy"
  | "eggs"
  | "shellfish"
  | "fish"
  | "sesame"
  | "none";

export interface MenuItem {
  id: string;
  originalName: string;
  originalDescription?: string;
  translatedName: string;
  translatedDescription?: string;
  pinyin?: string; // Pinyin romanization for Chinese characters
  pinyinDescription?: string; // Pinyin for description
  culturalNotes?: string;
  allergens: Allergen[];
  dietaryCategories?: DietaryCategory[];
  spiceLevel?: 0 | 1 | 2 | 3 | 4 | 5; // 0 none to 5 very spicy
  price?: {
    amount: number;
    currency: string; // ISO 4217 like "USD" or symbol fallbacks
    raw?: string; // original text as appeared
  };
  badges?: Array<"Local Specialty" | "Must Try">;
}

export interface MenuSection {
  id: string;
  originalTitle?: string;
  translatedTitle?: string;
  pinyinTitle?: string; // Pinyin romanization for Chinese section titles
  items: MenuItem[];
}

export interface ParsedMenu {
  originalLanguage?: string;
  translatedLanguage: string;
  sections: MenuSection[];
}

export interface CartSelectionItem {
  itemId: string;
  quantity: number;
  sectionId: string;
  isWildcard?: boolean;
  wildcardReason?: string;
}

export interface ParseMenuRequestBody {
  imageBase64: string; // data URL or bare base64
  preferredLanguage?: string; // default English
}

export type ParseMenuResponseBody = {
  ok: true;
  menu: ParsedMenu;
} | {
  ok: false;
  error: string;
}

export type HungerLevel = "light" | "moderate" | "hungry" | "feast";

export interface WildcardOrderRequest {
  menu: ParsedMenu;
  partySize: number;
  hungerLevel: HungerLevel;
  adventurous: boolean;
  preferredLanguage?: string;
  currentCart?: Record<string, CartSelectionItem>;
}

export interface WildcardSelection {
  itemId: string;
  quantity: number;
  sectionId: string;
  reason: string;
}

export type WildcardOrderResponse = {
  ok: true;
  selections: WildcardSelection[];
  explanation: string;
} | {
  ok: false;
  error: string;
}

export function isParsedMenu(value: unknown): value is ParsedMenu {
  if (!value || typeof value !== "object") return false;
  const v = value as ParsedMenu;
  return Array.isArray(v.sections);
}


