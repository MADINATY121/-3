export type Role = "client" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
  phone: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Service {
  id: string;
  ownerId: string;
  categoryId: string;
  name: string;
  description: string;
  rating: number;
  reviewsCount: number;
  image: string;
  workingHours: { open: string; close: string };
  location: string;
  price: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  clientId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  service?: Service;
  client?: User;
}
