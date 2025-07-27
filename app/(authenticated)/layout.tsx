"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Skeleton from "@/components/ui/skeleton";
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
  FaShieldAlt,
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
  FaComments,
} from "react-icons/fa";

// Get user data from localStorage
const getUserData = () => {
  if (typeof window === "undefined") return null;

  try {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// Utility function to clear authentication data
const logout = async (router: any) => {
  try {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });
    }
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");

    const clearCookie = (name: string) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax`;
    };

    clearCookie("access_token");
    clearCookie("refresh_token");

    router.push("/login");
  }
};

function AuthenticatedLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  // console.log("🔍 [AUTH LAYOUT] Component re-rendering with pathname:", pathname, "user:", user?.name, "loading:", loading);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Role-based menu items - MOVED UP
  const getMenuItems = (userRole: string) => {
    if (userRole === "TEACHER") {
      return [
        {
          id: 1,
          label: "Dashboard",
          path: ["Dashboard"],
          icon: FaHome,
          route: "/dashboard",
        },
        {
          id: 2,
          label: "Question Bank",
          path: ["Question Bank"],
          icon: FaQuestionCircle,
          route: "/question-bank",
          hasSubMenu: true,
          subMenuItems: [
            {
              id: 21,
              label: "All Questions",
              path: ["Question Bank", "All Questions"],
              icon: FaClipboardList,
              route: "/question-bank",
            },
            {
              id: 22,
              label: "Create Question",
              path: ["Question Bank", "Create Question"],
              icon: FaEdit,
              route: "/create-question",
            },
          ],
        },
        {
          id: 3,
          label: "Test",
          path: ["Test"],
          icon: FaFileAlt,
          route: "/test",
          hasSubMenu: true,
          subMenuItems: [
            {
              id: 31,
              label: "All Tests",
              path: ["Test", "All Tests"],
              icon: FaClipboardList,
              route: "/test/all-tests",
            },
            {
              id: 32,
              label: "Create Test",
              path: ["Test", "Create Test"],
              icon: FaEdit,
              route: "/test/create",
            },
          ],
        },
        {
          id: 4,
          label: "Analytics",
          path: ["Analytics"],
          icon: FaChartBar,
          route: "/analytics",
        },
        {
          id: 5,
          label: "Profile",
          path: ["Profile"],
          icon: FaUser,
          route: "/profile",
        },
      ];
    } else {
      // STUDENT menu items
      return [
        {
          id: 1,
          label: "Dashboard",
          path: ["Dashboard"],
          icon: FaHome,
          route: "/dashboard",
        },
        {
          id: 2,
          label: "Test",
          path: ["Test"],
          icon: FaFileAlt,
          route: "/test/all-tests",
        },
        {
          id: 3,
          label: "Results",
          path: ["Results"],
          icon: FaChartBar,
          route: "/results",
        },
        {
          id: 4,
          label: "Profile",
          path: ["Profile"],
          icon: FaUser,
          route: "/profile",
        },
      ];
    }
  };

  // Compute expanded menus directly - NO STATE!
  const getExpandedMenus = (currentPathname: string, currentUser: any) => {
    if (!currentUser) return {};
    
    const menuItems = getMenuItems(currentUser.role);
    const expanded: { [key: string]: boolean } = {};
    
    for (const item of menuItems) {
      if (item.hasSubMenu && item.subMenuItems) {
        const hasActiveSubItem = item.subMenuItems.some((sub: any) => sub.route === currentPathname);
        if (hasActiveSubItem) {
          expanded[item.id] = true;
        }
      }
    }
    return expanded;
  };

  const expandedMenus = getExpandedMenus(pathname, user);
  // console.log("📍 Computed expandedMenus:", expandedMenus);

  // Calculate breadcrumbs directly from pathname and user - NO STATE!
  const getBreadcrumbs = (currentPathname: string, currentUser: any) => {
    if (!currentUser) {
      return [{ label: "SmartMCQ", onClick: () => router.push("/dashboard") }];
    }

    const menuItems = getMenuItems(currentUser.role);
    
    // Check sub-menu items first
    for (const item of menuItems) {
      if (item.hasSubMenu && item.subMenuItems) {
        const subItem = item.subMenuItems.find((sub: any) => sub.route === currentPathname);
        if (subItem) {
          return [
            { label: "SmartMCQ", onClick: () => router.push("/dashboard") },
            ...subItem.path.map((label: string) => ({ label, onClick: () => router.push(subItem.route) }))
          ];
        }
      }
    }

    // Check main menu items
    const mainItem = menuItems.find((item) => item.route === currentPathname);
    if (mainItem) {
      return [
        { label: "SmartMCQ", onClick: () => router.push("/dashboard") },
        ...mainItem.path.map((label: string) => ({ label, onClick: () => router.push(mainItem.route) }))
      ];
    }

    // Handle special routes
    if (currentPathname.startsWith('/edit-question/')) {
      const questionId = currentPathname.split('/').pop();
      return [
        { label: "SmartMCQ", onClick: () => router.push("/dashboard") },
        { label: "Question Bank", onClick: () => router.push("/question-bank") },
        { label: "All Questions", onClick: () => router.push("/question-bank") },
        { label: "Edit", onClick: () => {} },
        { label: questionId || "Question", onClick: () => {} }
      ];
    }

    // Default breadcrumb
    return [{ label: "SmartMCQ", onClick: () => router.push("/dashboard") }];
  };

  const currentNavigation = getBreadcrumbs(pathname, user);
  // console.log("📍 Computed breadcrumbs:", currentNavigation);


  // For manual toggle (mobile menu), we still need state
  const [manuallyToggled, setManuallyToggled] = useState<{ [key: string]: boolean }>({});
  
  const toggleSubMenu = (menuId: number) => {
    setManuallyToggled((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };
  
  // Combine auto-expanded and manually toggled
  const isMenuExpanded = (menuId: number) => {
    return expandedMenus[menuId] || manuallyToggled[menuId];
  };

  const handleMenuClick = (item: any) => {
    // If item has sub-menu, toggle it instead of navigating
    if (item.hasSubMenu) {
      toggleSubMenu(item.id);
      return;
    }

    // Navigate using Next.js router
    router.push(item.route);

    // Close mobile menu
    setMobileMenuOpen(false);
  };

  // Helper function to check if menu item is active
  const isMenuItemActive = (item: any) => {
    if (item.hasSubMenu) {
      // Parent menu items with sub-menus should not be active, only expanded
      return false;
    }
    return pathname === item.route;
  };

  // Helper function to check if sub-menu item is active
  const isSubMenuItemActive = (item: any) => {
    return pathname === item.route;
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // console.log("🔍 [AUTH LAYOUT] No user data, redirecting to login");
      router.push("/login");
    }
  }, [loading, user, router]);


  // Show a minimal loading state during initial hydration only
  if (loading) {
    // console.log("🔍 [AUTH LAYOUT] Rendering loading skeleton");
    return (
      <div className="h-screen flex flex-col bg-[var(--background)]">
        {/* Minimal loading indicator */}
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // console.log("🔍 [AUTH LAYOUT] No user, returning null (should redirect)");
    return null; // Will redirect in useEffect
  }

  const menuItems = getMenuItems(user.role);
  // console.log("🔍 [AUTH LAYOUT] Rendering main layout for user:", user.name, "role:", user.role, "pathname:", pathname);

  // Check if current route is test taking or test start - hide sidebar/navbar
  const isTestTakingRoute = pathname.startsWith('/test/take') || pathname.startsWith('/test/start');

  // If test taking route, render only the content
  if (isTestTakingRoute) {
    return (
      <div className="h-screen bg-[var(--background)]">
        {(() => {
          // console.log("🎯 [TEST LAYOUT] Rendering test taking page for pathname:", pathname);
          return children;
        })()}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Mobile Header */}
      <div className="md:hidden bg-[var(--color-card)] border-b border-[var(--color-border)] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            SmartMCQ{" "}
            <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
              {"preview"}
            </span>
          </h2>

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
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
              <div key={item.id}>
                <Button
                  variant={isMenuItemActive(item) ? "primary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center">
                    <item.icon className="w-full h-full" />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.hasSubMenu && (
                    <svg
                      className={`h-4 w-4 transition-transform ${
                        isMenuExpanded(item.id) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Button>

                {/* Sub-menu items */}
                {item.hasSubMenu && (
                  <div
                    className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                      isMenuExpanded(item.id)
                        ? "max-h-96 opacity-100 mt-1"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div className="space-y-1 py-1">
                      {item.subMenuItems?.map((subItem: any, index: number) => (
                        <div
                          key={subItem.id}
                          className={`transform transition-all duration-300 ease-in-out ${
                            isMenuExpanded(item.id)
                              ? "translate-y-0 opacity-100"
                              : "-translate-y-2 opacity-0"
                          }`}
                          style={{
                            transitionDelay: isMenuExpanded(item.id)
                              ? `${index * 50}ms`
                              : "0ms",
                          }}
                        >
                          <Button
                            variant={
                              isSubMenuItemActive(subItem) ? "primary" : "ghost"
                            }
                            className="w-full justify-start text-sm"
                            onClick={() => handleMenuClick(subItem)}
                          >
                            <div className="h-3 w-3 mr-3 flex-shrink-0 self-center">
                              <subItem.icon className="w-full h-full" />
                            </div>
                            <span className="flex-1 text-left">
                              {subItem.label}
                            </span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Logout Button */}
            <div className="pt-4 border-t border-[var(--color-border)] mt-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => logout(router)}
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
        <div className="w-64 bg-[var(--color-card)] border-r border-[var(--color-border)] flex-shrink-0">
          <div className="h-full flex items-center justify-center px-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              SmartMCQ{" "}
              <span className="text-sm font-normal text-[var(--color-muted-foreground)]">
                {"preview"}
              </span>
            </h2>
          </div>
        </div>

        {/* Breadcrumbs Header */}
        <div className="flex-1 bg-[var(--color-card)]">
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Breadcrumbs items={currentNavigation} />
            </div>

            <div className="flex items-center space-x-4 flex-shrink-0">
              <span className="text-sm text-[var(--color-muted-foreground)]">
                Welcome,{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {user.name}
                </span>
              </span>
              <span className="text-xs bg-[var(--color-secondary)] px-2 py-1 rounded-[var(--radius)] text-[var(--color-secondary-foreground)]">
                {user.role}
              </span>
              <Button
                variant="outline"
                onClick={() => logout(router)}
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
        <div className="w-64 bg-[var(--color-card)] border-r border-[var(--color-border)] hidden md:flex md:flex-col animate-in slide-in-from-left duration-300 flex-shrink-0">
          {/* Sidebar Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-1">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-in slide-in-from-left fade-in duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Button
                    variant={isMenuItemActive(item) ? "primary" : "ghost"}
                    className="w-full justify-start transition-all duration-200"
                    onClick={() => handleMenuClick(item)}
                  >
                    <div className="h-3.5 w-3.5 mr-3 flex-shrink-0 self-center">
                      <item.icon className="w-full h-full" />
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.hasSubMenu && (
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isMenuExpanded(item.id) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </Button>

                  {/* Sub-menu items */}
                  {item.hasSubMenu && (
                    <div
                      className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuExpanded(item.id)
                          ? "max-h-96 opacity-100 mt-1"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <div className="space-y-1 py-1">
                        {item.subMenuItems?.map(
                          (subItem: any, index: number) => (
                            <div
                              key={subItem.id}
                              className={`transform transition-all duration-300 ease-in-out ${
                                isMenuExpanded(item.id)
                                  ? "translate-y-0 opacity-100"
                                  : "-translate-y-2 opacity-0"
                              }`}
                              style={{
                                transitionDelay: isMenuExpanded(item.id)
                                  ? `${index * 50}ms`
                                  : "0ms",
                              }}
                            >
                              <Button
                                variant={
                                  isSubMenuItemActive(subItem)
                                    ? "primary"
                                    : "ghost"
                                }
                                className="w-full justify-start text-sm"
                                onClick={() => handleMenuClick(subItem)}
                              >
                                <div className="h-3 w-3 mr-3 flex-shrink-0 self-center">
                                  <subItem.icon className="w-full h-full" />
                                </div>
                                <span className="flex-1 text-left">
                                  {subItem.label}
                                </span>
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer - Fixed */}
          <div
            className="p-4 border-t border-[var(--color-border)] flex-shrink-0 animate-in slide-in-from-bottom fade-in duration-300"
            style={{ animationDelay: "400ms" }}
          >
            <div className="text-xs text-[var(--color-muted-foreground)]">
              Smart MCQ v1.0.0
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {(() => {
            // console.log("🎯 [MAIN CONTENT] About to render children for pathname:", pathname, "user:", user?.name);
            // console.log("🎯 [MAIN CONTENT] Children type:", typeof children);
            return children;
          })()}
        </div>
      </div>
    </div>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthenticatedLayoutInner>{children}</AuthenticatedLayoutInner>
    </AuthProvider>
  );
}
