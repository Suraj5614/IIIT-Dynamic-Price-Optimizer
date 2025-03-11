import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { usePricingStore } from '../store/pricingStore';

export const OptimizationInsights: React.FC = () => {
  const { optimizationResults } = usePricingStore();

  if (!optimizationResults) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Optimization Insights</h2>
        <p className="text-gray-500">Run price optimization to see insights</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Optimization Insights</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Suggested Price</span>
          <span className="text-2xl font-bold text-blue-600">
            ${optimizationResults.suggestedPrice.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${optimizationResults.confidence}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Confidence Score: {optimizationResults.confidence.toFixed(1)}%
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Price Impact Factors</h3>
        {optimizationResults.factors.map((factor, index) => (
          <div 
            key={index}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{factor.name}</span>
              <div className="flex items-center">
                {factor.impact >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={factor.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(factor.impact * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};