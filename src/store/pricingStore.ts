import { create } from 'zustand';
import { Product, MarketCondition, PricingRule, OptimizationResult } from '../types';
import { PriceOptimizer } from '../utils/priceOptimizer';

interface PricingState {
  products: Product[];
  marketCondition: MarketCondition;
  pricingRules: PricingRule[];
  selectedProduct: Product | null;
  optimizationResults: OptimizationResult | null;
  priceOptimizer: PriceOptimizer;
  
  // Actions
  setSelectedProduct: (product: Product | null) => void;
  updateProduct: (product: Product) => void;
  updateMarketCondition: (condition: Partial<MarketCondition>) => void;
  addPricingRule: (rule: PricingRule) => void;
  removePricingRule: (ruleId: string) => void;
  toggleRuleActive: (ruleId: string) => void;
  optimizePrice: (productId: string) => void;
}

const priceOptimizer = new PriceOptimizer();

export const usePricingStore = create<PricingState>((set, get) => ({
  products: [],
  marketCondition: {
    competitorPrices: [],
    seasonalDemand: 0.8,
    marketTrend: 0.2,
    timeOfDay: new Date().getHours(),
    elasticity: -1.5,
    stockLevel: 100
  },
  pricingRules: [],
  selectedProduct: null,
  optimizationResults: null,
  priceOptimizer,

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  updateProduct: (product) => set((state) => ({
    products: state.products.map(p => 
      p.id === product.id ? product : p
    )
  })),

  updateMarketCondition: (condition) => set((state) => ({
    marketCondition: { ...state.marketCondition, ...condition }
  })),

  addPricingRule: (rule) => set((state) => ({
    pricingRules: [...state.pricingRules, rule]
  })),

  removePricingRule: (ruleId) => set((state) => ({
    pricingRules: state.pricingRules.filter(rule => rule.id !== ruleId)
  })),

  toggleRuleActive: (ruleId) => set((state) => ({
    pricingRules: state.pricingRules.map(rule =>
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    )
  })),

  optimizePrice: (productId) => {
    const { products, marketCondition, pricingRules } = get();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const result = priceOptimizer.optimizePrice(product, marketCondition, pricingRules);
    set({ optimizationResults: result });
    
    // Update product with new price
    const updatedProduct = {
      ...product,
      currentPrice: result.suggestedPrice,
      priceHistory: [
        ...product.priceHistory,
        {
          timestamp: Date.now(),
          price: result.suggestedPrice,
          demand: product.demand,
          competitorAvgPrice: marketCondition.competitorPrices.reduce(
            (avg, cp) => avg + cp.price, 0
          ) / marketCondition.competitorPrices.length
        }
      ]
    };
    
    get().updateProduct(updatedProduct);
  }
}));