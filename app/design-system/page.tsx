"use client";

import Button from "@/components/ui/button";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Link from "next/link";
import { 
  FaCubes, 
  FaMobileAlt, 
  FaPalette, 
  FaCheckCircle, 
  FaBolt, 
  FaUniversalAccess,
  FaList,
  FaTh
} from 'react-icons/fa';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Next.js Design System
          </h1>
          <p className="text-xl text-[var(--color-muted-foreground)] mb-6">
            A comprehensive React design system built with TypeScript, Next.js, and Tailwind CSS v4
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Badge variant="info">TypeScript</Badge>
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="default">Tailwind CSS v4</Badge>
            <Badge variant="success">Responsive</Badge>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href="/samples">
              <Button>View Components</Button>
            </Link>
            <Link href="/sidebar">
              <Button variant="outline">View Layouts</Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FaCubes className="h-4 w-4 text-[var(--color-primary)]" />
                <CardTitle>UI Components</CardTitle>
              </div>
              <CardDescription>
                Comprehensive collection of reusable UI components with consistent styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Buttons, forms, modals, tables, and more - all built with accessibility in mind
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FaMobileAlt className="h-4 w-4 text-[var(--color-primary)]" />
                <CardTitle>Responsive Layouts</CardTitle>
              </div>
              <CardDescription>
                Flexible layout components that work seamlessly across all devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Sidebar navigation, responsive grids, and adaptive components
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FaPalette className="h-4 w-4 text-[var(--color-primary)]" />
                <CardTitle>Design Tokens</CardTitle>
              </div>
              <CardDescription>
                Consistent design tokens for colors, typography, spacing, and theming
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                CSS variables, semantic color system, and dark/light mode support
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="h-4 w-4 text-[var(--color-primary)]" />
                <CardTitle>TypeScript Ready</CardTitle>
              </div>
              <CardDescription>
                Full TypeScript support with proper type definitions and IntelliSense
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Strongly typed components with excellent developer experience
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FaBolt className="h-4 w-4 text-[var(--color-primary)]" />
                <CardTitle>Performance</CardTitle>
              </div>
              <CardDescription>
                Optimized for performance with minimal bundle size and fast rendering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Tree-shakeable components, CSS-in-JS optimizations, and lazy loading
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FaUniversalAccess className="h-4 w-4 text-[var(--color-primary)]" />
                <CardTitle>Accessibility</CardTitle>
              </div>
              <CardDescription>
                Built with accessibility standards (WCAG) and screen reader support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                ARIA attributes, keyboard navigation, and semantic HTML structure
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Link href="/samples" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FaList className="h-4 w-4 text-[var(--color-primary)]" />
                    <CardTitle>Component Samples</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Explore all available components with live examples and interactive demos
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/sidebar" className="block">
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FaTh className="h-4 w-4 text-[var(--color-primary)]" />
                    <CardTitle>Layout Examples</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    See responsive layouts, navigation patterns, and sidebar implementations
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}