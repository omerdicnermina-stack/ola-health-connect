import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import olaHealthLogo from '@/assets/ola-health-logo.png';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
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
  FileBarChart
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
}

const navigationItems: NavigationItem[] = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Virtual Queue', url: '/virtual-queue', icon: Clock, permission: 'virtual_queue' },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
  { title: 'Messages', url: '/messages', icon: MessageSquare },
  { title: 'Prescriptions', url: '/prescriptions', icon: Pill, permission: 'view_prescriptions' },
  { title: 'Patients', url: '/patients', icon: Users, permission: 'view_patients' },
  { title: 'Users', url: '/users', icon: UserCog, permission: 'manage_users' },
  { title: 'Organizations', url: '/organizations', icon: Building2, permission: 'manage_users' },
  { title: 'Statistics', url: '/statistics', icon: BarChart3, permission: 'view_statistics' },
  { title: 'Services', url: '/services', icon: Stethoscope, permission: 'manage_services' },
  { title: 'Plans', url: '/plans', icon: CreditCard, permission: 'manage_plans' },
  { title: 'Visits', url: '/visits', icon: FileBarChart },
  { title: 'Household', url: '/household', icon: Users, permission: 'manage_household' },
  { title: 'Utilization Report', url: '/utilization-report', icon: FileBarChart, permission: 'utilization_report' },
  { title: 'Settings', url: '/settings', icon: Settings },
  { title: 'Help', url: '/help', icon: HelpCircle }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const currentPath = location.pathname;

  const filteredItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

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
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(isActive(item.url))}
                    >
                      <item.icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
                      {!collapsed && <span>{item.title}</span>}
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