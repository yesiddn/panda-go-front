export interface RouteRequest {
  route_code: string;
  route_date: string;
  status: string;
  capacity_stops: number;
  capacity_weight_kg: string;
  start_time: string;
  end_time: string;
  notes: string;
  waste_category: number;
  locality: number;
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
  created_at: string;
  updated_at: string;
  waste_category: number;
  company: number;
  locality: number;
}
