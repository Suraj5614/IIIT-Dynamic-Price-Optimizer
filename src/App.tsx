import React, { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { usePricingStore } from './store/pricingStore';

// Sample data for demonstration
const sampleProduct = {
  id: '1',
  name: 'Premium Wireless Headphones',
  sku: 'WH-1000XM4',
  basePrice: 349.99,
  currentPrice: 349.99,
  inventory: 500,
  demand: 50,
  category: 'Electronics',
  competitors: [
    { competitor: 'Amazon', price: 348.99, timestamp: Date.now(), inStock: true },
    { competitor: 'Best Buy', price: 349.99, timestamp: Date.now(), inStock: true },
    { competitor: 'Walmart', price: 347.99, timestamp: Date.now(), inStock: false }
  ],
  salesHistory: Array.from({ length: 30 }, (_, i) => ({
    timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
    quantity: Math.floor(Math.random() * 10) + 1,
    price: 349.99,
    revenue: 349.99 * (Math.floor(Math.random() * 10) + 1)
  })),
  priceHistory: Array.from({ length: 30 }, (_, i) => ({
    timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
    price: 349.99 + (Math.random() - 0.5) * 20,
    demand: 50 + (Math.random() - 0.5) * 20,
    competitorAvgPrice: 348.99 + (Math.random() - 0.5) * 10
  }))
};

function App() {
  const { 
    setSelectedProduct, 
    updateMarketCondition,
    optimizePrice
  } = usePricingStore();

  useEffect(() => {
    // Set initial product
    setSelectedProduct(sampleProduct);

    // Simulate real-time market changes
    const interval = setInterval(() => {
      updateMarketCondition({
        competitorPrices: sampleProduct.competitors.map(c => ({
          ...c,
          price: c.price + (Math.random() - 0.5) * 2
        })),
        seasonalDemand: Math.max(0, Math.min(1, Math.random())),
        marketTrend: (Math.random() - 0.5) * 0.2,
        timeOfDay: new Date().getHours()
      });

      // Run price optimization
      optimizePrice(sampleProduct.id);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return <Dashboard />;
}

export default App;