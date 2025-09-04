import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import olaHealthLogo from '@/assets/ola-health-logo.png';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  MessageSquare,
  HelpCircle,
  Pill,
  Users,
  UserCog,
  Building2,
  BarChart3,
  Stethoscope,
  CreditCard,
  Calendar,
  Clock,
  FileBarChart,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  permission?: string;
  hasNotification?: boolean;
}

const navigationItems: NavigationItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Virtual Queue', url: '/virtual-queue', icon: Clock, permission: 'virtual_queue' },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Messages', url: '/messages', icon: MessageSquare, hasNotification: true },
  { title: 'Prescriptions', url: '/prescriptions', icon: Pill, permission: 'view_prescriptions' },
  { title: 'Patients', url: '/patients', icon: Users, permission: 'view_patients' },
  { title: 'Ola EHR/EMR', url: '/ola-ehr', icon: FileText, permission: 'super_admin' },
  { title: 'Organizations', url: '/organizations', icon: Building2, permission: 'manage_users' },
  { title: 'Services', url: '/services', icon: Stethoscope, permission: 'manage_services' },
  { title: 'Plans', url: '/plans', icon: CreditCard, permission: 'manage_plans' },
  { title: 'Household', url: '/household', icon: Users, permission: 'manage_household' },
  { title: 'Questionnaires', url: '/questionnaires', icon: FileText, permission: 'manage_questionnaires' },
  { title: 'Users', url: '/users', icon: UserCog, permission: 'manage_users' },
  { title: 'Utilization Report', url: '/utilization-report', icon: FileBarChart, permission: 'utilization_report' },
  { title: 'Help', url: '/help', icon: HelpCircle }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasPermission, user } = useAuth();
  const currentPath = location.pathname;

  const filteredItems = navigationItems.filter(item => {
    // Hide Prescriptions, Patients, and Household for Super Admin (they get Ola EHR/EMR instead)
    if (user?.profile?.role === 'Super Admin' && (item.title === 'Prescriptions' || item.title === 'Patients' || item.title === 'Household')) {
      return false;
    }
    // Hide Ola EHR/EMR for non-Super Admin users
    if (item.title === 'Ola EHR/EMR' && user?.profile?.role !== 'Super Admin') {
      return false;
    }
    return !item.permission || hasPermission(item.permission);
  });

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (active: boolean) => cn(
    'w-full justify-start transition-colors duration-200',
    active 
      ? 'bg-primary text-primary-foreground shadow-sm' 
      : 'hover:bg-accent hover:text-accent-foreground'
  );

  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center">
            <img 
              src={olaHealthLogo} 
              alt="OLA Health" 
              className="h-8 w-auto"
            />
          </div>
        )}
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          
          <SidebarGroupContent>
            <SidebarMenu>
               {filteredItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild className={item.hasNotification && collapsed ? "relative" : ""}>
                     <NavLink 
                       to={item.url} 
                       className={getNavClass(isActive(item.url))}
                     >
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center">
                           <item.icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
                           {!collapsed && <span>{item.title}</span>}
                         </div>
                         {!collapsed && item.hasNotification && (
                           <Badge variant="destructive" className="text-xs h-4 min-w-[16px] px-1">
                             1
                           </Badge>
                         )}
                         {collapsed && item.hasNotification && (
                           <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
                         )}
                       </div>
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="text-xs text-muted-foreground">
              24/7 Telemedicine Care
            </div>
            <div className="text-xs text-muted-foreground">
              All 50 States USA
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}