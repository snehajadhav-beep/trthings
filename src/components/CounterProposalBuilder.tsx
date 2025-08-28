import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, DollarSign, Percent, Target, Lightbulb, BarChart3, Users, Edit3 } from 'lucide-react';

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

interface CounterProposalBuilderProps {
  employee: Employee | null;
  competingOffer: CompetingOffer;
  currentRange: CompensationRange | null;
  promotionRange: CompensationRange | null;
  onProposalChange: (proposal: CounterProposal) => void;
}

const CounterProposalBuilder: React.FC<CounterProposalBuilderProps> = ({
  employee,
  competingOffer,
  currentRange,
  promotionRange,
  onProposalChange
}) => {
  const [aiSuggestion, setAiSuggestion] = useState<CounterProposal | null>(null);
  const [customProposal, setCustomProposal] = useState<CounterProposal | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<'conservative' | 'competitive' | 'aggressive' | 'custom'>('competitive');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [customRationale, setCustomRationale] = useState('');
  const [showRationaleEditor, setShowRationaleEditor] = useState(false);

  // Calculate positioning metrics
  const calculatePositioning = (salary: number, range: CompensationRange | null) => {
    if (!range) return { compaRatio: 0, rangePosition: 0, marketPosition: 'Unknown' };
    
    const compaRatio = (salary / range.midSalary) * 100;
    const rangePosition = ((salary - range.minSalary) / (range.maxSalary - range.minSalary)) * 100;
    
    let marketPosition = '';
    if (compaRatio < 80) marketPosition = 'Below Market';
    else if (compaRatio < 90) marketPosition = 'Below Mid-Market';
    else if (compaRatio < 110) marketPosition = 'Market Competitive';
    else if (compaRatio < 120) marketPosition = 'Above Market';
    else marketPosition = 'Premium Market';
    
    return { compaRatio, rangePosition: Math.max(0, Math.min(100, rangePosition)), marketPosition };
  };

  // AI-powered rationale suggestions
  const generateRationaleSuggestions = (
    employee: Employee,
    currentRange: CompensationRange | null,
    competingOffer: CompetingOffer,
    strategy: string
  ): string[] => {
    const suggestions = [];
    const yearsOfService = new Date().getFullYear() - new Date(employee.hireDate).getFullYear();
    const currentPositioning = calculatePositioning(employee.currentSalary, currentRange);
    const offerIncrease = ((competingOffer.ctc - employee.ctc) / employee.ctc) * 100;
    
    // Performance-based rationales
    if (currentPositioning.compaRatio < 90) {
      suggestions.push('Employee is currently below market midpoint, adjustment needed to align with market standards');
    }
    
    // Tenure-based rationales
    if (yearsOfService >= 3) {
      suggestions.push(`Recognizing ${yearsOfService} years of dedicated service and institutional knowledge`);
    }
    
    // Market pressure rationales
    if (offerIncrease > 30) {
      suggestions.push('Significant market pressure requires competitive response to retain critical talent');
    }
    
    // Department-specific rationales
    if (employee.department === 'Engineering') {
      suggestions.push('Critical technical skills in high demand, retention essential for product delivery');
    }
    
    // Promotion rationales
    if (promotionRange && strategy === 'aggressive') {
      suggestions.push('Promotion to next level justified by expanded responsibilities and market benchmarking');
    }
    
    // Risk mitigation rationales
    suggestions.push('Retention investment significantly lower than replacement costs and knowledge transfer risks');
    
    // Strategic rationales
    if (employee.level === '4' || employee.level === '5') {
      suggestions.push('Senior contributor with mentoring responsibilities, loss would impact team productivity');
    }
    
    return suggestions;
  };

  // Enhanced AI proposal generation with positioning analysis
  const generateAIProposal = (strategy: 'conservative' | 'competitive' | 'aggressive'): CounterProposal => {
    if (!employee || !currentRange || competingOffer.ctc === 0) {
      return {
        basePay: 0,
        variablePay: 0,
        variablePercentage: 0,
        ctc: 0,
        rationale: '',
        riskLevel: 'medium',
        confidence: 0,
        compaRatio: 0,
        rangePosition: 0,
        marketPosition: 'Unknown'
      };
    }

    const currentPositioning = calculatePositioning(employee.currentSalary, currentRange);
    const competingOfferIncrease = ((competingOffer.ctc - employee.ctc) / employee.ctc) * 100;
    const yearsOfService = new Date().getFullYear() - new Date(employee.hireDate).getFullYear();
    
    let proposalBasePay: number;
    let proposalVariablePercentage: number;
    let riskLevel: 'low' | 'medium' | 'high';
    let confidence: number;
    let baseRationale: string;

    switch (strategy) {
      case 'conservative':
        // Target 75-85% of competing offer increase, stay within current range
        const conservativeIncrease = Math.min(competingOfferIncrease * 0.8, 15);
        proposalBasePay = Math.min(
          employee.currentSalary * (1 + conservativeIncrease / 100),
          currentRange.maxSalary * 0.95
        );
        proposalVariablePercentage = Math.min(currentRange.variablePercentage, employee.variablePercentage + 1);
        riskLevel = 'high'; // High risk of losing employee with conservative approach
        confidence = 65;
        baseRationale = `Conservative ${conservativeIncrease.toFixed(1)}% increase maintaining budget discipline while addressing market pressure`;
        break;

      case 'competitive':
        // Target 85-95% of competing offer, may exceed current range
        const competitiveIncrease = Math.min(competingOfferIncrease * 0.9, 25);
        proposalBasePay = Math.min(
          employee.currentSalary * (1 + competitiveIncrease / 100),
          currentRange.maxSalary * 1.1
        );
        proposalVariablePercentage = currentRange.variablePercentage;
        riskLevel = 'medium';
        confidence = 85;
        baseRationale = `Market-competitive ${competitiveIncrease.toFixed(1)}% increase balancing retention risk with cost management`;
        break;

      case 'aggressive':
        // Match or exceed competing offer, consider promotion
        const targetBasePay = promotionRange 
          ? Math.min(promotionRange.midSalary, competingOffer.basePay * 1.05)
          : Math.min(currentRange.maxSalary * 1.2, competingOffer.basePay * 1.02);
        proposalBasePay = targetBasePay;
        proposalVariablePercentage = promotionRange?.variablePercentage || currentRange.variablePercentage + 2;
        riskLevel = 'low';
        confidence = 90;
        baseRationale = `Aggressive retention strategy matching external market to secure critical talent`;
        break;

      default:
        proposalBasePay = employee.currentSalary;
        proposalVariablePercentage = employee.variablePercentage;
        riskLevel = 'medium';
        confidence = 50;
        baseRationale = '';
    }

    const proposalVariablePay = (proposalBasePay * proposalVariablePercentage) / 100;
    const proposalCTC = proposalBasePay + proposalVariablePay;
    const positioning = calculatePositioning(proposalBasePay, currentRange);

    // Enhance confidence based on positioning and context
    if (positioning.compaRatio >= 90 && positioning.compaRatio <= 110) confidence += 10;
    if (yearsOfService > 3) confidence += 5;
    if (employee.department === 'Engineering') confidence += 5;
    if (competingOfferIncrease > 40) confidence -= 10;

    // Generate comprehensive rationale
    const rationaleElements = generateRationaleSuggestions(employee, currentRange, competingOffer, strategy);
    const enhancedRationale = `${baseRationale}. ${rationaleElements.slice(0, 2).join('. ')}.`;

    return {
      basePay: Math.round(proposalBasePay),
      variablePay: Math.round(proposalVariablePay),
      variablePercentage: proposalVariablePercentage,
      ctc: Math.round(proposalCTC),
      rationale: enhancedRationale,
      riskLevel,
      confidence: Math.min(Math.max(confidence, 0), 100),
      compaRatio: positioning.compaRatio,
      rangePosition: positioning.rangePosition,
      marketPosition: positioning.marketPosition
    };
  };

  useEffect(() => {
    if (employee && competingOffer.ctc > 0 && currentRange) {
      const suggestion = generateAIProposal(selectedStrategy);
      setAiSuggestion(suggestion);
      
      if (selectedStrategy !== 'custom') {
        onProposalChange(suggestion);
      }
    }
  }, [employee, competingOffer, currentRange, promotionRange, selectedStrategy]);

  const handleCustomChange = (field: keyof CounterProposal, value: number) => {
    if (!employee || !currentRange) return;

    const updatedProposal = { ...customProposal } || {
      basePay: employee.currentSalary,
      variablePay: employee.variablePay,
      variablePercentage: employee.variablePercentage,
      ctc: employee.ctc,
      rationale: customRationale || 'Custom proposal based on specific circumstances',
      riskLevel: 'medium' as const,
      confidence: 70,
      compaRatio: 0,
      rangePosition: 0,
      marketPosition: 'Unknown'
    };

    if (field === 'basePay') {
      updatedProposal.basePay = value;
      updatedProposal.variablePay = (value * updatedProposal.variablePercentage) / 100;
    } else if (field === 'variablePercentage') {
      updatedProposal.variablePercentage = value;
      updatedProposal.variablePay = (updatedProposal.basePay * value) / 100;
    } else if (field === 'variablePay') {
      updatedProposal.variablePay = value;
      updatedProposal.variablePercentage = updatedProposal.basePay > 0 ? (value / updatedProposal.basePay) * 100 : 0;
    }

    updatedProposal.ctc = updatedProposal.basePay + updatedProposal.variablePay;
    
    // Calculate positioning for custom proposal
    const positioning = calculatePositioning(updatedProposal.basePay, currentRange);
    updatedProposal.compaRatio = positioning.compaRatio;
    updatedProposal.rangePosition = positioning.rangePosition;
    updatedProposal.marketPosition = positioning.marketPosition;
    
    // Update risk assessment
    const increasePercent = ((updatedProposal.ctc - employee.ctc) / employee.ctc) * 100;
    if (increasePercent < 10) {
      updatedProposal.riskLevel = 'high';
    } else if (increasePercent < 20) {
      updatedProposal.riskLevel = 'medium';
    } else {
      updatedProposal.riskLevel = 'low';
    }

    updatedProposal.rationale = customRationale || `Custom proposal with ${increasePercent.toFixed(1)}% increase over current compensation`;

    setCustomProposal(updatedProposal);
    onProposalChange(updatedProposal);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPositionColor = (compaRatio: number) => {
    if (compaRatio < 80) return 'text-red-600';
    if (compaRatio < 90) return 'text-orange-600';
    if (compaRatio <= 110) return 'text-green-600';
    if (compaRatio <= 120) return 'text-blue-600';
    return 'text-purple-600';
  };

  if (!employee || competingOffer.ctc === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">AI Counter Proposal Builder</h2>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Select an employee and enter competing offer details to generate AI-powered counter proposals.</p>
        </div>
      </div>
    );
  }

  const currentProposal = selectedStrategy === 'custom' ? customProposal : aiSuggestion;
  const currentPositioning = calculatePositioning(employee.currentSalary, currentRange);
  const competingPositioning = calculatePositioning(competingOffer.basePay, currentRange);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-800">AI Counter Proposal Builder</h2>
        </div>
        <button
          onClick={() => setShowAIInsights(!showAIInsights)}
          className="flex items-center space-x-2 px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Lightbulb className="h-4 w-4" />
          <span>{showAIInsights ? 'Hide' : 'Show'} AI Insights</span>
        </button>
      </div>

      {/* Current vs Competing Positioning Analysis */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Market Positioning Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Current Position</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Compa-Ratio:</span>
                <span className={`font-semibold ${getPositionColor(currentPositioning.compaRatio)}`}>
                  {currentPositioning.compaRatio.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Range Position:</span>
                <span className="font-semibold text-gray-800">{currentPositioning.rangePosition.toFixed(0)}%</span>
              </div>
              <div className="text-xs text-gray-500">{currentPositioning.marketPosition}</div>
            </div>
          </div>
          
          <div className="p-3 bg-white rounded-lg border border-orange-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Competing Offer Position</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Compa-Ratio:</span>
                <span className={`font-semibold ${getPositionColor(competingPositioning.compaRatio)}`}>
                  {competingPositioning.compaRatio.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Range Position:</span>
                <span className="font-semibold text-gray-800">{competingPositioning.rangePosition.toFixed(0)}%</span>
              </div>
              <div className="text-xs text-gray-500">{competingPositioning.marketPosition}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Retention Strategy</label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { key: 'conservative', label: 'Conservative', desc: 'Budget-friendly, 75-85% match', risk: 'Higher retention risk' },
            { key: 'competitive', label: 'Competitive', desc: 'Market-aligned, 85-95% match', risk: 'Balanced approach' },
            { key: 'aggressive', label: 'Aggressive', desc: 'Exceed offer, secure talent', risk: 'Higher cost investment' },
            { key: 'custom', label: 'Custom', desc: 'Manual adjustments', risk: 'Full control' }
          ].map((strategy) => (
            <button
              key={strategy.key}
              onClick={() => setSelectedStrategy(strategy.key as any)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedStrategy === strategy.key
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{strategy.label}</div>
              <div className="text-xs text-gray-500 mt-1">{strategy.desc}</div>
              <div className="text-xs text-gray-400 mt-1">{strategy.risk}</div>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAIInsights && aiSuggestion && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-800 mb-2">AI Analysis & Recommendation</h3>
              <p className="text-sm text-purple-700 mb-3">{aiSuggestion.rationale}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`px-3 py-2 rounded-lg border ${getRiskColor(aiSuggestion.riskLevel)}`}>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span className="font-medium text-sm">Risk: {aiSuggestion.riskLevel.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium text-sm">
                      Confidence: <span className={getConfidenceColor(aiSuggestion.confidence)}>{aiSuggestion.confidence}%</span>
                    </span>
                  </div>
                </div>
                
                <div className="px-3 py-2 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm text-blue-800">
                      New Compa: {aiSuggestion.compaRatio.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Proposal Inputs */}
      {selectedStrategy === 'custom' && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Custom Counter Proposal</h3>
            <button
              onClick={() => setShowRationaleEditor(!showRationaleEditor)}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Rationale</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Base Pay (INR)</span>
                </div>
              </label>
              <input
                type="number"
                value={customProposal?.basePay || employee.currentSalary}
                onChange={(e) => handleCustomChange('basePay', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                step="0.1"
                value={customProposal?.variablePercentage || employee.variablePercentage}
                onChange={(e) => handleCustomChange('variablePercentage', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Variable Pay (INR)</span>
                </div>
              </label>
              <input
                type="number"
                value={customProposal?.variablePay || employee.variablePay}
                onChange={(e) => handleCustomChange('variablePay', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Rationale Editor */}
          {showRationaleEditor && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Rationale</label>
              <textarea
                value={customRationale}
                onChange={(e) => setCustomRationale(e.target.value)}
                placeholder="Enter business justification for this proposal..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              {/* AI Rationale Suggestions */}
              <div className="mt-2">
                <div className="text-xs font-medium text-gray-600 mb-2">AI Suggested Rationales:</div>
                <div className="space-y-1">
                  {generateRationaleSuggestions(employee, currentRange, competingOffer, selectedStrategy).slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomRationale(suggestion)}
                      className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded border border-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Proposal Summary */}
      {currentProposal && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">Recommended Counter Proposal</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-4">
            <div>
              <div className="text-gray-600">Base Pay</div>
              <div className="font-semibold text-blue-800">₹{currentProposal.basePay.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Variable Pay</div>
              <div className="font-semibold text-blue-800">₹{currentProposal.variablePay.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Variable %</div>
              <div className="font-semibold text-blue-800">{currentProposal.variablePercentage.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-600">Total CTC</div>
              <div className="font-semibold text-blue-800">₹{currentProposal.ctc.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">Compa-Ratio</div>
              <div className={`font-semibold ${getPositionColor(currentProposal.compaRatio)}`}>
                {currentProposal.compaRatio.toFixed(1)}%
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-blue-200 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Increase over current:</span>
              <span className="ml-2 font-semibold text-green-600">
                {(((currentProposal.ctc - employee.ctc) / employee.ctc) * 100).toFixed(2)}%
              </span>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Market Position:</span>
              <span className="ml-2 font-semibold text-blue-800">{currentProposal.marketPosition}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterProposalBuilder;