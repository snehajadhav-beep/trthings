import React, { useState, useEffect } from 'react';
import { Briefcase, Target, CheckCircle, Info } from 'lucide-react';

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
  employee: Employee | null;
  ranges: CompensationRange[];
  selectedRange: CompensationRange | null;
  onSelectRange: (range: CompensationRange) => void;
  promotionRange: CompensationRange | null;
  onSelectPromotionRange: (range: CompensationRange) => void;
}

interface Employee {
  id: string;
  name: string;
  jobTitle: string;
  jobFamily: string;
  jobSubFamily: string;
  level: string;
}

const JobTitleSelector: React.FC<JobTitleSelectorProps> = ({
  employee,
  ranges,
  selectedRange,
  onSelectRange,
  promotionRange,
  onSelectPromotionRange
}) => {
  const [promotionRanges, setPromotionRanges] = useState<CompensationRange[]>([]);

  // Auto-populate current range based on employee
  useEffect(() => {
    if (employee) {
      // Find matching range for current employee
      const currentRange = ranges.find(r => 
        r.jobTitle === employee.jobTitle &&
        r.jobFamily === employee.jobFamily &&
        r.jobSubFamily === employee.jobSubFamily &&
        r.level === employee.level
      );
      
      if (currentRange && currentRange !== selectedRange) {
        onSelectRange(currentRange);
      }
    }
  }, [employee, ranges, selectedRange, onSelectRange]);

  // Find promotion ranges when current range is selected
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
      <div className="flex items-center space-x-2 mb-4">
        <Briefcase className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">Job Title & Compensation Ranges</h2>
      </div>
      
      {!employee && (
        <div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="h-5 w-5 text-blue-600" />
          <p className="text-blue-800">Select an employee to automatically populate job title and compensation ranges.</p>
        </div>
      )}

      {selectedRange && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Current Level Range</h3>
            </div>
            
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800">{selectedRange.jobTitle}</div>
              <div className="text-xs text-blue-600">{selectedRange.jobFamily} • {selectedRange.jobSubFamily} • Level {selectedRange.level}</div>
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
            
            {promotionRanges.length > 0 ? (
              <div className="space-y-3">
                {promotionRanges.map(range => (
                  <button
                    key={`${range.jobTitle}-${range.level}`}
                    onClick={() => onSelectPromotionRange(range)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                      promotionRange?.jobTitle === range.jobTitle
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{range.jobTitle}</div>
                    <div className="text-sm text-gray-600">Level {range.level} • {range.jobFamily}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-gray-600 text-sm">No promotion options available for the next level.</p>
              </div>
            )}
            
            {promotionRange && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-2">Selected Promotion Range</div>
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