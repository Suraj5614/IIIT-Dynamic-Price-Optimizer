export interface Product {
  id: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  inventory: number;
  demand: number;
  category: string;
  sku: string;
  competitors: CompetitorPrice[];
  salesHistory: SaleRecord[];
  priceHistory: PriceHistory[];
}

export interface CompetitorPrice {
  competitor: string;
  price: number;
  timestamp: number;
  inStock: boolean;
}

export interface SaleRecord {
  timestamp: number;
  quantity: number;
  price: number;
  revenue: number;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
  demand: number;
  competitorAvgPrice: number;
}

export interface MarketCondition {
  competitorPrices: CompetitorPrice[];
  seasonalDemand: number;
  marketTrend: number;
  timeOfDay: number;
  elasticity: number;
  stockLevel: number;
}

export interface PricingRule {
  id: string;
  name: string;
  type: 'margin' | 'competitive' | 'inventory' | 'time';
  condition: string;
  adjustment: number;
  priority: number;
  active: boolean;
}

export interface OptimizationResult {
  suggestedPrice: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
}