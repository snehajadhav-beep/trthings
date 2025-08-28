// Mock employee data simulating HiBob data dump
export const mockEmployees = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    department: 'Engineering',
    jobTitle: 'Senior Software Engineer',
    jobFamily: 'Technology',
    jobSubFamily: 'Software Development',
    currentSalary: 2272755,
    variablePay: 227275,
    variablePercentage: 10,
    ctc: 2500030,
    hireDate: '2021-03-15',
    level: '4'
  },
  {
    id: '2',
    name: 'Rahul Gupta',
    email: 'rahul.gupta@company.com',
    department: 'Product',
    jobTitle: 'Product Manager',
    jobFamily: 'Product Management',
    jobSubFamily: 'Product Strategy',
    currentSalary: 1800000,
    variablePay: 270000,
    variablePercentage: 15,
    ctc: 2070000,
    hireDate: '2020-08-20',
    level: '3'
  },
  {
    id: '3',
    name: 'Anita Singh',
    email: 'anita.singh@company.com',
    department: 'Design',
    jobTitle: 'UX Designer',
    jobFamily: 'Design',
    jobSubFamily: 'User Experience',
    currentSalary: 1500000,
    variablePay: 150000,
    variablePercentage: 10,
    ctc: 1650000,
    hireDate: '2022-01-10',
    level: '3'
  },
  {
    id: '4',
    name: 'Vikram Patel',
    email: 'vikram.patel@company.com',
    department: 'Engineering',
    jobTitle: 'Staff Software Engineer',
    jobFamily: 'Technology',
    jobSubFamily: 'Software Development',
    currentSalary: 3200000,
    variablePay: 480000,
    variablePercentage: 15,
    ctc: 3680000,
    hireDate: '2019-05-12',
    level: '5'
  },
  {
    id: '5',
    name: 'Meera Reddy',
    email: 'meera.reddy@company.com',
    department: 'Marketing',
    jobTitle: 'Marketing Manager',
    jobFamily: 'Marketing',
    jobSubFamily: 'Digital Marketing',
    currentSalary: 1600000,
    variablePay: 240000,
    variablePercentage: 15,
    ctc: 1840000,
    hireDate: '2021-09-05',
    level: '3'
  }
];

// Mock compensation ranges from global taxonomy
export const mockCompensationRanges = [
  // Technology - Software Development
  {
    jobTitle: 'Junior Software Engineer',
    jobFamily: 'Technology',
    jobSubFamily: 'Software Development',
    level: '2',
    minSalary: 800000,
    midSalary: 1200000,
    maxSalary: 1600000,
    variablePercentage: 8
  },
  {
    jobTitle: 'Software Engineer',
    jobFamily: 'Technology',
    jobSubFamily: 'Software Development',
    level: '3',
    minSalary: 1400000,
    midSalary: 1800000,
    maxSalary: 2200000,
    variablePercentage: 10
  },
  {
    jobTitle: 'Senior Software Engineer',
    jobFamily: 'Technology',
    jobSubFamily: 'Software Development',
    level: '4',
    minSalary: 2000000,
    midSalary: 2500000,
    maxSalary: 3000000,
    variablePercentage: 12
  },
  {
    jobTitle: 'Staff Software Engineer',
    jobFamily: 'Technology',
    jobSubFamily: 'Software Development',
    level: '5',
    minSalary: 2800000,
    midSalary: 3500000,
    maxSalary: 4200000,
    variablePercentage: 15
  },
  {
    jobTitle: 'Principal Software Engineer',
    jobFamily: 'Technology',
    jobSubFamily: 'Software Development',
    level: '6',
    minSalary: 3800000,
    midSalary: 4800000,
    maxSalary: 5800000,
    variablePercentage: 18
  },

  // Product Management
  {
    jobTitle: 'Associate Product Manager',
    jobFamily: 'Product Management',
    jobSubFamily: 'Product Strategy',
    level: '2',
    minSalary: 1200000,
    midSalary: 1500000,
    maxSalary: 1800000,
    variablePercentage: 12
  },
  {
    jobTitle: 'Product Manager',
    jobFamily: 'Product Management',
    jobSubFamily: 'Product Strategy',
    level: '3',
    minSalary: 1600000,
    midSalary: 2000000,
    maxSalary: 2400000,
    variablePercentage: 15
  },
  {
    jobTitle: 'Senior Product Manager',
    jobFamily: 'Product Management',
    jobSubFamily: 'Product Strategy',
    level: '4',
    minSalary: 2200000,
    midSalary: 2800000,
    maxSalary: 3400000,
    variablePercentage: 18
  },
  {
    jobTitle: 'Principal Product Manager',
    jobFamily: 'Product Management',
    jobSubFamily: 'Product Strategy',
    level: '5',
    minSalary: 3000000,
    midSalary: 3800000,
    maxSalary: 4600000,
    variablePercentage: 20
  },

  // Design
  {
    jobTitle: 'Junior UX Designer',
    jobFamily: 'Design',
    jobSubFamily: 'User Experience',
    level: '2',
    minSalary: 800000,
    midSalary: 1100000,
    maxSalary: 1400000,
    variablePercentage: 8
  },
  {
    jobTitle: 'UX Designer',
    jobFamily: 'Design',
    jobSubFamily: 'User Experience',
    level: '3',
    minSalary: 1200000,
    midSalary: 1600000,
    maxSalary: 2000000,
    variablePercentage: 10
  },
  {
    jobTitle: 'Senior UX Designer',
    jobFamily: 'Design',
    jobSubFamily: 'User Experience',
    level: '4',
    minSalary: 1800000,
    midSalary: 2300000,
    maxSalary: 2800000,
    variablePercentage: 12
  },

  // Marketing
  {
    jobTitle: 'Marketing Specialist',
    jobFamily: 'Marketing',
    jobSubFamily: 'Digital Marketing',
    level: '2',
    minSalary: 800000,
    midSalary: 1200000,
    maxSalary: 1600000,
    variablePercentage: 10
  },
  {
    jobTitle: 'Marketing Manager',
    jobFamily: 'Marketing',
    jobSubFamily: 'Digital Marketing',
    level: '3',
    minSalary: 1400000,
    midSalary: 1800000,
    maxSalary: 2200000,
    variablePercentage: 15
  },
  {
    jobTitle: 'Senior Marketing Manager',
    jobFamily: 'Marketing',
    jobSubFamily: 'Digital Marketing',
    level: '4',
    minSalary: 2000000,
    midSalary: 2600000,
    maxSalary: 3200000,
    variablePercentage: 18
  }
];