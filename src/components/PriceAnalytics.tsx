import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PriceHistory } from '../types';

interface PriceAnalyticsProps {
  priceHistory: PriceHistory[];
}

export const PriceAnalytics: React.FC<PriceAnalyticsProps> = ({ priceHistory }) => {
  const data = priceHistory.map(history => ({
    time: new Date(history.timestamp).toLocaleTimeString(),
    price: history.price.toFixed(2),
    demand: history.demand
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Price & Demand Analytics</h2>
      <div className="w-full h-64">
        <LineChart width={600} height={240} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="price" 
            stroke="#2563eb" 
            name="Price ($)"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="demand" 
            stroke="#16a34a" 
            name="Demand"
          />
        </LineChart>
      </div>
    </div>
  );
};