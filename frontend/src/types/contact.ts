export type ContactType = 'customer' | 'vendor' | 'both';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: ContactType;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
  imageUrl?: string | null;
  pincode?: string;
}

export interface ContactInput {
  name: string;
  email?: string;
  phone?: string;
  type: ContactType;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}


