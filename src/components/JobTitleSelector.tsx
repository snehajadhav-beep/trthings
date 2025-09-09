import React, { useState, useEffect } from 'react';
import { ChevronDown, Briefcase, Target } from 'lucide-react';

interface CompensationRange {
  jobTitle: string;
  jobFamily: string;
  jobSubFamily: string;
  level: string;
  minSalary: number;
  midSalary: number;
  maxSalary: number;
  variablePercentage: number;
}

interface JobTitleSelectorProps {
  ranges: CompensationRange[];
  selectedRange: CompensationRange | null;
  onSelectRange: (range: CompensationRange) => void;
  promotionRange: CompensationRange | null;
  onSelectPromotionRange: (range: CompensationRange) => void;
}

const JobTitleSelector: React.FC<JobTitleSelectorProps> = ({
  ranges,
  selectedRange,
  onSelectRange,
  promotionRange,
  onSelectPromotionRange
}) => {
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedSubFamily, setSelectedSubFamily] = useState('');
  const [filteredRanges, setFilteredRanges] = useState<CompensationRange[]>([]);
  const [promotionRanges, setPromotionRanges] = useState<CompensationRange[]>([]);

  const jobFamilies = [...new Set(ranges.map(r => r.jobFamily))];
  const jobSubFamilies = selectedFamily 
    ? [...new Set(ranges.filter(r => r.jobFamily === selectedFamily).map(r => r.jobSubFamily))]
    : [];

  useEffect(() => {
    let filtered = ranges;
    
    if (selectedFamily) {
      filtered = filtered.filter(r => r.jobFamily === selectedFamily);
    }
    
    if (selectedSubFamily) {
      filtered = filtered.filter(r => r.jobSubFamily === selectedSubFamily);
    }
    
    setFilteredRanges(filtered);
  }, [selectedFamily, selectedSubFamily, ranges]);

  useEffect(() => {
    if (selectedRange) {
      // Find next level roles for promotion
      const currentLevel = parseInt(selectedRange.level);
      const nextLevel = currentLevel + 1;
      
      const nextLevelRanges = ranges.filter(r => 
        r.jobFamily === selectedRange.jobFamily &&
        parseInt(r.level) === nextLevel
      );
      
      setPromotionRanges(nextLevelRanges);
    }
  }, [selectedRange, ranges]);

  const calculateCompaRatio = (currentSalary: number, midSalary: number) => {
    return ((currentSalary / midSalary) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Title & Compensation Ranges</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Family</label>
          <div className="relative">
            <select
              value={selectedFamily}
              onChange={(e) => {
                setSelectedFamily(e.target.value);
                setSelectedSubFamily('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">Select Job Family</option>
              {jobFamilies.map(family => (
                <option key={family} value={family}>{family}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Sub-Family</label>
          <div className="relative">
            <select
              value={selectedSubFamily}
              onChange={(e) => setSelectedSubFamily(e.target.value)}
              disabled={!selectedFamily}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100"
            >
              <option value="">Select Sub-Family</option>
              {jobSubFamilies.map(subFamily => (
                <option key={subFamily} value={subFamily}>{subFamily}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
          <div className="relative">
            <select
              value={selectedRange?.jobTitle || ''}
              onChange={(e) => {
                const range = filteredRanges.find(r => r.jobTitle === e.target.value);
                if (range) onSelectRange(range);
              }}
              disabled={!selectedSubFamily}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none disabled:bg-gray-100"
            >
              <option value="">Select Job Title</option>
              {filteredRanges.map(range => (
                <option key={`${range.jobTitle}-${range.level}`} value={range.jobTitle}>
                  {range.jobTitle} (Level {range.level})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {selectedRange && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Current Level Range</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Min Salary</div>
                  <div className="font-semibold">₹{selectedRange.minSalary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Mid Salary</div>
                  <div className="font-semibold text-blue-600">₹{selectedRange.midSalary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Max Salary</div>
                  <div className="font-semibold">₹{selectedRange.maxSalary.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-1">Variable Pay</div>
                <div className="font-semibold">{selectedRange.variablePercentage}%</div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800">Promotion Options</h3>
            </div>
            
            <div className="relative">
              <select
                value={promotionRange?.jobTitle || ''}
                onChange={(e) => {
                  const range = promotionRanges.find(r => r.jobTitle === e.target.value);
                  if (range) onSelectPromotionRange(range);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
              >
                <option value="">Select Promotion Title</option>
                {promotionRanges.map(range => (
                  <option key={`${range.jobTitle}-${range.level}`} value={range.jobTitle}>
                    {range.jobTitle} (Level {range.level})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            
            {promotionRange && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500">Min</div>
                    <div className="font-semibold">₹{promotionRange.minSalary.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Mid</div>
                    <div className="font-semibold text-green-600">₹{promotionRange.midSalary.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Max</div>
                    <div className="font-semibold">₹{promotionRange.maxSalary.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">Variable:</span>
                  <span className="font-semibold ml-1">{promotionRange.variablePercentage}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTitleSelector;