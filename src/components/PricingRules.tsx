import React, { useState } from 'react';
import { Plus, Trash2, ToggleLeft as Toggle } from 'lucide-react';
import { usePricingStore } from '../store/pricingStore';
import { PricingRule } from '../types';

export const PricingRules: React.FC = () => {
  const { pricingRules, addPricingRule, removePricingRule, toggleRuleActive } = usePricingStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState<Partial<PricingRule>>({
    type: 'margin',
    priority: 1,
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.name && newRule.type && newRule.condition && newRule.adjustment) {
      addPricingRule({
        id: Date.now().toString(),
        name: newRule.name,
        type: newRule.type as PricingRule['type'],
        condition: newRule.condition,
        adjustment: Number(newRule.adjustment),
        priority: newRule.priority || 1,
        active: true
      });
      setIsAdding(false);
      setNewRule({ type: 'margin', priority: 1, active: true });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pricing Rules</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rule Name
              </label>
              <input
                type="text"
                value={newRule.name || ''}
                onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rule Type
              </label>
              <select
                value={newRule.type}
                onChange={e => setNewRule({ ...newRule, type: e.target.value as PricingRule['type'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="margin">Margin Based</option>
                <option value="competitive">Competitive</option>
                <option value="inventory">Inventory Based</option>
                <option value="time">Time Based</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <input
                type="text"
                value={newRule.condition || ''}
                onChange={e => setNewRule({ ...newRule, condition: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adjustment (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={newRule.adjustment || ''}
                onChange={e => setNewRule({ ...newRule, adjustment: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <input
                type="number"
                value={newRule.priority || 1}
                onChange={e => setNewRule({ ...newRule, priority: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Rule
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {pricingRules.map(rule => (
          <div
            key={rule.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{rule.name}</h3>
              <p className="text-sm text-gray-500">
                {rule.type} | Priority: {rule.priority}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleRuleActive(rule.id)}
                className={`p-2 rounded-lg ${
                  rule.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <Toggle className="w-4 h-4" />
              </button>
              <button
                onClick={() => removePricingRule(rule.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};