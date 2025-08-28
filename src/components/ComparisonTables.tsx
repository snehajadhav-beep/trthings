import React from 'react';
import { TrendingUp, Award, DollarSign, Percent, BarChart3, Target } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  currentSalary: number;
  variablePay: number;
  variablePercentage: number;
  ctc: number;
}

interface CompetingOffer {
  basePay: number;
  variablePay: number;
  ctc: number;
}

interface CompensationRange {
  jobTitle: string;
  minSalary: number;
  midSalary: number;
  maxSalary: number;
  variablePercentage: number;
}

interface CounterProposal {
  basePay: number;
  variablePay: number;
  variablePercentage: number;
  ctc: number;
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  compaRatio: number;
  rangePosition: number;
  marketPosition: string;
}

interface ComparisonTablesProps {
  employee: Employee | null;
  competingOffer: CompetingOffer;
  promotionRange: CompensationRange | null;
  counterProposal: CounterProposal | null;
  currentRange: CompensationRange | null;
  exchangeRate: number;
}

const ComparisonTables: React.FC<ComparisonTablesProps> = ({
  employee,
  competingOffer,
  promotionRange,
  counterProposal,
  currentRange,
  exchangeRate
}) => {
  if (!employee) return null;

  const calculatePercentageIncrease = (current: number, proposed: number) => {
    return (((proposed - current) / current) * 100).toFixed(2);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount / exchangeRate);
  };

  const calculateCompaRatio = (salary: number, midSalary: number) => {
    return ((salary / midSalary) * 100).toFixed(1);
  };

  const getPositionColor = (compaRatio: number) => {
    if (compaRatio < 80) return 'text-red-600';
    if (compaRatio < 90) return 'text-orange-600';
    if (compaRatio <= 110) return 'text-green-600';
    if (compaRatio <= 120) return 'text-blue-600';
    return 'text-purple-600';
  };

  const calculatePromotionProposal = () => {
    if (!promotionRange) return null;
    
    const basePay = promotionRange.midSalary;
    const variablePay = (basePay * promotionRange.variablePercentage) / 100;
    const ctc = basePay + variablePay;
    
    return {
      basePay,
      variablePay,
      ctc,
      variablePercentage: promotionRange.variablePercentage
    };
  };

  const promotionProposal = calculatePromotionProposal();

  const competingOfferVariablePercentage = competingOffer.basePay > 0 
    ? ((competingOffer.variablePay / competingOffer.basePay) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Counter Proposal Table */}
      {counterProposal && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">AI-Powered Counter Proposal Analysis</h2>
          </div>
          
          {/* Positioning Summary */}
          {currentRange && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Compensation Positioning Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Current Position</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Compa-Ratio:</span>
                      <span className={`font-semibold text-sm ${getPositionColor(parseFloat(calculateCompaRatio(employee.currentSalary, currentRange.midSalary)))}`}>
                        {calculateCompaRatio(employee.currentSalary, currentRange.midSalary)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {parseFloat(calculateCompaRatio(employee.currentSalary, currentRange.midSalary)) < 90 ? 'Below Market' : 
                       parseFloat(calculateCompaRatio(employee.currentSalary, currentRange.midSalary)) <= 110 ? 'Market Competitive' : 'Above Market'}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-orange-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Competing Offer</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Compa-Ratio:</span>
                      <span className={`font-semibold text-sm ${getPositionColor(parseFloat(calculateCompaRatio(competingOffer.basePay, currentRange.midSalary)))}`}>
                        {calculateCompaRatio(competingOffer.basePay, currentRange.midSalary)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {parseFloat(calculateCompaRatio(competingOffer.basePay, currentRange.midSalary)) < 90 ? 'Below Market' : 
                       parseFloat(calculateCompaRatio(competingOffer.basePay, currentRange.midSalary)) <= 110 ? 'Market Competitive' : 'Above Market'}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">Counter Proposal</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Compa-Ratio:</span>
                      <span className={`font-semibold text-sm ${getPositionColor(counterProposal.compaRatio)}`}>
                        {counterProposal.compaRatio.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{counterProposal.marketPosition}</div>
                  </div>
                </div>
              </div>
              {currentRange && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">Compa-Ratio:</span>
                  <span className={`font-semibold ml-1 ${getPositionColor(parseFloat(calculateCompaRatio(promotionProposal.basePay, promotionRange.midSalary)))}`}>
                    {calculateCompaRatio(promotionProposal.basePay, promotionRange.midSalary)}%
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Component</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Current</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Competing Offer</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">AI Counter Proposal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Base Pay (INR)</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(employee.currentSalary)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(competingOffer.basePay)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(counterProposal.basePay)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Variable Pay (INR)</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(employee.variablePay)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(competingOffer.variablePay)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(counterProposal.variablePay)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Variable %</td>
                  <td className="py-3 px-4 text-right">{employee.variablePercentage}%</td>
                  <td className="py-3 px-4 text-right">{competingOfferVariablePercentage}%</td>
                  <td className="py-3 px-4 text-right">{counterProposal.variablePercentage.toFixed(1)}%</td>
                </tr>
                <tr className="border-b border-gray-100 bg-blue-50">
                  <td className="py-3 px-4 font-bold text-blue-800">CTC (INR)</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">₹{formatCurrency(employee.ctc)}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">₹{formatCurrency(competingOffer.ctc)}</td>
                  <td className="py-3 px-4 text-right font-bold text-blue-800">₹{formatCurrency(counterProposal.ctc)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">% Increase over Current</td>
                  <td className="py-3 px-4 text-right">—</td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-orange-600">
                      {calculatePercentageIncrease(employee.ctc, competingOffer.ctc)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-green-600">
                      {calculatePercentageIncrease(employee.ctc, counterProposal.ctc)}%
                    </span>
                  </td>
                </tr>
                {currentRange && (
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Compa-Ratio</td>
                    <td className="py-3 px-4 text-right">
                      <span className={getPositionColor(parseFloat(calculateCompaRatio(employee.currentSalary, currentRange.midSalary)))}>
                        {calculateCompaRatio(employee.currentSalary, currentRange.midSalary)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getPositionColor(parseFloat(calculateCompaRatio(competingOffer.basePay, currentRange.midSalary)))}>
                        {calculateCompaRatio(competingOffer.basePay, currentRange.midSalary)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getPositionColor(counterProposal.compaRatio)}>
                        {counterProposal.compaRatio.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-medium">CTC (USD)</td>
                  <td className="py-3 px-4 text-right">${formatUSD(employee.ctc)}</td>
                  <td className="py-3 px-4 text-right">${formatUSD(competingOffer.ctc)}</td>
                  <td className="py-3 px-4 text-right">${formatUSD(counterProposal.ctc)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Business Rationale Section */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-800">Business Rationale</h4>
            </div>
            <p className="text-sm text-gray-700">{counterProposal.rationale}</p>
          </div>
        </div>
      )}

      {/* Promotion Proposal Table */}
      {promotionProposal && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800">Promotion Proposal Analysis</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Component</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Current</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Competing Offer</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Promotion Proposal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Base Pay (INR)</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(employee.currentSalary)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(competingOffer.basePay)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(promotionProposal.basePay)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Variable Pay (INR)</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(employee.variablePay)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(competingOffer.variablePay)}</td>
                  <td className="py-3 px-4 text-right">₹{formatCurrency(promotionProposal.variablePay)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">Variable %</td>
                  <td className="py-3 px-4 text-right">{employee.variablePercentage}%</td>
                  <td className="py-3 px-4 text-right">{competingOfferVariablePercentage}%</td>
                  <td className="py-3 px-4 text-right">{promotionProposal.variablePercentage}%</td>
                </tr>
                <tr className="border-b border-gray-100 bg-green-50">
                  <td className="py-3 px-4 font-bold text-green-800">CTC (INR)</td>
                  <td className="py-3 px-4 text-right font-bold text-green-800">₹{formatCurrency(employee.ctc)}</td>
                  <td className="py-3 px-4 text-right font-bold text-green-800">₹{formatCurrency(competingOffer.ctc)}</td>
                  <td className="py-3 px-4 text-right font-bold text-green-800">₹{formatCurrency(promotionProposal.ctc)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">% Increase over Current</td>
                  <td className="py-3 px-4 text-right">—</td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-orange-600">
                      {calculatePercentageIncrease(employee.ctc, competingOffer.ctc)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-green-600">
                      {calculatePercentageIncrease(employee.ctc, promotionProposal.ctc)}%
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-medium">CTC (USD)</td>
                  <td className="py-3 px-4 text-right">${formatUSD(employee.ctc)}</td>
                  <td className="py-3 px-4 text-right">${formatUSD(competingOffer.ctc)}</td>
                  <td className="py-3 px-4 text-right">${formatUSD(promotionProposal.ctc)}</td>
                </tr>
                {currentRange && (
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium">Compa-Ratio (Promotion Range)</td>
                    <td className="py-3 px-4 text-right">
                      <span className={getPositionColor(parseFloat(calculateCompaRatio(employee.currentSalary, currentRange.midSalary)))}>
                        {calculateCompaRatio(employee.currentSalary, currentRange.midSalary)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getPositionColor(parseFloat(calculateCompaRatio(competingOffer.basePay, promotionRange?.midSalary || currentRange.midSalary)))}>
                        {calculateCompaRatio(competingOffer.basePay, promotionRange?.midSalary || currentRange.midSalary)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={getPositionColor(parseFloat(calculateCompaRatio(promotionProposal.basePay, promotionRange?.midSalary || currentRange.midSalary)))}>
                        {calculateCompaRatio(promotionProposal.basePay, promotionRange?.midSalary || currentRange.midSalary)}%
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTables;