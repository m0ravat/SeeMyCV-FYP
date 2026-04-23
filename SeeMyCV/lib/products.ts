export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  currency: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'premium-lifetime',
    name: 'SeeMyCV Premium',
    description: 'Lifetime access to all premium features including AI feedback and unlimited CVs.',
    priceInCents: 30, // £0.30 for testing (Stripe minimum) — change to 2000 (£20) for production
    currency: 'gbp',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
