import { Company } from "./company.model";
import { LocationInfo } from "./location-info.model";
import { WasteCategory } from "./wasteCategories.model";

export interface RouteRequest {
  route_code: string;
  route_date: string;
  capacity_stops: number;
  capacity_weight_kg: string;
  start_time: string;
  end_time: string;
  notes: string;
  waste_category: number;
  locality_id: number;
}

export interface Route {
  id: number;
  route_code: string;
  route_date: string;
  status: string;
  capacity_stops: number;
  capacity_weight_kg: string;
  start_time: string;
  end_time: string;
  notes: string;
  waste_category: WasteCategory;
  company: Company;
  locality: LocationInfo;
  created_at: string;
  updated_at: string;
}
