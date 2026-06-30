import React from 'react';
import Card from '../ui/Card';

const FormulaCard = ({ formulas }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📐 Formula Sheet</h3>
      <div className="space-y-3">
        {formulas.map((formula) => (
          <div 
            key={formula.id}
            className="p-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <p className="font-mono text-sm text-gray-700">{formula.title}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FormulaCard;