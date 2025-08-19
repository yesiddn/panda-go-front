import { Route } from "./routes.model";
import { WasteCategory } from "./wasteCategories.model";

export interface CollectionRequest {
  id: number;
  request_date: string;
  collection_date: string;
  address_snapshot: string;
  status: 'pending' | 'confirmed' | 'canceled';
  status_reason: string;
  notes: string;
  created_at: string;
  updated_at: string;
  user: number;
  locality: number;
  waste_category: WasteCategory;
  route: Route;
}

// {
//   "collection_date": "2025-08-19",
//   "address_snapshot": "string",
//   "notes": "string",
//   "locality": 0,
//   "waste_category": 0
// }
export interface CreateCollectionRequestPayload {
  collection_date: string;
  address_snapshot: string;
  notes: string;
  locality: number;
  waste_category: number;
}
