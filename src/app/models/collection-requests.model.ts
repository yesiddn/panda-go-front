import { UserInfo } from "./auth.model";
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
  user: UserInfo;
  locality: number;
  waste_category: WasteCategory;
  route: Route;
}

export interface CreateCollectionRequestPayload {
  collection_date: string;
  address_snapshot: string;
  notes: string;
  locality: number;
  waste_category: number;
}
