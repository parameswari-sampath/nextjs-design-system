"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Separator from "@/components/ui/separator";
import { 
  FaHouse, 
  FaFolder, 
  FaUsers, 
  FaChartColumn, 
  FaCalendarDays, 
  FaGear,
  FaEnvelope,
  FaFile,
  FaCircleQuestion,
  FaTableCells,
  FaPlay,
  FaCheck,
  FaBoxArchive,
  FaUser,
  FaShield,
  FaBuilding,
  FaEye,
  FaArrowUp,
  FaBullseye,
  FaFileLines,
  FaSliders,
  FaLock,
  FaBell,
  FaCreditCard
} from 'react-icons/fa6';

export default function SidebarPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<number[]>([2]); // Projects expanded by default
  const [currentNavigation, setCurrentNavigation] = useState([
    { label: "Dashboard", onClick: () => handleNavigation([{ label: "Dashboard" }]) }
  ]);

  const menuItems = [
    { 
      id: 1, 
      label: "Dashboard", 
      path: ["Dashboard"],
      icon: FaHouse
    },
    { 
      id: 2, 
      label: "Projects", 
      hasChildren: true,
      path: ["Projects"],
      icon: FaFolder,
      children: [
        { id: 21, label: "All Projects", path: ["Projects", "All Projects"], icon: FaTableCells },
        { id: 22, label: "Active Projects", path: ["Projects", "Active Projects"], icon: FaPlay },
        { id: 23, label: "Completed", path: ["Projects", "Completed"], icon: FaCheck },
        { id: 24, label: "Archived", path: ["Projects", "Archived"], icon: FaBoxArchive }
      ]
    },
    { 
      id: 3, 
      label: "Team", 
      hasChildren: true,
      path: ["Team"],
      icon: FaUsers,
      children: [
        { id: 31, label: "Members", path: ["Team", "Members"], icon: FaUser },
        { id: 32, label: "Roles", path: ["Team", "Roles"], icon: FaShield },
        { id: 33, label: "Departments", path: ["Team", "Departments"], icon: FaBuilding }
      ]
    },
    { 
      id: 4, 
      label: "Analytics", 
      hasChildren: true,
      path: ["Analytics"],
      icon: FaChartColumn,
      children: [
        { id: 41, label: "Overview", path: ["Analytics", "Overview"], icon: FaEye },
        { id: 42, label: "Traffic", path: ["Analytics", "Traffic"], icon: FaArrowUp },
        { id: 43, label: "Conversion", path: ["Analytics", "Conversion"], icon: FaBullseye },
        { id: 44, label: "Reports", path: ["Analytics", "Reports"], icon: FaFileLines }
      ]
    },
    { id: 5, label: "Calendar", path: ["Calendar"], icon: FaCalendarDays },
    { 
      id: 6, 
      label: "Settings", 
      hasChildren: true,
      path: ["Settings"],
      icon: FaGear,
      children: [
        { id: 61, label: "General", path: ["Settings", "General"], icon: FaSliders },
        { id: 62, label: "Security", path: ["Settings", "Security"], icon: FaLock },
        { id: 63, label: "Notifications", path: ["Settings", "Notifications"], icon: FaBell },
        { id: 64, label: "Billing", path: ["Settings", "Billing"], icon: FaCreditCard }
      ]
    },
    { id: 7, label: "Messages", path: ["Messages"], icon: FaEnvelope },
    { id: 8, label: "Files", path: ["Files"], icon: FaFile },
    { id: 9, label: "Help Center", path: ["Help Center"], icon: FaCircleQuestion }
  ];

  const handleNavigation = (path: Array<{label: string, onClick?: () => void}>) => {
    const pathWithOnClick = path.map(item => ({
      ...item,
      onClick: item.onClick || (() => {})
    }));
    setCurrentNavigation(pathWithOnClick);
  };

  const handleMenuClick = (item: any) => {
    if (item.hasChildren) {
      // Toggle expand/collapse for parent items
      setExpandedMenus(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      // Navigate to the item
      const breadcrumbPath = item.path.map((label: string, index: number) => ({
        label,
        onClick: () => {
          const newPath = item.path.slice(0, index + 1).map((l: string) => ({
            label: l,
            onClick: () => handleNavigation(item.path.slice(0, index + 1).map((pathLabel: string) => ({ label: pathLabel })))
          }));
          handleNavigation(newPath);
        }
      }));
      handleNavigation(breadcrumbPath);
    }
  };

  // Helper function to check if menu item is active
  const isMenuItemActive = (item: any) => {
    const currentPath = currentNavigation.map(nav => nav.label).join(" > ");
    const itemPath = item.path.join(" > ");
    return currentPath === itemPath;
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Mobile Header */}
      <div className="md:hidden bg-[var(--color-card)] border-b border-[var(--color-border)] p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">App Name</h1>
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-card)] border-b border-[var(--color-border)]">
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {/* Parent Menu Item */}
                <Button
                  variant={isMenuItemActive(item) ? "primary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item)}
                >
                  <div 
                    className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center"
                    style={{ 
                      color: isMenuItemActive(item) ? '#ffffff' : '#1f2937'
                    }}
                  >
                    <item.icon className="w-full h-full" />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.hasChildren && (
                    <svg 
                      className={`h-4 w-4 transition-transform ${
                        expandedMenus.includes(item.id) ? "rotate-90" : ""
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Button>

                {/* Child Menu Items */}
                {item.hasChildren && (
                  <div 
                    className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedMenus.includes(item.id) 
                        ? "max-h-96 opacity-100 mt-1" 
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div className="space-y-1 py-1">
                      {item.children?.map((child, index) => (
                        <div
                          key={child.id}
                          className={`transform transition-all duration-300 ease-in-out ${
                            expandedMenus.includes(item.id)
                              ? "translate-y-0 opacity-100"
                              : "-translate-y-2 opacity-0"
                          }`}
                          style={{
                            transitionDelay: expandedMenus.includes(item.id) 
                              ? `${index * 50}ms` 
                              : '0ms'
                          }}
                        >
                          <Button
                            variant={isMenuItemActive(child) ? "primary" : "ghost"}
                            className="w-full justify-start text-sm"
                            onClick={() => handleMenuClick(child)}
                          >
                            <div 
                              className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center"
                              style={{ 
                                color: isMenuItemActive(child) ? '#ffffff' : '#1f2937'
                              }}
                            >
                              <child.icon className="w-full h-full" />
                            </div>
                            <span className="flex-1 text-left">{child.label}</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header Section - Full Width - Hidden on Mobile */}
      <div className="hidden md:flex border-b border-[var(--color-border)]">
        {/* Sidebar Header */}
        <div className="w-64 bg-[var(--color-card)] border-r border-[var(--color-border)]">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Sidebar</h2>
          </div>
        </div>
        
        {/* Breadcrumbs Header */}
        <div className="flex-1 bg-[var(--color-card)]">
          <div className="p-4">
            <Breadcrumbs items={currentNavigation} />
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
                <div key={item.id}>
                  {/* Parent Menu Item */}
                  <Button
                    variant={isMenuItemActive(item) ? "primary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleMenuClick(item)}
                  >
                    <div 
                      className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center"
                      style={{ 
                        color: isMenuItemActive(item) ? '#ffffff' : '#1f2937'
                      }}
                    >
                      <item.icon className="w-full h-full" />
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasChildren && (
                      <svg 
                        className={`h-4 w-4 transition-transform ${
                          expandedMenus.includes(item.id) ? "rotate-90" : ""
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Button>

                  {/* Child Menu Items */}
                  {item.hasChildren && (
                    <div 
                      className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedMenus.includes(item.id) 
                          ? "max-h-96 opacity-100 mt-1" 
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <div className="space-y-1 py-1">
                        {item.children?.map((child, index) => (
                          <div
                            key={child.id}
                            className={`transform transition-all duration-300 ease-in-out ${
                              expandedMenus.includes(item.id)
                                ? "translate-y-0 opacity-100"
                                : "-translate-y-2 opacity-0"
                            }`}
                            style={{
                              transitionDelay: expandedMenus.includes(item.id) 
                                ? `${index * 50}ms` 
                                : '0ms'
                            }}
                          >
                            <Button
                              variant={isMenuItemActive(child) ? "primary" : "ghost"}
                              className="w-full justify-start text-sm"
                              onClick={() => handleMenuClick(child)}
                            >
                            <div 
                              className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center"
                              style={{ 
                                color: isMenuItemActive(child) ? '#ffffff' : '#1f2937'
                              }}
                            >
                              <child.icon className="w-full h-full" />
                            </div>
                            <span className="flex-1 text-left">{child.label}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar Footer - Fixed */}
          <div className="p-4 border-t border-[var(--color-border)] flex-shrink-0">
            <div className="text-xs text-[var(--color-muted-foreground)]">
              App v1.0.0
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
              {currentNavigation[currentNavigation.length - 1]?.label || "Main Content"}
            </h1>
            <p className="text-[var(--color-muted-foreground)] mb-6">
              Navigate through the sidebar menu to see the breadcrumbs update. Child menus can be expanded/collapsed by clicking parent items.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                <h3 className="font-medium mb-2">Navigation Features</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  • Nested menu structure with expand/collapse<br/>
                  • Breadcrumb navigation showing current location<br/>
                  • Clickable breadcrumb segments for quick navigation<br/>
                  • Responsive design (mobile + desktop)<br/>
                  • Full height with scrollable content<br/>
                  • Button component integration
                </p>
              </div>
              <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                <h3 className="font-medium mb-2">Current Location</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
                  You are currently viewing: <strong>{currentNavigation[currentNavigation.length - 1]?.label}</strong>
                </p>
                <div className="text-xs text-[var(--color-muted-foreground)]">
                  <strong>Try these actions:</strong><br/>
                  • Click "Projects" to expand/collapse submenu<br/>
                  • Click on child items like "All Projects"<br/>
                  • Use breadcrumbs to navigate back<br/>
                  • Test on mobile by resizing browser
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}