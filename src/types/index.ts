export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FeedbackData {
  name: string;
  email: string;
  rating: number;
  feedback: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
