export interface Value {
  id?: number;
  label: string;
  description?: string;
  count?: number | string;
  prefix?: string;
  suffix?: string;
  ringOffset?: number;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  image_alt: string;
}

export interface Clinic {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  status: 'active' | 'inactive';
}
