import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CompetitorPrice } from '../types';

interface CompetitorAnalysisProps {
  competitors: CompetitorPrice[];
}

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ 
  competitors 
}) => {
  const data = competitors.map(competitor => ({
    name: competitor.competitor,
    price: competitor.price,
    status: competitor.inStock ? 'In Stock' : 'Out of Stock'
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Competitor Analysis</h2>
      <div className="w-full h-64">
        <BarChart width={500} height={240} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="price" 
            fill="#3b82f6" 
            name="Price ($)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Competitor Status</h3>
        <div className="space-y-2">
          {data.map((competitor) => (
            <div 
              key={competitor.name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span>{competitor.name}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                competitor.status === 'In Stock' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {competitor.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};