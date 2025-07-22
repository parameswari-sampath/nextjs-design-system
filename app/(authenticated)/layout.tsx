"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { 
  FaHome, 
  FaBook, 
  FaUsers, 
  FaChartBar, 
  FaCalendarAlt, 
  FaCog,
  FaEnvelope,
  FaFile,
  FaQuestionCircle,
  FaPlay,
  FaCheck,
  FaArchive,
  FaUser,
  FaShield,
  FaBuilding,
  FaEye,
  FaArrowUp,
  FaBullseye,
  FaFileAlt,
  FaSlidersH,
  FaLock,
  FaBell,
  FaCreditCard,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardList,
  FaTasks,
  FaGraduationCap,
  FaCertificate,
  FaBookOpen,
  FaEdit,
  FaComments
} from 'react-icons/fa';

// Utility function to clear authentication data
const logout = () => {
  // Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  
  // Clear cookies properly
  const clearCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax`;
  };
  
  clearCookie('access_token');
  clearCookie('refresh_token');
  
  // Redirect to login
  window.location.href = '/login';
};

// Get user data from localStorage
const getUserData = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentNavigation, setCurrentNavigation] = useState([
    { label: "Dashboard", onClick: () => handleNavigation([{ label: "Dashboard" }]) }
  ]);

  // Role-based menu items
  const getMenuItems = (userRole: string) => {
    if (userRole === 'TEACHER') {
      return [
        { id: 1, label: "Dashboard", path: ["Dashboard"], icon: FaHome, route: "/dashboard" },
        { id: 2, label: "Question Bank", path: ["Question Bank"], icon: FaQuestionCircle, route: "/question-bank" },
        { id: 3, label: "Test", path: ["Test"], icon: FaFileAlt, route: "/test" },
        { id: 4, label: "Analytics", path: ["Analytics"], icon: FaChartBar, route: "/analytics" },
        { id: 5, label: "Profile", path: ["Profile"], icon: FaUser, route: "/profile" }
      ];
    } else {
      // STUDENT menu items
      return [
        { id: 1, label: "Dashboard", path: ["Dashboard"], icon: FaHome, route: "/dashboard" },
        { id: 2, label: "Test", path: ["Test"], icon: FaFileAlt, route: "/test" },
        { id: 3, label: "Results", path: ["Results"], icon: FaChartBar, route: "/results" },
        { id: 4, label: "Profile", path: ["Profile"], icon: FaUser, route: "/profile" }
      ];
    }
  };

  const handleNavigation = (path: Array<{label: string, onClick?: () => void}>) => {
    // Always ensure SmartMCQ is the first breadcrumb
    const breadcrumbPath = [
      {
        label: "SmartMCQ",
        onClick: () => {
          router.push("/dashboard");
        }
      },
      ...path.filter(item => item.label !== "SmartMCQ")
    ];
    setCurrentNavigation(breadcrumbPath);
  };

  const handleMenuClick = (item: any) => {
    // Navigate using Next.js router
    router.push(item.route);
    
    // Update breadcrumb - pass the item path directly
    const itemBreadcrumb = item.path.map((label: string) => ({
      label,
      onClick: () => {
        router.push(item.route);
      }
    }));
    handleNavigation(itemBreadcrumb);
    
    // Close mobile menu
    setMobileMenuOpen(false);
  };

  // Helper function to check if menu item is active
  const isMenuItemActive = (item: any) => {
    return pathname === item.route;
  };

  useEffect(() => {
    // Get user data on client side
    const userData = getUserData();
    setUser(userData);
    setLoading(false);

    // If no user data, redirect to login
    if (!userData) {
      router.push('/login');
    }
  }, [router]);

  // Update breadcrumbs based on current pathname
  useEffect(() => {
    if (!user) return;
    
    const menuItems = getMenuItems(user.role);
    const currentItem = menuItems.find(item => item.route === pathname);
    
    if (currentItem) {
      const itemBreadcrumb = currentItem.path.map((label: string) => ({
        label,
        onClick: () => {
          router.push(currentItem.route);
        }
      }));
      handleNavigation(itemBreadcrumb);
    }
  }, [pathname, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--foreground)]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const menuItems = getMenuItems(user.role);

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Mobile Header */}
      <div className="md:hidden bg-[var(--color-card)] border-b border-[var(--color-border)] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            Smart MCQ
          </h1>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[var(--color-secondary)] px-2 py-1 rounded-[var(--radius)] text-[var(--color-secondary-foreground)]">
              {user.role}
            </span>
            <IconButton
              variant="ghost"
              size="md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </IconButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-card)] border-b border-[var(--color-border)]">
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={isMenuItemActive(item) ? "primary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleMenuClick(item)}
              >
                <div className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center">
                  <item.icon className="w-full h-full" />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
              </Button>
            ))}
            
            {/* Mobile Logout Button */}
            <div className="pt-4 border-t border-[var(--color-border)] mt-4">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section - Full Width - Hidden on Mobile */}
      <div className="hidden md:flex border-b border-[var(--color-border)]">
        {/* Sidebar Header */}
        <div className="w-64 bg-[var(--color-card)] border-r border-[var(--color-border)]">
          <div className="h-full flex items-center justify-center px-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Smart MCQ
            </h2>
          </div>
        </div>
        
        {/* Breadcrumbs Header */}
        <div className="flex-1 bg-[var(--color-card)]">
          <div className="p-4 flex items-center justify-between">
            <Breadcrumbs items={currentNavigation} />
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[var(--color-muted-foreground)]">
                Welcome, <span className="font-medium text-[var(--foreground)]">{user.name}</span>
              </span>
              <span className="text-xs bg-[var(--color-secondary)] px-2 py-1 rounded-[var(--radius)] text-[var(--color-secondary-foreground)]">
                {user.role}
              </span>
              <Button 
                variant="outline" 
                onClick={logout}
                className="text-sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Full Height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Column */}
        <div className="w-64 bg-[var(--color-card)] border-r border-[var(--color-border)] hidden md:flex md:flex-col">
          {/* Sidebar Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={isMenuItemActive(item) ? "primary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center">
                    <item.icon className="w-full h-full" />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Sidebar Footer - Fixed */}
          <div className="p-4 border-t border-[var(--color-border)] flex-shrink-0">
            <div className="text-xs text-[var(--color-muted-foreground)]">
              Smart MCQ v1.0.0
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}