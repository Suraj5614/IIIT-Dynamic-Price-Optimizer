import { 
  Product, 
  MarketCondition, 
  PricingRule, 
  OptimizationResult 
} from '../types';

export class PriceOptimizer {
  optimizePrice(
    product: Product,
    marketCondition: MarketCondition,
    rules: PricingRule[]
  ): OptimizationResult {
    const factors: { name: string; impact: number; description: string }[] = [];
    let priceAdjustment = 0;

    // Base competitive factor
    const competitorAvgPrice = this.calculateCompetitorAverage(marketCondition.competitorPrices);
    const competitiveFactor = this.calculateCompetitiveFactor(product.basePrice, competitorAvgPrice);
    factors.push({
      name: 'Competitive Positioning',
      impact: competitiveFactor,
      description: `Adjustment based on average competitor price of $${competitorAvgPrice.toFixed(2)}`
    });
    priceAdjustment += competitiveFactor;

    // Demand elasticity factor
    const elasticityFactor = this.calculateElasticityFactor(
      marketCondition.elasticity,
      product.demand
    );
    factors.push({
      name: 'Demand Elasticity',
      impact: elasticityFactor,
      description: `Price sensitivity adjustment based on current demand`
    });
    priceAdjustment += elasticityFactor;

    // Inventory factor
    const inventoryFactor = this.calculateInventoryFactor(marketCondition.stockLevel);
    factors.push({
      name: 'Inventory Level',
      impact: inventoryFactor,
      description: `Adjustment based on current stock level of ${marketCondition.stockLevel} units`
    });
    priceAdjustment += inventoryFactor;

    // Market trend factor
    const trendFactor = this.calculateTrendFactor(marketCondition.marketTrend);
    factors.push({
      name: 'Market Trend',
      impact: trendFactor,
      description: `Market trend adjustment of ${(marketCondition.marketTrend * 100).toFixed(1)}%`
    });
    priceAdjustment += trendFactor;

    // Apply custom pricing rules
    const ruleFactors = this.applyPricingRules(product, rules);
    factors.push(...ruleFactors.factors);
    priceAdjustment += ruleFactors.adjustment;

    // Calculate final price
    const suggestedPrice = this.calculateFinalPrice(
      product.basePrice,
      priceAdjustment
    );

    // Calculate confidence score based on data quality and factor consistency
    const confidence = this.calculateConfidence(factors);

    return {
      suggestedPrice,
      confidence,
      factors: factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    };
  }

  private calculateCompetitorAverage(competitorPrices: MarketCondition['competitorPrices']): number {
    if (competitorPrices.length === 0) return 0;
    return competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / competitorPrices.length;
  }

  private calculateCompetitiveFactor(basePrice: number, competitorAvgPrice: number): number {
    const priceDiff = (competitorAvgPrice - basePrice) / basePrice;
    return 0.3 * Math.tanh(priceDiff);
  }

  private calculateElasticityFactor(elasticity: number, demand: number): number {
    return 0.15 * Math.tanh(elasticity * (demand / 50 - 1));
  }

  private calculateInventoryFactor(stockLevel: number): number {
    return -0.2 * Math.tanh(stockLevel / 100 - 2);
  }

  private calculateTrendFactor(marketTrend: number): number {
    return 0.1 * Math.tanh(marketTrend);
  }

  private applyPricingRules(
    product: Product,
    rules: PricingRule[]
  ): { adjustment: number; factors: typeof factors } {
    let totalAdjustment = 0;
    const factors: { name: string; impact: number; description: string }[] = [];

    // Sort rules by priority
    const activeRules = rules
      .filter(rule => rule.active)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of activeRules) {
      const adjustment = this.evaluateRule(rule, product);
      if (adjustment !== 0) {
        totalAdjustment += adjustment;
        factors.push({
          name: `Rule: ${rule.name}`,
          impact: adjustment,
          description: `Applied pricing rule "${rule.name}" with ${adjustment > 0 ? '+' : ''}${(adjustment * 100).toFixed(1)}% adjustment`
        });
      }
    }

    return { adjustment: totalAdjustment, factors };
  }

  private evaluateRule(rule: PricingRule, product: Product): number {
    // Implement rule evaluation logic based on rule type and condition
    switch (rule.type) {
      case 'margin':
        return this.evaluateMarginRule(rule, product);
      case 'competitive':
        return this.evaluateCompetitiveRule(rule, product);
      case 'inventory':
        return this.evaluateInventoryRule(rule, product);
      case 'time':
        return this.evaluateTimeRule(rule);
      default:
        return 0;
    }
  }

  private evaluateMarginRule(rule: PricingRule, product: Product): number {
    const currentMargin = (product.currentPrice - product.basePrice) / product.basePrice;
    return rule.adjustment * Math.tanh(currentMargin - parseFloat(rule.condition));
  }

  private evaluateCompetitiveRule(rule: PricingRule, product: Product): number {
    const competitorPrice = parseFloat(rule.condition);
    const priceDiff = (competitorPrice - product.currentPrice) / product.currentPrice;
    return rule.adjustment * Math.tanh(priceDiff);
  }

  private evaluateInventoryRule(rule: PricingRule, product: Product): number {
    const threshold = parseFloat(rule.condition);
    const inventoryRatio = product.inventory / threshold;
    return rule.adjustment * Math.tanh(1 - inventoryRatio);
  }

  private evaluateTimeRule(rule: PricingRule): number {
    const hour = new Date().getHours();
    const targetHour = parseFloat(rule.condition);
    const hourDiff = Math.abs(hour - targetHour);
    return rule.adjustment * Math.exp(-hourDiff / 4);
  }

  private calculateFinalPrice(basePrice: number, totalAdjustment: number): number {
    const adjustedPrice = basePrice * (1 + totalAdjustment);
    // Ensure price stays within reasonable bounds (50% to 200% of base price)
    return this.clampPrice(adjustedPrice, basePrice * 0.5, basePrice * 2);
  }

  private calculateConfidence(factors: { impact: number }[]): number {
    // Calculate confidence score based on factor consistency and magnitude
    const totalImpact = factors.reduce((sum, factor) => sum + Math.abs(factor.impact), 0);
    const avgImpact = totalImpact / factors.length;
    const consistency = 1 - Math.sqrt(
      factors.reduce((sum, factor) => 
        sum + Math.pow(Math.abs(factor.impact) - avgImpact, 2), 0
      ) / factors.length
    );
    
    return Math.min(Math.max(consistency * 100, 0), 100);
  }

  private clampPrice(price: number, min: number, max: number): number {
    return Math.min(Math.max(price, min), max);
  }
}