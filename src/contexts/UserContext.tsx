import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Admin' | 'Super Admin' | 'Provider' | 'Provider-Admin' | 'Manager' | 'HR Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
  isActive: boolean;
  practiceStates?: string[]; // For providers
  specialty?: string; // For providers
  services?: string[]; // For providers
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'admin@olahealth.com',
    role: 'Super Admin',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@olahealth.com',
    role: 'Provider',
    isActive: true,
    practiceStates: ['CA', 'NY', 'TX'],
    specialty: 'Family Medicine',
    services: ['Consultation', 'Prescription', 'Follow-up'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mary Wilson',
    email: 'hr@hiltonhotel.com',
    role: 'HR Manager',
    organization: 'Hilton Hotel',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=32&h=32&fit=crop&crop=face'
  }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]); // Default to admin for demo

  const isAuthenticated = !!currentUser;

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;

    const rolePermissions: Record<UserRole, string[]> = {
      'Super Admin': ['all'],
      'Admin': ['manage_users', 'view_statistics', 'manage_services', 'manage_plans', 'view_prescriptions', 'virtual_queue'],
      'Provider-Admin': ['manage_users', 'view_statistics', 'manage_services', 'manage_plans', 'view_prescriptions', 'edit_prescriptions', 'view_patients', 'virtual_queue'],
      'Provider': ['view_patients', 'edit_prescriptions', 'virtual_queue'],
      'Manager': ['basic_access'],
      'HR Manager': ['manage_employees', 'assign_plans', 'utilization_report', 'census_upload']
    };

    const userPermissions = rolePermissions[currentUser.role];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      isAuthenticated,
      hasPermission,
      login,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};