import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  AreaChart
} from 'recharts';
import { TrendingUp, BarChart3, Target, DollarSign, Users, AlertTriangle, Award } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  currentSalary: number;
  variablePay: number;
  variablePercentage: number;
  ctc: number;
  hireDate: string;
  level: string;
  department: string;
  jobTitle: string;
}

interface CompensationRange {
  jobTitle: string;
  minSalary: number;
  midSalary: number;
  maxSalary: number;
  variablePercentage: number;
  level: string;
}

interface CompetingOffer {
  basePay: number;
  variablePay: number;
  ctc: number;
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

interface ChartsAndVisualsProps {
  employee: Employee | null;
  competingOffer: CompetingOffer;
  counterProposal: CounterProposal | null;
  currentRange: CompensationRange | null;
  promotionRange: CompensationRange | null;
  exchangeRate: number;
}

const ChartsAndVisuals: React.FC<ChartsAndVisualsProps> = ({
  employee,
  competingOffer,
  counterProposal,
  currentRange,
  promotionRange,
  exchangeRate
}) => {
  if (!employee || !counterProposal || !currentRange) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Charts & Visual Analytics</h2>
        </div>
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Complete the retention analysis to view visual insights and charts.</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const compensationComparisonData = [
    {
      name: 'Current',
      basePay: employee.currentSalary / 100000,
      variablePay: employee.variablePay / 100000,
      ctc: employee.ctc / 100000,
      compaRatio: ((employee.currentSalary / currentRange.midSalary) * 100)
    },
    {
      name: 'Competing Offer',
      basePay: competingOffer.basePay / 100000,
      variablePay: competingOffer.variablePay / 100000,
      ctc: competingOffer.ctc / 100000,
      compaRatio: ((competingOffer.basePay / currentRange.midSalary) * 100)
    },
    {
      name: 'Counter Proposal',
      basePay: counterProposal.basePay / 100000,
      variablePay: counterProposal.variablePay / 100000,
      ctc: counterProposal.ctc / 100000,
      compaRatio: counterProposal.compaRatio
    }
  ];

  const rangeAnalysisData = [
    {
      name: 'Min',
      current: currentRange.minSalary / 100000,
      promotion: promotionRange ? promotionRange.minSalary / 100000 : 0
    },
    {
      name: 'Mid',
      current: currentRange.midSalary / 100000,
      promotion: promotionRange ? promotionRange.midSalary / 100000 : 0
    },
    {
      name: 'Max',
      current: currentRange.maxSalary / 100000,
      promotion: promotionRange ? promotionRange.maxSalary / 100000 : 0
    }
  ];

  const positioningData = [
    { name: 'Below 80%', value: counterProposal.compaRatio < 80 ? 1 : 0, color: '#ef4444' },
    { name: '80-90%', value: counterProposal.compaRatio >= 80 && counterProposal.compaRatio < 90 ? 1 : 0, color: '#f97316' },
    { name: '90-110%', value: counterProposal.compaRatio >= 90 && counterProposal.compaRatio <= 110 ? 1 : 0, color: '#22c55e' },
    { name: '110-120%', value: counterProposal.compaRatio > 110 && counterProposal.compaRatio <= 120 ? 1 : 0, color: '#3b82f6' },
    { name: 'Above 120%', value: counterProposal.compaRatio > 120 ? 1 : 0, color: '#8b5cf6' }
  ];

  const riskAnalysisData = [
    {
      name: 'Retention Risk',
      current: counterProposal.riskLevel === 'high' ? 80 : counterProposal.riskLevel === 'medium' ? 50 : 20,
      confidence: counterProposal.confidence
    }
  ];

  const incrementAnalysisData = [
    {
      category: 'Base Pay',
      current: 0,
      competing: ((competingOffer.basePay - employee.currentSalary) / employee.currentSalary) * 100,
      counter: ((counterProposal.basePay - employee.currentSalary) / employee.currentSalary) * 100
    },
    {
      category: 'Variable Pay',
      current: 0,
      competing: ((competingOffer.variablePay - employee.variablePay) / employee.variablePay) * 100,
      counter: ((counterProposal.variablePay - employee.variablePay) / employee.variablePay) * 100
    },
    {
      category: 'Total CTC',
      current: 0,
      competing: ((competingOffer.ctc - employee.ctc) / employee.ctc) * 100,
      counter: ((counterProposal.ctc - employee.ctc) / employee.ctc) * 100
    }
  ];

  const getPositionColor = (compaRatio: number) => {
    if (compaRatio < 80) return '#ef4444';
    if (compaRatio < 90) return '#f97316';
    if (compaRatio <= 110) return '#22c55e';
    if (compaRatio <= 120) return '#3b82f6';
    return '#8b5cf6';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Key metrics calculations
  const currentIncrease = ((counterProposal.ctc - employee.ctc) / employee.ctc) * 100;
  const competingIncrease = ((competingOffer.ctc - employee.ctc) / employee.ctc) * 100;
  const costDifference = counterProposal.ctc - competingOffer.ctc;
  const yearsOfService = new Date().getFullYear() - new Date(employee.hireDate).getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">Retention Analysis Dashboard</h2>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Retention Confidence</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{counterProposal.confidence}%</div>
          <div className="text-xs text-blue-700">AI Prediction Success Rate</div>
        </div>

        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Investment Difference</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {costDifference >= 0 ? '+' : ''}₹{(costDifference / 100000).toFixed(1)}L
          </div>
          <div className="text-xs text-green-700">Counter vs External Offer</div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Market Positioning</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{counterProposal.compaRatio.toFixed(0)}%</div>
          <div className="text-xs text-purple-700">vs Market Midpoint</div>
        </div>

        <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Tenure Value</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{yearsOfService}</div>
          <div className="text-xs text-orange-700">Years of Experience</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Compensation Comparison Chart */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Total Compensation Analysis</h3>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Compare current salary with external offer and recommended counter proposal
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={compensationComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Amount (Lakhs)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number, name: string) => [`₹${value.toFixed(1)}L`, name]} 
                labelFormatter={(label) => `${label} Package`}
              />
              <Bar dataKey="basePay" stackId="a" fill="#3b82f6" name="Base Pay" />
              <Bar dataKey="variablePay" stackId="a" fill="#10b981" name="Variable Pay" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Market Positioning Analysis */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Market Position Tracking</h3>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Track positioning relative to market midpoint (100% = market competitive)
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={compensationComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Compa-Ratio (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Market Position']} 
                labelFormatter={(label) => `${label} Positioning`}
              />
              <Area 
                type="monotone" 
                dataKey="compaRatio" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Market Competitive Range: 90-110% • Current Position: {counterProposal.marketPosition}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Range Comparison */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Career Progression Ranges</h3>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Compare current level salary ranges with promotion opportunities
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rangeAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Amount (Lakhs)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number, name: string) => [`₹${value.toFixed(1)}L`, name]} 
                labelFormatter={(label) => `${label} Range`}
              />
              <Bar dataKey="current" fill="#3b82f6" name="Current Level" />
              {promotionRange && <Bar dataKey="promotion" fill="#10b981" name="Promotion Level" />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Assessment Gauge */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Retention Risk Assessment</h3>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            AI-powered analysis of retention probability and business risk
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={riskAnalysisData}>
              <RadialBar
                dataKey="confidence"
                cornerRadius={10}
                fill={getRiskColor(counterProposal.riskLevel)}
              />
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                {counterProposal.confidence}%
              </text>
              <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-sm text-gray-600">
                Success Rate
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium`} 
                  style={{ backgroundColor: getRiskColor(counterProposal.riskLevel) + '20', color: getRiskColor(counterProposal.riskLevel) }}>
              {counterProposal.riskLevel.toUpperCase()} RETENTION RISK
            </span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Executive Summary & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-800 mb-2 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Impact
            </div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Counter proposal: <span className="font-semibold text-green-600">+{currentIncrease.toFixed(1)}%</span> increase</li>
              <li>• External offer: <span className="font-semibold text-orange-600">+{competingIncrease.toFixed(1)}%</span> increase</li>
              <li>• Investment difference: <span className="font-semibold">₹{Math.abs(costDifference / 100000).toFixed(1)}L</span></li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-800 mb-2 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Market Positioning
            </div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• New compa-ratio: <span className="font-semibold">{counterProposal.compaRatio.toFixed(1)}%</span></li>
              <li>• Market position: <span className="font-semibold">{counterProposal.marketPosition}</span></li>
              <li>• Tenure value: <span className="font-semibold">{yearsOfService} years</span> experience</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="font-semibold text-blue-800 mb-2 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Risk Assessment
            </div>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Retention confidence: <span className="font-semibold text-green-600">{counterProposal.confidence}%</span></li>
              <li>• Business risk: <span className={`font-semibold ${counterProposal.riskLevel === 'low' ? 'text-green-600' : counterProposal.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>{counterProposal.riskLevel.toUpperCase()}</span></li>
              <li>• Replacement cost: <span className="font-semibold">3-5x higher</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsAndVisuals;
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Risk Assessment</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={riskAnalysisData}>
              <RadialBar
                dataKey="confidence"
                cornerRadius={10}
                fill={getRiskColor(counterProposal.riskLevel)}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {counterProposal.confidence}%
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm text-gray-600">
                Confidence
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium`} 
                  style={{ backgroundColor: getRiskColor(counterProposal.riskLevel) + '20', color: getRiskColor(counterProposal.riskLevel) }}>
              {counterProposal.riskLevel.toUpperCase()} RISK
            </span>
          </div>
        </div>

        {/* Market Positioning Pie Chart */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-800">Market Positioning</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[{ name: counterProposal.marketPosition, value: 1, color: getPositionColor(counterProposal.compaRatio) }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill={getPositionColor(counterProposal.compaRatio)} />
              </Pie>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                {counterProposal.compaRatio.toFixed(1)}%
              </text>
              <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-xs text-gray-600">
                Compa-Ratio
              </text>
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-sm font-medium text-gray-700">{counterProposal.marketPosition}</span>
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700 mb-1">Compensation Analysis:</div>
            <ul className="space-y-1 text-gray-600">
              <li>• Counter proposal offers {currentIncrease.toFixed(1)}% increase over current</li>
              <li>• Competing offer provides {competingIncrease.toFixed(1)}% increase</li>
              <li>• New compa-ratio positions at {counterProposal.compaRatio.toFixed(1)}% of market midpoint</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">Risk Assessment:</div>
            <ul className="space-y-1 text-gray-600">
              <li>• Retention confidence: {counterProposal.confidence}%</li>
              <li>• Risk level: {counterProposal.riskLevel.toUpperCase()}</li>
              <li>• {yearsOfService} years of institutional knowledge at stake</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsAndVisuals;