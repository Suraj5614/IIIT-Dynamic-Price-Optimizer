import React from 'react';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users, 
  ShoppingCart,
  LineChart,
  AlertTriangle
} from 'lucide-react';
import { PriceAnalytics } from './PriceAnalytics';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { PricingRules } from './PricingRules';
import { OptimizationInsights } from './OptimizationInsights';
import { usePricingStore } from '../store/pricingStore';

export const Dashboard: React.FC = () => {
  const { 
    selectedProduct,
    marketCondition,
    optimizationResults
  } = usePricingStore();

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Select a product to view analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedProduct.name}
            </h1>
            <p className="text-gray-500">SKU: {selectedProduct.sku}</p>
          </div>
          {optimizationResults && (
            <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>
                Confidence Score: {optimizationResults.confidence.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Current Price</h2>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ${selectedProduct.currentPrice.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Base: ${selectedProduct.basePrice.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <Package className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold">Inventory</h2>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {selectedProduct.inventory}
            </p>
            <p className="text-sm text-gray-500">units available</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <ShoppingCart className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold">Sales</h2>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {selectedProduct.salesHistory.slice(-7).reduce(
                (sum, sale) => sum + sale.quantity, 0
              )}
            </p>
            <p className="text-sm text-gray-500">last 7 days</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-lg font-semibold">Market Trend</h2>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {(marketCondition.marketTrend >= 0 ? '+' : '') + 
                (marketCondition.marketTrend * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">trend indicator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PriceAnalytics priceHistory={selectedProduct.priceHistory} />
          <CompetitorAnalysis competitors={selectedProduct.competitors} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PricingRules />
          <OptimizationInsights />
        </div>
      </div>
    </div>
  );
};