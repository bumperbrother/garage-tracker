export interface Box {
  id: string;
  name: string;
  location: 'Garage' | 'Attic';
  category: string | null;
  description: string | null;
  created_at: string;
  qr_code_id: string;
  user_id: string;
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  box_id: string;
  category: string | null;
  date_stored: string;
  barcode: string | null;
  created_at: string;
  user_id: string;
}

export interface Image {
  id: string;
  item_id: string;
  storage_path: string;
  created_at: string;
  user_id: string;
}

export type BoxWithItems = Box & {
  items: Item[];
};

export type ItemWithImages = Item & {
  images: Image[];
};

export type LocationType = 'Garage' | 'Attic';

export interface SearchFilters {
  query?: string;
  location?: LocationType;
  category?: string;
}
