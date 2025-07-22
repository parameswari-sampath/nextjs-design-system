"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Separator from "@/components/ui/separator";

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
      icon: "dashboard"
    },
    { 
      id: 2, 
      label: "Projects", 
      hasChildren: true,
      path: ["Projects"],
      icon: "folder",
      children: [
        { id: 21, label: "All Projects", path: ["Projects", "All Projects"], icon: "grid" },
        { id: 22, label: "Active Projects", path: ["Projects", "Active Projects"], icon: "play" },
        { id: 23, label: "Completed", path: ["Projects", "Completed"], icon: "check" },
        { id: 24, label: "Archived", path: ["Projects", "Archived"], icon: "archive" }
      ]
    },
    { 
      id: 3, 
      label: "Team", 
      hasChildren: true,
      path: ["Team"],
      icon: "users",
      children: [
        { id: 31, label: "Members", path: ["Team", "Members"], icon: "user" },
        { id: 32, label: "Roles", path: ["Team", "Roles"], icon: "shield" },
        { id: 33, label: "Departments", path: ["Team", "Departments"], icon: "building" }
      ]
    },
    { 
      id: 4, 
      label: "Analytics", 
      hasChildren: true,
      path: ["Analytics"],
      icon: "chart",
      children: [
        { id: 41, label: "Overview", path: ["Analytics", "Overview"], icon: "eye" },
        { id: 42, label: "Traffic", path: ["Analytics", "Traffic"], icon: "trending" },
        { id: 43, label: "Conversion", path: ["Analytics", "Conversion"], icon: "target" },
        { id: 44, label: "Reports", path: ["Analytics", "Reports"], icon: "document" }
      ]
    },
    { id: 5, label: "Calendar", path: ["Calendar"], icon: "calendar" },
    { 
      id: 6, 
      label: "Settings", 
      hasChildren: true,
      path: ["Settings"],
      icon: "settings",
      children: [
        { id: 61, label: "General", path: ["Settings", "General"], icon: "sliders" },
        { id: 62, label: "Security", path: ["Settings", "Security"], icon: "lock" },
        { id: 63, label: "Notifications", path: ["Settings", "Notifications"], icon: "bell" },
        { id: 64, label: "Billing", path: ["Settings", "Billing"], icon: "creditCard" }
      ]
    },
    { id: 7, label: "Messages", path: ["Messages"], icon: "mail" },
    { id: 8, label: "Files", path: ["Files"], icon: "file" },
    { id: 9, label: "Help Center", path: ["Help Center"], icon: "help" }
  ];

  const handleNavigation = (path: Array<{label: string, onClick?: () => void}>) => {
    setCurrentNavigation(path);
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

  // Icon component function
  const getIcon = (iconName: string, className: string = "h-4 w-4") => {
    const icons: { [key: string]: JSX.Element } = {
      dashboard: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M3 7l9-5 9 5" />
        </svg>
      ),
      folder: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4M3 7l9-5 9 5" />
        </svg>
      ),
      users: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      chart: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      calendar: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      settings: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      mail: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      file: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      help: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      // Child menu icons
      grid: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      play: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      check: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      archive: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      user: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      shield: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      building: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      eye: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      trending: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      target: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      document: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      sliders: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      lock: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      bell: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9.09c0-2.36-1.64-4.09-4-4.09S7 6.73 7 9.09V12l-5 5h5m8 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      creditCard: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    };

    return icons[iconName] || icons.help;
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
                  {getIcon(item.icon, "h-4 w-4 mr-3 flex-shrink-0")}
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
                            {getIcon(child.icon, "h-3 w-3 mr-3 flex-shrink-0")}
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
                    {getIcon(item.icon, "h-4 w-4 mr-3 flex-shrink-0")}
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
                              {getIcon(child.icon, "h-3 w-3 mr-3 flex-shrink-0")}
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