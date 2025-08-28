import React, { useState } from 'react';
import { DollarSign, Percent, TrendingUp } from 'lucide-react';

interface CompetingOffer {
  basePay: number;
  variablePay: number;
  ctc: number;
}

interface CompetingOfferInputProps {
  onOfferChange: (offer: CompetingOffer) => void;
}

const CompetingOfferInput: React.FC<CompetingOfferInputProps> = ({ onOfferChange }) => {
  const [basePay, setBasePay] = useState<string>('');
  const [ctc, setCTC] = useState<string>('');
  const [variablePercentage, setVariablePercentage] = useState<string>('');

  const handleInputChange = () => {
    const basePayNum = parseFloat(basePay) || 0;
    const ctcNum = parseFloat(ctc) || 0;
    const varPercentNum = parseFloat(variablePercentage) || 0;
    
    let variablePayNum = 0;
    
    if (varPercentNum > 0 && basePayNum > 0) {
      variablePayNum = (basePayNum * varPercentNum) / 100;
    } else if (ctcNum > 0 && basePayNum > 0) {
      variablePayNum = ctcNum - basePayNum;
    }

    onOfferChange({
      basePay: basePayNum,
      variablePay: variablePayNum,
      ctc: ctcNum || (basePayNum + variablePayNum)
    });
  };

  React.useEffect(() => {
    handleInputChange();
  }, [basePay, ctc, variablePercentage]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Competing Offer Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Base Pay (INR)</span>
            </div>
          </label>
          <input
            type="number"
            value={basePay}
            onChange={(e) => setBasePay(e.target.value)}
            placeholder="Enter base salary"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Total CTC (INR)</span>
            </div>
          </label>
          <input
            type="number"
            value={ctc}
            onChange={(e) => setCTC(e.target.value)}
            placeholder="Enter total CTC"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Percent className="h-4 w-4" />
              <span>Variable %</span>
            </div>
          </label>
          <input
            type="number"
            value={variablePercentage}
            onChange={(e) => setVariablePercentage(e.target.value)}
            placeholder="Enter variable %"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="text-sm text-orange-800">
          <strong>Note:</strong> You can enter either the CTC directly or the base pay with variable percentage. 
          The system will calculate the missing values automatically.
        </div>
      </div>
    </div>
  );
};

export default CompetingOfferInput;