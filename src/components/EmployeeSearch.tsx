import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Building, Calendar, DollarSign } from 'lucide-react';

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

interface EmployeeSearchProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  selectedEmployee: Employee | null;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  employees,
  onSelectEmployee,
  selectedEmployee
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, employees]);

  const handleSelectEmployee = (employee: Employee) => {
    onSelectEmployee(employee);
    setSearchTerm(employee.name);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Search</h2>
      
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {showDropdown && filteredEmployees.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectEmployee(employee)}
              >
                <div className="font-medium text-gray-900">{employee.name}</div>
                <div className="text-sm text-gray-500">{employee.email} • {employee.department}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEmployee && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Employee</div>
                <div className="font-medium">{selectedEmployee.name}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{selectedEmployee.email}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Department</div>
                <div className="font-medium">{selectedEmployee.department}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Hire Date</div>
                <div className="font-medium">{selectedEmployee.hireDate}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Current CTC</div>
                <div className="font-medium">₹{selectedEmployee.ctc.toLocaleString()}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500">Job Title</div>
              <div className="font-medium">{selectedEmployee.jobTitle}</div>
              <div className="text-xs text-gray-400">{selectedEmployee.jobFamily} • {selectedEmployee.jobSubFamily}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSearch;