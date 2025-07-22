"use client";

import Button from "@/components/ui/button";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import Separator from "@/components/ui/separator";
import { useState } from "react";
import Link from "next/link";

export default function LayoutsPage() {
  const [selectedLayout, setSelectedLayout] = useState("grid");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-xl font-bold text-[var(--foreground)] hover:text-[var(--color-primary)] transition-colors"
              >
                Design System
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <Badge variant="info">Layouts</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sidebar">
                <Button variant="ghost" size="sm">
                  Sidebars
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  ← Components
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Layout System</h1>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            Responsive layout components and patterns for building consistent interfaces
          </p>
        </div>

        {/* Layout Type Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Layout Types</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "grid", label: "Grid System" },
              { id: "flex", label: "Flexbox" },
              { id: "container", label: "Containers" },
              { id: "spacing", label: "Spacing" },
              { id: "breakpoints", label: "Breakpoints" }
            ].map((layout) => (
              <Button
                key={layout.id}
                variant={selectedLayout === layout.id ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedLayout(layout.id)}
              >
                {layout.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid System */}
        {selectedLayout === "grid" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Grid System</h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Responsive 12-column grid system using CSS Grid and Tailwind utilities
              </p>

              <div className="space-y-8">
                {/* Basic Grid */}
                <div>
                  <h4 className="font-medium mb-3">Basic 12-Column Grid</h4>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div 
                        key={i} 
                        className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-[var(--radius)] p-3 text-center text-sm font-mono"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                    grid grid-cols-12 gap-4
                  </div>
                </div>

                {/* Column Spans */}
                <div>
                  <h4 className="font-medium mb-3">Column Spans</h4>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-[var(--radius)] p-4 text-center">
                      <div className="font-medium">col-span-6</div>
                      <div className="text-sm text-[var(--color-muted-foreground)]">6 columns wide</div>
                    </div>
                    <div className="col-span-6 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-[var(--radius)] p-4 text-center">
                      <div className="font-medium">col-span-6</div>
                      <div className="text-sm text-[var(--color-muted-foreground)]">6 columns wide</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-[var(--radius)] p-4 text-center">
                      <div className="font-medium">col-span-4</div>
                      <div className="text-sm text-[var(--color-muted-foreground)]">4 columns</div>
                    </div>
                    <div className="col-span-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-[var(--radius)] p-4 text-center">
                      <div className="font-medium">col-span-4</div>
                      <div className="text-sm text-[var(--color-muted-foreground)]">4 columns</div>
                    </div>
                    <div className="col-span-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-[var(--radius)] p-4 text-center">
                      <div className="font-medium">col-span-4</div>
                      <div className="text-sm text-[var(--color-muted-foreground)]">4 columns</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-8 bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded-[var(--radius)] p-4 text-center">
                      <div className="font-medium">col-span-8</div>
                      <div className="text-sm text-[var(--color-muted-foreground)]">8 columns wide</div>
                    </div>
                    <div className="col-span-4 bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded-[var(--radius)] p-4 text-center">
                      <div className="font-medium">col-span-4</div>
                      <div className="text-sm text-[var(--color-muted-foreground)]">4 columns</div>
                    </div>
                  </div>
                </div>

                {/* Responsive Grid */}
                <div>
                  <h4 className="font-medium mb-3">Responsive Grid</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                    {Array.from({ length: 8 }, (_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar size="sm" fallback={`${i + 1}`} />
                            <div>
                              <div className="font-medium text-sm">Item {i + 1}</div>
                              <div className="text-xs text-[var(--color-muted-foreground)]">Responsive card</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
                  </div>
                </div>

                {/* Auto-fit Grid */}
                <div>
                  <h4 className="font-medium mb-3">Auto-fit Grid</h4>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                    {Array.from({ length: 6 }, (_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle className="text-sm">Auto-fit {i + 1}</CardTitle>
                          <CardDescription className="text-xs">
                            Automatically fits based on available space
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-[var(--color-muted-foreground)]">
                            Min width: 200px
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                    grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flexbox Layouts */}
        {selectedLayout === "flex" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Flexbox Layouts</h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Flexible layout patterns using CSS Flexbox for alignment and distribution
              </p>

              <div className="space-y-8">
                {/* Basic Flex */}
                <div>
                  <h4 className="font-medium mb-3">Basic Flex Layouts</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-[var(--color-muted-foreground)] mb-2">Horizontal (flex-row)</div>
                      <div className="flex gap-4 p-4 bg-[var(--color-secondary)]/20 rounded-[var(--radius)] mb-2">
                        <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded px-4 py-2">Item 1</div>
                        <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded px-4 py-2">Item 2</div>
                        <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded px-4 py-2">Item 3</div>
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                        flex gap-4
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-[var(--color-muted-foreground)] mb-2">Vertical (flex-col)</div>
                      <div className="flex flex-col gap-4 p-4 bg-[var(--color-secondary)]/20 rounded-[var(--radius)] mb-2 max-w-xs">
                        <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded px-4 py-2">Item 1</div>
                        <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded px-4 py-2">Item 2</div>
                        <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded px-4 py-2">Item 3</div>
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                        flex flex-col gap-4
                      </div>
                    </div>
                  </div>
                </div>

                {/* Justify Content */}
                <div>
                  <h4 className="font-medium mb-3">Justify Content</h4>
                  <div className="space-y-4">
                    {[
                      { class: "justify-start", label: "Start" },
                      { class: "justify-center", label: "Center" },
                      { class: "justify-end", label: "End" },
                      { class: "justify-between", label: "Space Between" },
                      { class: "justify-around", label: "Space Around" },
                      { class: "justify-evenly", label: "Space Evenly" }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="text-sm text-[var(--color-muted-foreground)] mb-2">{item.label}</div>
                        <div className={`flex ${item.class} gap-2 p-4 bg-[var(--color-secondary)]/20 rounded-[var(--radius)] mb-2`}>
                          <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded px-3 py-1 text-sm">A</div>
                          <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded px-3 py-1 text-sm">B</div>
                          <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded px-3 py-1 text-sm">C</div>
                        </div>
                        <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                          flex {item.class}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Align Items */}
                <div>
                  <h4 className="font-medium mb-3">Align Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { class: "items-start", label: "Start" },
                      { class: "items-center", label: "Center" },
                      { class: "items-end", label: "End" },
                      { class: "items-stretch", label: "Stretch" },
                      { class: "items-baseline", label: "Baseline" }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="text-sm text-[var(--color-muted-foreground)] mb-2">{item.label}</div>
                        <div className={`flex ${item.class} gap-2 p-4 bg-[var(--color-secondary)]/20 rounded-[var(--radius)] h-24 mb-2`}>
                          <div className="bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded px-2 py-1 text-xs">Short</div>
                          <div className="bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded px-2 py-2 text-xs">Medium text</div>
                          <div className="bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded px-2 py-3 text-xs">Tall content here</div>
                        </div>
                        <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                          flex {item.class}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flex Grow/Shrink */}
                <div>
                  <h4 className="font-medium mb-3">Flex Grow & Shrink</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-[var(--color-muted-foreground)] mb-2">Flex Grow</div>
                      <div className="flex gap-2 p-4 bg-[var(--color-secondary)]/20 rounded-[var(--radius)] mb-2">
                        <div className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded px-4 py-2">Fixed</div>
                        <div className="flex-1 bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded px-4 py-2 text-center">flex-1 (grows)</div>
                        <div className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded px-4 py-2">Fixed</div>
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                        flex gap-2 (middle item has flex-1)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Container Layouts */}
        {selectedLayout === "container" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Container System</h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Responsive containers for consistent content width and centering
              </p>

              <div className="space-y-8">
                {/* Max Width Containers */}
                <div>
                  <h4 className="font-medium mb-3">Max Width Containers</h4>
                  <div className="space-y-4">
                    {[
                      { class: "max-w-sm", label: "Small (24rem)", size: "384px" },
                      { class: "max-w-md", label: "Medium (28rem)", size: "448px" },
                      { class: "max-w-lg", label: "Large (32rem)", size: "512px" },
                      { class: "max-w-xl", label: "Extra Large (36rem)", size: "576px" },
                      { class: "max-w-2xl", label: "2X Large (42rem)", size: "672px" },
                      { class: "max-w-4xl", label: "4X Large (56rem)", size: "896px" },
                      { class: "max-w-6xl", label: "6X Large (72rem)", size: "1152px" }
                    ].map((container, i) => (
                      <div key={i}>
                        <div className="text-sm text-[var(--color-muted-foreground)] mb-2">
                          {container.label} ({container.size})
                        </div>
                        <div className={`${container.class} mx-auto bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-[var(--radius)] p-4 mb-2`}>
                          <div className="text-center text-sm">
                            Content centered with {container.class}
                          </div>
                        </div>
                        <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                          {container.class} mx-auto
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responsive Containers */}
                <div>
                  <h4 className="font-medium mb-3">Responsive Containers</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-[var(--color-muted-foreground)] mb-2">
                        Responsive Width Container
                      </div>
                      <div className="container mx-auto bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-[var(--radius)] p-4 mb-2">
                        <div className="text-center text-sm">
                          .container class - adapts to screen size breakpoints
                        </div>
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                        container mx-auto
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-[var(--color-muted-foreground)] mb-2">
                        Responsive Max Width
                      </div>
                      <div className="max-w-sm md:max-w-lg lg:max-w-4xl mx-auto bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-[var(--radius)] p-4 mb-2">
                        <div className="text-center text-sm">
                          Small on mobile, large on tablet, 4xl on desktop
                        </div>
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                        max-w-sm md:max-w-lg lg:max-w-4xl mx-auto
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Layouts */}
                <div>
                  <h4 className="font-medium mb-3">Common Content Layouts</h4>
                  
                  {/* Article Layout */}
                  <div className="mb-6">
                    <div className="text-sm text-[var(--color-muted-foreground)] mb-2">Article Layout</div>
                    <div className="max-w-4xl mx-auto">
                      <Card>
                        <CardHeader>
                          <CardTitle>Article Title</CardTitle>
                          <CardDescription>
                            A typical article layout with constrained width for optimal reading
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="prose max-w-none">
                          <div className="space-y-3 text-sm text-[var(--color-muted-foreground)]">
                            <p>
                              This is a sample article layout using max-w-4xl for optimal reading width. 
                              The content is centered and has comfortable line lengths.
                            </p>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                              tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Dashboard Layout */}
                  <div className="mb-6">
                    <div className="text-sm text-[var(--color-muted-foreground)] mb-2">Dashboard Layout</div>
                    <div className="max-w-7xl mx-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }, (_, i) => (
                          <Card key={i}>
                            <CardHeader>
                              <CardTitle className="text-sm">Metric {i + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold font-mono">1,234</div>
                              <div className="text-xs text-[var(--color-muted-foreground)]">
                                Dashboard widget content
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spacing System */}
        {selectedLayout === "spacing" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Spacing System</h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Consistent spacing scale using Tailwind's spacing utilities
              </p>

              <div className="space-y-8">
                {/* Padding Examples */}
                <div>
                  <h4 className="font-medium mb-3">Padding Scale</h4>
                  <div className="space-y-4">
                    {[
                      { class: "p-1", label: "p-1", size: "4px" },
                      { class: "p-2", label: "p-2", size: "8px" },
                      { class: "p-3", label: "p-3", size: "12px" },
                      { class: "p-4", label: "p-4", size: "16px" },
                      { class: "p-6", label: "p-6", size: "24px" },
                      { class: "p-8", label: "p-8", size: "32px" }
                    ].map((spacing, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-mono">{spacing.label}</div>
                        <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded">
                          <div className={`${spacing.class} bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 rounded text-sm`}>
                            Content with {spacing.size} padding
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Margin Examples */}
                <div>
                  <h4 className="font-medium mb-3">Margin Scale</h4>
                  <div className="bg-[var(--color-secondary)]/20 p-4 rounded-[var(--radius)]">
                    <div className="space-y-2">
                      {[
                        { class: "mb-2", label: "mb-2", size: "8px" },
                        { class: "mb-4", label: "mb-4", size: "16px" },
                        { class: "mb-6", label: "mb-6", size: "24px" },
                        { class: "mb-8", label: "mb-8", size: "32px" }
                      ].map((spacing, i) => (
                        <div key={i}>
                          <div className={`${spacing.class} bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded p-2 text-sm`}>
                            Block with {spacing.label} ({spacing.size}) bottom margin
                          </div>
                        </div>
                      ))}
                      <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded p-2 text-sm">
                        Final block (no margin)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gap Examples */}
                <div>
                  <h4 className="font-medium mb-3">Gap Scale (for Flex/Grid)</h4>
                  <div className="space-y-4">
                    {[
                      { class: "gap-1", label: "gap-1", size: "4px" },
                      { class: "gap-2", label: "gap-2", size: "8px" },
                      { class: "gap-4", label: "gap-4", size: "16px" },
                      { class: "gap-6", label: "gap-6", size: "24px" },
                      { class: "gap-8", label: "gap-8", size: "32px" }
                    ].map((spacing, i) => (
                      <div key={i}>
                        <div className="text-sm text-[var(--color-muted-foreground)] mb-2">
                          {spacing.label} ({spacing.size})
                        </div>
                        <div className={`flex ${spacing.class} mb-4`}>
                          <div className="bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded px-3 py-2 text-sm">Item 1</div>
                          <div className="bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded px-3 py-2 text-sm">Item 2</div>
                          <div className="bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded px-3 py-2 text-sm">Item 3</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakpoints */}
        {selectedLayout === "breakpoints" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Responsive Breakpoints</h3>
              <p className="text-[var(--color-muted-foreground)] mb-6">
                Tailwind CSS breakpoint system for responsive design
              </p>

              <div className="space-y-8">
                {/* Breakpoint Table */}
                <div>
                  <h4 className="font-medium mb-3">Breakpoint Reference</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-[var(--color-border)] rounded-[var(--radius)]">
                      <thead className="bg-[var(--color-secondary)]">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Breakpoint</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Prefix</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Minimum Width</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Device</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)]">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono">default</td>
                          <td className="px-4 py-3 text-sm font-mono">-</td>
                          <td className="px-4 py-3 text-sm">0px</td>
                          <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">Mobile first</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono">sm</td>
                          <td className="px-4 py-3 text-sm font-mono">sm:</td>
                          <td className="px-4 py-3 text-sm">640px</td>
                          <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">Small tablets</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono">md</td>
                          <td className="px-4 py-3 text-sm font-mono">md:</td>
                          <td className="px-4 py-3 text-sm">768px</td>
                          <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">Tablets</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono">lg</td>
                          <td className="px-4 py-3 text-sm font-mono">lg:</td>
                          <td className="px-4 py-3 text-sm">1024px</td>
                          <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">Small laptops</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono">xl</td>
                          <td className="px-4 py-3 text-sm font-mono">xl:</td>
                          <td className="px-4 py-3 text-sm">1280px</td>
                          <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">Laptops</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono">2xl</td>
                          <td className="px-4 py-3 text-sm font-mono">2xl:</td>
                          <td className="px-4 py-3 text-sm">1536px</td>
                          <td className="px-4 py-3 text-sm text-[var(--color-muted-foreground)]">Large screens</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Responsive Visibility */}
                <div>
                  <h4 className="font-medium mb-3">Responsive Visibility</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded text-sm block sm:hidden">
                      📱 Visible only on mobile (block sm:hidden)
                    </div>
                    <div className="p-3 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded text-sm hidden sm:block md:hidden">
                      📱 Visible only on small screens (hidden sm:block md:hidden)
                    </div>
                    <div className="p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded text-sm hidden md:block lg:hidden">
                      💻 Visible only on tablets (hidden md:block lg:hidden)
                    </div>
                    <div className="p-3 bg-[var(--color-purple-500)]/10 border border-[var(--color-purple-500)]/20 rounded text-sm hidden lg:block">
                      🖥️ Visible only on desktop and up (hidden lg:block)
                    </div>
                  </div>
                </div>

                {/* Responsive Grid Example */}
                <div>
                  <h4 className="font-medium mb-3">Responsive Grid Example</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded p-3 text-center text-sm">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-[var(--color-muted-foreground)] font-mono bg-[var(--color-secondary)]/30 p-2 rounded">
                    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6
                  </div>
                  <div className="mt-2 text-sm text-[var(--color-muted-foreground)]">
                    Resize your browser to see the responsive behavior
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}