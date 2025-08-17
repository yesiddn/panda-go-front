import { WasteCategory } from "./wasteCategories.model";

export interface Company {
  id: number;
  name: string;
  waste_categories: WasteCategory[];
}

export interface CompanyRequest {
  name: string;
  waste_categories: number[];
}
