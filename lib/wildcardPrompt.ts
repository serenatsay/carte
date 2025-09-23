import { HungerLevel, ParsedMenu, WildcardOrderRequest } from "./types";

export function buildWildcardSystemPrompt(): string {
  return `You are a culinary expert and cultural advisor helping travelers experience authentic local cuisine. Your task is to create personalized dining recommendations based on party size, hunger level, and adventure preference.

IMPORTANT: You must respond with ONLY a JSON object, no additional text before or after.

The JSON response must follow this exact structure:
{
  "selections": [
    {
      "itemId": "item_id_from_menu",
      "quantity": number,
      "sectionId": "section_id_from_menu",
      "reason": "Brief explanation for this choice"
    }
  ],
  "explanation": "Overall explanation of the curated experience"
}

Guidelines:
- For ADVENTUROUS: Prioritize local specialties, unique dishes, cultural experiences, "must-try" items
- For SAFE: Choose familiar flavors, well-known dishes, avoid exotic ingredients
- Consider party size for sharing dishes and variety
- Match portions to hunger level (light/moderate/hungry/feast)
- Create a balanced meal with variety across courses/categories
- Include cultural context in your reasoning
- Ensure item IDs and section IDs exactly match those provided in the menu
- IMPORTANT: Write all reasoning and explanations in the user's preferred language`;
}

export function buildWildcardUserPrompt(request: WildcardOrderRequest): string {
  const { menu, partySize, hungerLevel, adventurous, preferredLanguage, currentCart } = request;

  const hungerDescription = {
    light: "light appetite - small portions, perhaps appetizers or light dishes",
    moderate: "moderate appetite - a reasonable meal, not too heavy",
    hungry: "hungry - substantial portions, multiple courses",
    feast: "very hungry - generous portions, multiple dishes to share"
  };

  let prompt = `Please create a curated dining recommendation for:

PARTY DETAILS:
- Party size: ${partySize} people
- Hunger level: ${hungerLevel} (${hungerDescription[hungerLevel]})
- Adventure preference: ${adventurous ? 'ADVENTUROUS - local specialties and must-try dishes' : 'SAFE - familiar and approachable dishes'}
- Preferred language: ${preferredLanguage}

MENU:
${JSON.stringify(menu, null, 2)}`;

  if (currentCart && Object.keys(currentCart).length > 0) {
    prompt += `

EXISTING CART ITEMS:
The customer already has these items in their cart:
${JSON.stringify(currentCart, null, 2)}

IMPORTANT: Your recommendations should COMPLEMENT the existing items, not duplicate them. Consider:
- What the customer has already ordered
- What would pair well with their existing selections
- Filling any gaps in the meal (e.g., if they have mains, suggest appetizers or drinks)
- Avoiding redundant or conflicting flavors
- Creating a cohesive dining experience that builds on their current choices`;
  }

  prompt += `

Create selections that will give this party an excellent dining experience. Consider:
- Appropriate quantities for ${partySize} people
- Dishes that complement each other${currentCart ? ' and their existing cart items' : ''}
- Cultural significance of items (especially for adventurous diners)
- Balanced variety across the menu
- Portion sizes appropriate for ${hungerLevel} hunger level

IMPORTANT: Write all reasoning and explanations in ${preferredLanguage}. This includes the "reason" field for each selection and the overall "explanation".

Respond with the JSON format specified in the system prompt.`;

  return prompt;
}