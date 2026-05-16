// Converts an array of category IDs to an array of objects with categoryId and category name
export function categoryIdsToNames(categoryIds: (string | number)[]): { categoryId: string, category: string }[] {
  const categoryMap: Record<string, string> = {
    "1": "Engine & Drivetrain",
    "2": "Brakes",
    "3": "Suspension & Steering",
    "4": "Electrical & Lighting",
    "5": "Cooling, Heating & AC",
    "6": "Wheels & Tires",
    "7": "Body & Exterior",
    "8": "Interior",
    "9": "Oils, Fluids & Maintenance",
    "10": "Tools & Garage",
    "11": "Accessories & Electronics",
    "12": "Performance Parts",
  };
  return categoryIds
    .map(id => {
      const name = categoryMap[String(id)];
      if (!name) return null;
      return { categoryId: String(id), category: name };
    })
    .filter(Boolean) as { categoryId: string, category: string }[];
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
