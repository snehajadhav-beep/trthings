import React, { useState } from 'react';
import { Calculator, Users, FileText, Download } from 'lucide-react';
import EmployeeSearch from './components/EmployeeSearch';
import JobTitleSelector from './components/JobTitleSelector';
import CompetingOfferInput from './components/CompetingOfferInput';
import CounterProposalBuilder from './components/CounterProposalBuilder';
import ComparisonTables from './components/ComparisonTables';
import ChartsAndVisuals from './components/ChartsAndVisuals';
import { mockEmployees, mockCompensationRanges } from './data/mockData';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  jobFamily: string;
  jobSubFamily: string;
  currentSalary: number;
  variablePay: number;
  variablePercentage: number;
  ctc: number;
  hireDate: string;
  level: string;
}

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

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedRange, setSelectedRange] = useState<CompensationRange | null>(null);
  const [promotionRange, setPromotionRange] = useState<CompensationRange | null>(null);
  const [competingOffer, setCompetingOffer] = useState<CompetingOffer>({
    basePay: 0,
    variablePay: 0,
    ctc: 0
  });
  const [counterProposal, setCounterProposal] = useState<CounterProposal | null>(null);
  
  // Mock exchange rate (INR to USD)
  const exchangeRate = 85.5;

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    // Reset other selections when employee changes
    setSelectedRange(null);
    setPromotionRange(null);
  };

  const handleExport = () => {
    if (!selectedEmployee) return;
    
    // In a real application, this would generate and download an Excel/PDF file
    alert('Export functionality would be implemented here to generate Excel/PDF reports');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Retention Calculator</h1>
                <p className="text-sm text-gray-500">Employee Compensation Analysis & Counter Proposals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{mockEmployees.length} Employees</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{mockCompensationRanges.length} Job Ranges</span>
              </div>
              <button
                onClick={handleExport}
                disabled={!selectedEmployee}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Employee Search */}
          <EmployeeSearch
            employees={mockEmployees}
            onSelectEmployee={handleEmployeeSelect}
            selectedEmployee={selectedEmployee}
          />

          {selectedEmployee && (
            <>
              {/* Job Title Selector */}
              <JobTitleSelector
                employee={selectedEmployee}
                ranges={mockCompensationRanges}
                selectedRange={selectedRange}
                onSelectRange={setSelectedRange}
                promotionRange={promotionRange}
                onSelectPromotionRange={setPromotionRange}
              />

              {/* Competing Offer Input */}
              <CompetingOfferInput onOfferChange={setCompetingOffer} />

              {/* Counter Proposal Builder */}
              {(competingOffer.ctc > 0 || competingOffer.basePay > 0) && (
                <CounterProposalBuilder
                  employee={selectedEmployee}
                  competingOffer={competingOffer}
                  currentRange={selectedRange}
                  promotionRange={promotionRange}
                  onProposalChange={setCounterProposal}
                />
              )}

              {/* Comparison Tables */}
              {(competingOffer.ctc > 0 || competingOffer.basePay > 0) && counterProposal && (
                <ComparisonTables
                  employee={selectedEmployee}
                  competingOffer={competingOffer}
                  promotionRange={promotionRange}
                  counterProposal={counterProposal}
                  currentRange={selectedRange}
                  exchangeRate={exchangeRate}
                />
              )}

              {/* Charts and Visual Analytics */}
              {(competingOffer.ctc > 0 || competingOffer.basePay > 0) && counterProposal && (
                <ChartsAndVisuals
                  employee={selectedEmployee}
                  competingOffer={competingOffer}
                  counterProposal={counterProposal}
                  currentRange={selectedRange}
                  promotionRange={promotionRange}
                  exchangeRate={exchangeRate}
                />
              )}
            </>
          )}

          {!selectedEmployee && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Retention Calculator</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Start by searching and selecting an employee to analyze their current compensation, 
                compare with competing offers, and generate counter proposals for retention discussions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">Employee Data</h3>
                  <p className="text-sm text-gray-600">Access current compensation and role details</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <FileText className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">Compensation Ranges</h3>
                  <p className="text-sm text-gray-600">Compare with market data and promotion levels</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <Calculator className="h-8 w-8 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">Smart Calculations</h3>
                  <p className="text-sm text-gray-600">Generate competitive counter proposals</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Retention Calculator • Built for HR Teams • Exchange Rate: ₹{exchangeRate}/USD</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;