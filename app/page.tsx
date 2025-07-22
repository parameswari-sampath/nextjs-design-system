"use client";

import Select from "@/components/ui/select";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Checkbox from "@/components/ui/checkbox";
import Textarea from "@/components/ui/textarea";
import Toggle from "@/components/ui/toggle";
import Radio from "@/components/ui/radio";
import Slider from "@/components/ui/slider";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Alert from "@/components/ui/alert";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import Progress from "@/components/ui/progress";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import Tabs, { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Skeleton from "@/components/ui/skeleton";
import Separator from "@/components/ui/separator";
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import Modal, { ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import Dropdown, { DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator, DropdownLabel } from "@/components/ui/dropdown";
import Spinner, { LoadingButton } from "@/components/ui/spinner";
import FileUpload from "@/components/ui/file-upload";
import Pagination, { PaginationInfo, ItemsPerPage } from "@/components/ui/pagination";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
    agree: false,
    notifications: false,
    priority: "",
    satisfaction: 50
  });
  
  const [alerts, setAlerts] = useState<Array<{id: number, variant: "info" | "success" | "warning" | "destructive", message: string}>>([]);
  
  const [modals, setModals] = useState({
    basic: false,
    confirmation: false,
    form: false,
    large: false
  });
  
  const [modalFormData, setModalFormData] = useState({
    name: "",
    email: "",
    role: "",
    notes: "",
    sendWelcome: false
  });
  
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  const [loadingStates, setLoadingStates] = useState({
    button1: false,
    button2: false,
    button3: false
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File[]}>({
    dropzone: [],
    button: [],
    minimal: []
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Sample data for paginated table
  const allUsers = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active", joinDate: "2024-01-15", projects: 12 },
    { id: 2, name: "Alice Smith", email: "alice.smith@example.com", role: "Developer", status: "Active", joinDate: "2024-01-18", projects: 8 },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "Designer", status: "Pending", joinDate: "2024-01-20", projects: 5 },
    { id: 4, name: "Carol Williams", email: "carol.williams@example.com", role: "Manager", status: "Inactive", joinDate: "2024-01-22", projects: 15 },
    { id: 5, name: "David Brown", email: "david.brown@example.com", role: "Developer", status: "Active", joinDate: "2024-01-25", projects: 11 },
    { id: 6, name: "Emma Wilson", email: "emma.wilson@example.com", role: "QA Engineer", status: "Active", joinDate: "2024-01-28", projects: 7 },
    { id: 7, name: "Frank Davis", email: "frank.davis@example.com", role: "Developer", status: "Active", joinDate: "2024-02-01", projects: 9 },
    { id: 8, name: "Grace Miller", email: "grace.miller@example.com", role: "Designer", status: "Pending", joinDate: "2024-02-03", projects: 6 },
    { id: 9, name: "Henry Taylor", email: "henry.taylor@example.com", role: "Manager", status: "Active", joinDate: "2024-02-05", projects: 13 },
    { id: 10, name: "Ivy Anderson", email: "ivy.anderson@example.com", role: "Admin", status: "Active", joinDate: "2024-02-08", projects: 10 },
    { id: 11, name: "Jack Thompson", email: "jack.thompson@example.com", role: "Developer", status: "Inactive", joinDate: "2024-02-10", projects: 4 },
    { id: 12, name: "Karen White", email: "karen.white@example.com", role: "QA Engineer", status: "Active", joinDate: "2024-02-12", projects: 8 },
    { id: 13, name: "Liam Clark", email: "liam.clark@example.com", role: "Designer", status: "Active", joinDate: "2024-02-15", projects: 7 },
    { id: 14, name: "Maya Rodriguez", email: "maya.rodriguez@example.com", role: "Manager", status: "Active", joinDate: "2024-02-18", projects: 16 },
    { id: 15, name: "Nathan Lee", email: "nathan.lee@example.com", role: "Developer", status: "Pending", joinDate: "2024-02-20", projects: 5 },
    { id: 16, name: "Olivia Martinez", email: "olivia.martinez@example.com", role: "Admin", status: "Active", joinDate: "2024-02-22", projects: 14 },
    { id: 17, name: "Peter Garcia", email: "peter.garcia@example.com", role: "QA Engineer", status: "Active", joinDate: "2024-02-25", projects: 9 },
    { id: 18, name: "Quinn Johnson", email: "quinn.johnson@example.com", role: "Designer", status: "Inactive", joinDate: "2024-02-28", projects: 3 },
    { id: 19, name: "Rachel Green", email: "rachel.green@example.com", role: "Developer", status: "Active", joinDate: "2024-03-01", projects: 11 },
    { id: 20, name: "Steve Brown", email: "steve.brown@example.com", role: "Manager", status: "Active", joinDate: "2024-03-05", projects: 18 }
  ];
  
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    role: false,
    message: false,
    priority: false,
    agree: false
  });

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email),
      role: !formData.role,
      message: !formData.message.trim(),
      priority: !formData.priority,
      agree: !formData.agree
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      showToast("success", "Form submitted successfully!");
    }
  };

  const showToast = (variant: "info" | "success" | "warning" | "destructive", message: string) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, variant, message }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 3000);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const openModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  };

  const handleConfirmAction = () => {
    showToast("success", "Action confirmed successfully!");
    closeModal("confirmation");
  };

  const handleFormSubmit = () => {
    showToast("success", "Form submitted from modal!");
    setModalFormData({
      name: "",
      email: "",
      role: "",
      notes: "",
      sendWelcome: false
    });
    closeModal("form");
  };

  const handleModalFormChange = (field: keyof typeof modalFormData, value: string | boolean) => {
    setModalFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    showToast("info", `Filtering by: ${status}`);
  };

  const simulateLoading = (buttonKey: keyof typeof loadingStates, duration: number = 2000) => {
    setLoadingStates(prev => ({ ...prev, [buttonKey]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonKey]: false }));
      showToast("success", "Action completed!");
    }, duration);
  };

  const handleFileUpload = (key: string, files: File[]) => {
    setUploadedFiles(prev => ({ ...prev, [key]: files }));
    showToast("success", `${files.length} file(s) selected`);
  };
  
  // Pagination functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    showToast("info", `Navigated to page ${page}`);
  };
  
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
    showToast("info", `Showing ${items} items per page`);
  };
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
    showToast("info", `Sorted by ${field}`);
  };
  
  // Sort data
  const sortedUsers = [...allUsers].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  // Calculate pagination
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="success">Active</Badge>;
      case "Pending":
        return <Badge variant="warning">Pending</Badge>;
      case "Inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg className="h-3 w-3 text-[var(--color-muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    
    return sortDirection === "asc" ? (
      <svg className="h-3 w-3 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="h-3 w-3 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-card)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[var(--foreground)]">Design System</h1>
              <Separator orientation="vertical" className="h-6" />
              <Badge variant="primary">Components</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/layouts">
                <Button variant="ghost" size="sm">
                  Layouts
                </Button>
              </Link>
              <Link href="/sidebar">
                <Button variant="outline" size="sm">
                  Sidebars →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">Components</h2>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            Interactive components for building user interfaces
          </p>
        </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Button Components */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Button Components</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Button Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Icon Button Variants</h3>
              <div className="flex flex-wrap gap-2">
                <IconButton variant="primary" aria-label="Heart">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </IconButton>
                <IconButton variant="secondary" aria-label="Settings">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </IconButton>
                <IconButton variant="destructive" aria-label="Delete">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </IconButton>
                <IconButton variant="outline" aria-label="Edit">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </IconButton>
                <IconButton variant="ghost" aria-label="More">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </IconButton>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Icon Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <IconButton variant="outline" size="sm" aria-label="Small plus">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </IconButton>
                <IconButton variant="outline" size="md" aria-label="Medium plus">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </IconButton>
                <IconButton variant="outline" size="lg" aria-label="Large plus">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </IconButton>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Alert Toast Triggers</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="secondary"
                  onClick={() => showToast("info", "This is an info message")}
                >
                  Show Info
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => showToast("success", "Action completed successfully!")}
                >
                  Show Success
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => showToast("warning", "Warning: Please check your input")}
                >
                  Show Warning
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => showToast("destructive", "Error: Something went wrong")}
                >
                  Show Error
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Badge Components</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                <span className="text-sm">Status: <Badge variant="success">Active</Badge></span>
                <span className="text-sm">Priority: <Badge variant="warning">High</Badge></span>
                <span className="text-sm">Count: <Badge variant="info">42</Badge></span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Avatar Components</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-muted-foreground)] w-12">Photos:</span>
                  <Avatar 
                    size="sm" 
                    src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" 
                    alt="Person 1"
                    fallback="P1" 
                  />
                  <Avatar 
                    size="md" 
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" 
                    alt="Person 2"
                    fallback="P2" 
                  />
                  <Avatar 
                    size="lg" 
                    src="https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&dpr=2" 
                    alt="Person 3"
                    fallback="P3" 
                  />
                  <Avatar 
                    size="xl" 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&dpr=2" 
                    alt="Person 4"
                    fallback="P4" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-muted-foreground)] w-12">Team:</span>
                  <Avatar 
                    src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" 
                    alt="John Doe"
                    fallback="JD" 
                  />
                  <Avatar 
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" 
                    alt="Alice Brown"
                    fallback="AB" 
                  />
                  <Avatar 
                    src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" 
                    alt="Chris Wilson"
                    fallback="CW" 
                  />
                  <Avatar 
                    src="https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" 
                    alt="Maya Singh"
                    fallback="MS" 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-muted-foreground)] w-12">Fallback:</span>
                  <Avatar fallback="JD" />
                  <Avatar fallback="AB" />
                  <Avatar />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Progress Components</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs text-[var(--color-muted-foreground)]">Sizes:</span>
                  <Progress value={65} size="sm" showLabel />
                  <Progress value={65} size="md" showLabel />
                  <Progress value={65} size="lg" showLabel />
                </div>
                
                <div className="space-y-2">
                  <span className="text-xs text-[var(--color-muted-foreground)]">Usage Examples:</span>
                  <div className="text-xs">Profile Completion</div>
                  <Progress value={40} showLabel />
                  <div className="text-xs">Download Progress</div>
                  <Progress value={78} showLabel />
                  <div className="text-xs">Storage Used</div>
                  <Progress value={92} showLabel />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Form */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Form</h2>
          <Card>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>Fill out this form to test all components</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              errorMessage="Name is required"
            />
            
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              errorMessage="Please enter a valid email"
            />
            
            <Select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              error={errors.role}
              errorMessage="Please select a role"
            >
              <option value="">Select a role</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="qa">QA Engineer</option>
            </Select>
            
            <Textarea
              placeholder="Enter your message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              error={errors.message}
              errorMessage="Message is required"
              rows={4}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--foreground)]">Priority Level</label>
              <div className="space-y-2">
                <Radio
                  name="priority"
                  value="low"
                  label="Low"
                  checked={formData.priority === "low"}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  error={errors.priority}
                />
                <Radio
                  name="priority"
                  value="medium"
                  label="Medium"
                  checked={formData.priority === "medium"}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  error={errors.priority}
                />
                <Radio
                  name="priority"
                  value="high"
                  label="High"
                  checked={formData.priority === "high"}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  error={errors.priority}
                />
              </div>
              {errors.priority && (
                <p className="text-xs text-[var(--color-destructive)]">
                  Please select a priority level
                </p>
              )}
            </div>
            
            <Slider
              label={`Satisfaction Level (${formData.satisfaction}%)`}
              min={0}
              max={100}
              value={formData.satisfaction}
              onChange={(e) => handleInputChange('satisfaction', parseInt(e.target.value))}
            />
            
            <Toggle
              label="Enable email notifications"
              checked={formData.notifications}
              onChange={(checked) => handleInputChange('notifications', checked)}
            />
            
            <Checkbox
              label="I agree to the terms and conditions"
              checked={formData.agree}
              onChange={(e) => handleInputChange('agree', e.target.checked)}
              error={errors.agree}
              errorMessage="You must agree to the terms"
            />
            
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </form>
        </CardContent>
          <CardFooter>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Try submitting empty to see error states
            </p>
          </CardFooter>
          </Card>
          
          <div className="mt-8">
            <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Separator Components</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Horizontal Separators:</span>
                <div className="mt-2 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-4">
                  <div>
                    <h4 className="font-medium">Section One</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Content for the first section.</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium">Section Two</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Content for the second section.</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium">Section Three</h4>
                    <p className="text-sm text-[var(--color-muted-foreground)]">Content for the third section.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Menu with Separators:</span>
                <div className="mt-2 p-2 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-1">
                  <div className="px-2 py-1 hover:bg-[var(--color-secondary)] rounded cursor-pointer">
                    <span className="text-sm">Profile</span>
                  </div>
                  <div className="px-2 py-1 hover:bg-[var(--color-secondary)] rounded cursor-pointer">
                    <span className="text-sm">Settings</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="px-2 py-1 hover:bg-[var(--color-secondary)] rounded cursor-pointer">
                    <span className="text-sm">Help</span>
                  </div>
                  <div className="px-2 py-1 hover:bg-[var(--color-secondary)] rounded cursor-pointer">
                    <span className="text-sm">Support</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="px-2 py-1 hover:bg-[var(--color-secondary)] rounded cursor-pointer text-[var(--color-destructive)]">
                    <span className="text-sm">Logout</span>
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Vertical Separator:</span>
                <div className="mt-2 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                  <div className="flex items-center space-x-4 h-16">
                    <div className="text-center">
                      <div className="text-lg font-semibold font-mono">1,234</div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">Users</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="text-center">
                      <div className="text-lg font-semibold font-mono">567</div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">Projects</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="text-center">
                      <div className="text-lg font-semibold font-mono">89</div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">Teams</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Navigation */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Navigation Components</h2>
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Breadcrumbs Components</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Basic Navigation:</span>
                <div className="mt-1">
                  <Breadcrumbs 
                    items={[
                      { label: "Home", onClick: () => showToast("info", "Navigated to Home") },
                      { label: "Products", onClick: () => showToast("info", "Navigated to Products") },
                      { label: "Laptops", onClick: () => showToast("info", "Navigated to Laptops") },
                      { label: "MacBook Pro" }
                    ]}
                  />
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Admin Dashboard:</span>
                <div className="mt-1">
                  <Breadcrumbs 
                    items={[
                      { label: "Dashboard", onClick: () => showToast("info", "Navigated to Dashboard") },
                      { label: "Users", onClick: () => showToast("info", "Navigated to Users") },
                      { label: "John Doe", onClick: () => showToast("info", "Navigated to User Profile") },
                      { label: "Edit Profile" }
                    ]}
                  />
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">File System:</span>
                <div className="mt-1">
                  <Breadcrumbs 
                    items={[
                      { label: "Documents", onClick: () => showToast("info", "Navigated to Documents") },
                      { label: "Projects", onClick: () => showToast("info", "Navigated to Projects") },
                      { label: "Design System", onClick: () => showToast("info", "Navigated to Design System") },
                      { label: "Components" }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Tabs Components</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Basic Tabs:</span>
                <div className="mt-2">
                  <Tabs defaultValue="account">
                    <TabsList>
                      <TabsTrigger value="account">Account</TabsTrigger>
                      <TabsTrigger value="password">Password</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="mt-4 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <h4 className="font-medium mb-2">Account Settings</h4>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Manage your account settings and set e-mail preferences.
                      </p>
                    </TabsContent>
                    <TabsContent value="password" className="mt-4 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <h4 className="font-medium mb-2">Password Settings</h4>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Change your password here. After saving, you'll be logged out.
                      </p>
                    </TabsContent>
                    <TabsContent value="settings" className="mt-4 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <h4 className="font-medium mb-2">General Settings</h4>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Configure your general application settings and preferences.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Dashboard Tabs:</span>
                <div className="mt-2">
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                      <TabsTrigger value="reports">Reports</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <h4 className="font-medium mb-2">Overview Dashboard</h4>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        View your key metrics and recent activity summary.
                      </p>
                    </TabsContent>
                    <TabsContent value="analytics" className="mt-4 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <h4 className="font-medium mb-2">Analytics Dashboard</h4>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Detailed analytics and performance metrics for your application.
                      </p>
                    </TabsContent>
                    <TabsContent value="reports" className="mt-4 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <h4 className="font-medium mb-2">Reports Center</h4>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Generate and download various reports for your data.
                      </p>
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-4 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <h4 className="font-medium mb-2">Notification Settings</h4>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Manage your notification preferences and alerts.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-[var(--color-muted-foreground)]">Skeleton Components</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Card Skeleton:</span>
                <div className="mt-2 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex space-x-2 pt-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Profile Skeleton:</span>
                <div className="mt-2 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">List Skeleton:</span>
                <div className="mt-2 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)]">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-2 w-1/2" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-xs text-[var(--color-muted-foreground)]">Form Skeleton:</span>
                <div className="mt-2 p-4 bg-[var(--color-card)] rounded-[var(--radius)] border border-[var(--color-border)] space-y-3">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Components Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Overlay Components</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Modal Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline"
                onClick={() => openModal("basic")}
              >
                Basic Modal
              </Button>
              <Button 
                variant="outline"
                onClick={() => openModal("confirmation")}
              >
                Confirmation Modal
              </Button>
              <Button 
                variant="outline"
                onClick={() => openModal("form")}
              >
                Form Modal
              </Button>
              <Button 
                variant="outline"
                onClick={() => openModal("large")}
              >
                Large Modal
              </Button>
            </div>
            
            {/* Basic Modal */}
            <Modal 
              isOpen={modals.basic} 
              onClose={() => closeModal("basic")}
              size="md"
            >
              <ModalHeader>
                <ModalTitle>Basic Modal</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <ModalDescription>
                  This is a basic modal example. It demonstrates the standard modal structure with header, body, and footer sections.
                </ModalDescription>
                <div className="mt-4">
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Modals are great for displaying content that requires user attention without navigating away from the current page.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={() => closeModal("basic")}>
                  Cancel
                </Button>
                <Button onClick={() => closeModal("basic")}>
                  Got it
                </Button>
              </ModalFooter>
            </Modal>
            
            {/* Confirmation Modal */}
            <Modal 
              isOpen={modals.confirmation} 
              onClose={() => closeModal("confirmation")}
              size="sm"
            >
              <ModalHeader>
                <ModalTitle>Confirm Action</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <ModalDescription>
                  Are you sure you want to delete this item? This action cannot be undone.
                </ModalDescription>
                <div className="mt-4 p-3 bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded-[var(--radius)]">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 text-[var(--color-destructive)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p className="text-xs text-[var(--color-destructive)]">
                      This action is permanent and cannot be reversed.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={() => closeModal("confirmation")}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmAction}>
                  Delete
                </Button>
              </ModalFooter>
            </Modal>
            
            {/* Form Modal */}
            <Modal 
              isOpen={modals.form} 
              onClose={() => closeModal("form")}
              size="lg"
            >
              <ModalHeader>
                <ModalTitle>Create New User</ModalTitle>
                <ModalDescription>
                  Fill out the form below to create a new user account.
                </ModalDescription>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    placeholder="Full Name"
                    value={modalFormData.name}
                    onChange={(e) => handleModalFormChange("name", e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={modalFormData.email}
                    onChange={(e) => handleModalFormChange("email", e.target.value)}
                  />
                  <Select 
                    value={modalFormData.role}
                    onChange={(e) => handleModalFormChange("role", e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                  </Select>
                  <Textarea
                    placeholder="Additional notes (optional)"
                    value={modalFormData.notes}
                    onChange={(e) => handleModalFormChange("notes", e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      label="Send welcome email to user"
                      checked={modalFormData.sendWelcome}
                      onChange={(e) => handleModalFormChange("sendWelcome", e.target.checked)}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={() => closeModal("form")}>
                  Cancel
                </Button>
                <Button onClick={handleFormSubmit}>
                  Create User
                </Button>
              </ModalFooter>
            </Modal>
            
            {/* Large Modal */}
            <Modal 
              isOpen={modals.large} 
              onClose={() => closeModal("large")}
              size="xl"
            >
              <ModalHeader>
                <ModalTitle>Large Modal with Data</ModalTitle>
                <ModalDescription>
                  This modal demonstrates a larger size with embedded components.
                </ModalDescription>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">User Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--color-secondary)]/30 rounded-[var(--radius)]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--color-muted-foreground)]">Active Users</span>
                          <Badge variant="success">+12%</Badge>
                        </div>
                        <div className="text-2xl font-bold font-mono mt-1">1,234</div>
                      </div>
                      <div className="p-4 bg-[var(--color-secondary)]/30 rounded-[var(--radius)]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--color-muted-foreground)]">Revenue</span>
                          <Badge variant="success">+8%</Badge>
                        </div>
                        <div className="text-2xl font-bold font-mono mt-1">$45,231</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                          <Avatar size="sm" fallback={`U${i}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">User {i} performed an action</p>
                            <p className="text-xs text-[var(--color-muted-foreground)]">{i} minutes ago</p>
                          </div>
                          <Badge variant="info">New</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={() => closeModal("large")}>
                  Close
                </Button>
                <Button onClick={() => closeModal("large")}>
                  Save Changes
                </Button>
              </ModalFooter>
            </Modal>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Dropdown Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Basic Dropdown */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">Basic Dropdown:</span>
                <Dropdown>
                  <DropdownTrigger>
                    Options
                  </DropdownTrigger>
                  <DropdownContent>
                    <DropdownItem onClick={() => showToast("info", "Profile clicked")}>
                      Profile
                    </DropdownItem>
                    <DropdownItem onClick={() => showToast("info", "Settings clicked")}>
                      Settings
                    </DropdownItem>
                    <DropdownItem onClick={() => showToast("info", "Billing clicked")}>
                      Billing
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem onClick={() => showToast("info", "Help clicked")}>
                      Help
                    </DropdownItem>
                    <DropdownItem 
                      destructive 
                      onClick={() => showToast("warning", "Logout clicked")}
                    >
                      Logout
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </div>

              {/* User Actions Dropdown */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">User Actions:</span>
                <Dropdown>
                  <DropdownTrigger asChild>
                    <div className="flex items-center gap-2 p-2 hover:bg-[var(--color-secondary)] rounded-[var(--radius)] cursor-pointer">
                      <Avatar size="sm" fallback="JD" />
                      <div className="text-left">
                        <div className="text-sm font-medium">John Doe</div>
                        <div className="text-xs text-[var(--color-muted-foreground)]">john@example.com</div>
                      </div>
                    </div>
                  </DropdownTrigger>
                  <DropdownContent align="start">
                    <DropdownLabel>My Account</DropdownLabel>
                    <DropdownItem onClick={() => showToast("info", "View Profile")}>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </DropdownItem>
                    <DropdownItem onClick={() => showToast("info", "Account Settings")}>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem onClick={() => showToast("info", "Support")}>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Support
                    </DropdownItem>
                    <DropdownItem 
                      destructive 
                      onClick={() => showToast("destructive", "Signed out")}
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </div>

              {/* Actions Menu */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">Actions Menu:</span>
                <Dropdown>
                  <DropdownTrigger asChild>
                    <Button variant="outline">
                      Actions
                    </Button>
                  </DropdownTrigger>
                  <DropdownContent>
                    <DropdownLabel>Document Actions</DropdownLabel>
                    <DropdownItem onClick={() => showToast("success", "Document saved")}>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save
                    </DropdownItem>
                    <DropdownItem onClick={() => showToast("info", "Document exported")}>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export
                    </DropdownItem>
                    <DropdownItem onClick={() => showToast("info", "Document shared")}>
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem 
                      destructive 
                      onClick={() => showToast("destructive", "Document deleted")}
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </div>

              {/* Status Filter */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">Filter by Status:</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Badge variant="secondary">
                      {selectedStatus === "All Status" ? "All Status" : 
                       selectedStatus === "Active" ? 
                       <div className="flex items-center">
                         <div className="w-2 h-2 bg-[var(--color-green-500)] rounded-full mr-1"></div>
                         Active
                       </div> :
                       selectedStatus === "Pending" ?
                       <div className="flex items-center">
                         <div className="w-2 h-2 bg-[var(--color-yellow-500)] rounded-full mr-1"></div>
                         Pending
                       </div> :
                       selectedStatus === "Inactive" ?
                       <div className="flex items-center">
                         <div className="w-2 h-2 bg-[var(--color-red-500)] rounded-full mr-1"></div>
                         Inactive
                       </div> : selectedStatus
                      }
                    </Badge>
                  </DropdownTrigger>
                  <DropdownContent align="end">
                    <DropdownItem onClick={() => handleStatusFilter("All Status")}>
                      All Status
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem onClick={() => handleStatusFilter("Active")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[var(--color-green-500)] rounded-full mr-2"></div>
                        Active
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleStatusFilter("Pending")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[var(--color-yellow-500)] rounded-full mr-2"></div>
                        Pending
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleStatusFilter("Inactive")}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-[var(--color-red-500)] rounded-full mr-2"></div>
                        Inactive
                      </div>
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              </div>
              
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Loading Components</h3>
            
            <div className="space-y-6">
              {/* Spinner Variants */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Spinner Variants:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                    <div className="text-center">
                      <div className="mb-2">
                        <Spinner variant="spin" size="lg" />
                      </div>
                      <span className="text-xs text-[var(--color-muted-foreground)]">Spin</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                    <div className="text-center">
                      <div className="mb-2">
                        <Spinner variant="pulse" size="lg" />
                      </div>
                      <span className="text-xs text-[var(--color-muted-foreground)]">Pulse</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                    <div className="text-center">
                      <div className="mb-2">
                        <Spinner variant="bounce" size="lg" />
                      </div>
                      <span className="text-xs text-[var(--color-muted-foreground)]">Bounce</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                    <div className="text-center">
                      <div className="mb-2">
                        <Spinner variant="dots" size="lg" />
                      </div>
                      <span className="text-xs text-[var(--color-muted-foreground)]">Dots</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Spinner Sizes */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Spinner Sizes:</span>
                <div className="flex items-center gap-6 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner size="xs" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">XS</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner size="sm" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">SM</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner size="md" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">MD</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner size="lg" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">LG</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner size="xl" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">XL</span>
                  </div>
                </div>
              </div>
              
              {/* Spinner Colors */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Spinner Colors:</span>
                <div className="flex items-center gap-6 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner color="primary" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">Primary</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner color="secondary" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">Secondary</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner color="success" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">Success</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner color="warning" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">Warning</span>
                  </div>
                  <div className="text-center">
                    <div className="mb-1">
                      <Spinner color="destructive" />
                    </div>
                    <span className="text-xs text-[var(--color-muted-foreground)]">Destructive</span>
                  </div>
                </div>
              </div>
              
              {/* Loading Buttons */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Loading Buttons:</span>
                <div className="space-y-4">
                  {/* LoadingButton Component Examples */}
                  <div>
                    <span className="text-xs text-[var(--color-muted-foreground)] mb-2 block">LoadingButton Component:</span>
                    <div className="flex flex-wrap gap-4">
                      <LoadingButton
                        loading={loadingStates.button1}
                        onClick={() => simulateLoading("button1")}
                      >
                        {loadingStates.button1 ? "Processing..." : "Save Document"}
                      </LoadingButton>
                      
                      <LoadingButton
                        loading={loadingStates.button2}
                        onClick={() => simulateLoading("button2", 3000)}
                        className="bg-[var(--color-green-500)] border-[var(--color-green-500)] hover:bg-[var(--color-green-600)] hover:border-[var(--color-green-600)]"
                      >
                        {loadingStates.button2 ? "Uploading..." : "Upload Files"}
                      </LoadingButton>
                      
                      <LoadingButton
                        loading={loadingStates.button3}
                        onClick={() => simulateLoading("button3", 1500)}
                        className="bg-[var(--color-destructive)] border-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/90 hover:border-[var(--color-destructive)]/90"
                      >
                        {loadingStates.button3 ? "Deleting..." : "Delete Items"}
                      </LoadingButton>
                    </div>
                  </div>
                  
                  {/* Manual Integration with Button Component */}
                  <div>
                    <span className="text-xs text-[var(--color-muted-foreground)] mb-2 block">Manual Spinner Integration:</span>
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        disabled={loadingStates.button1}
                        onClick={() => simulateLoading("button1")}
                        className="flex items-center gap-2"
                      >
                        {loadingStates.button1 && <Spinner size="xs" color="white" />}
                        {loadingStates.button1 ? "Saving..." : "Save"}
                      </Button>
                      
                      <Button 
                        variant="outline"
                        disabled={loadingStates.button2}
                        onClick={() => simulateLoading("button2", 3000)}
                        className="flex items-center gap-2"
                      >
                        {loadingStates.button2 && <Spinner size="xs" color="primary" />}
                        {loadingStates.button2 ? "Uploading..." : "Upload"}
                      </Button>
                      
                      <Button 
                        variant="destructive"
                        disabled={loadingStates.button3}
                        onClick={() => simulateLoading("button3", 1500)}
                        className="flex items-center gap-2"
                      >
                        {loadingStates.button3 && <Spinner size="xs" color="white" />}
                        {loadingStates.button3 ? "Deleting..." : "Delete"}
                      </Button>
                      
                      <Button 
                        variant="ghost"
                        disabled={loadingStates.button1}
                        onClick={() => simulateLoading("button1")}
                        className="flex items-center gap-2"
                      >
                        {loadingStates.button1 && <Spinner variant="dots" size="xs" color="primary" />}
                        {loadingStates.button1 ? "Processing..." : "Process"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Different Spinner Variants in Buttons */}
                  <div>
                    <span className="text-xs text-[var(--color-muted-foreground)] mb-2 block">Different Spinner Variants:</span>
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        disabled={loadingStates.button1}
                        onClick={() => simulateLoading("button1")}
                        className="flex items-center gap-2 min-w-[120px]"
                      >
                        {loadingStates.button1 && <Spinner variant="spin" size="xs" color="white" />}
                        {loadingStates.button1 ? "Loading..." : "Spin Loader"}
                      </Button>
                      
                      <Button 
                        disabled={loadingStates.button2}
                        onClick={() => simulateLoading("button2", 2000)}
                        className="flex items-center gap-2 min-w-[120px]"
                      >
                        {loadingStates.button2 && <Spinner variant="pulse" size="xs" color="white" />}
                        {loadingStates.button2 ? "Loading..." : "Pulse Loader"}
                      </Button>
                      
                      <Button 
                        disabled={loadingStates.button3}
                        onClick={() => simulateLoading("button3", 2500)}
                        className="flex items-center gap-2 min-w-[120px]"
                      >
                        {loadingStates.button3 && <Spinner variant="bounce" size="xs" color="white" />}
                        {loadingStates.button3 ? "Loading..." : "Bounce Loader"}
                      </Button>
                      
                      <Button 
                        variant="outline"
                        disabled={loadingStates.button1}
                        onClick={() => simulateLoading("button1")}
                        className="flex items-center gap-2 min-w-[120px]"
                      >
                        {loadingStates.button1 && <Spinner variant="dots" size="xs" color="primary" />}
                        {loadingStates.button1 ? "Loading..." : "Dots Loader"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Inline Loading States */}
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Inline Loading Examples:</span>
                <div className="space-y-4">
                  <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                    <div className="flex items-center gap-3">
                      <Spinner size="sm" />
                      <span className="text-sm">Loading user data...</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Syncing changes</span>
                      <Spinner variant="dots" size="sm" color="primary" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)]">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Spinner variant="pulse" size="sm" color="success" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Processing payment</div>
                        <div className="text-xs text-[var(--color-muted-foreground)]">This may take a few moments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-4">File Upload Components</h3>
            
            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Dropzone Upload:</span>
                <FileUpload
                  variant="dropzone"
                  accept="*/*"
                  multiple
                  maxSize={10}
                  maxFiles={5}
                  onFileSelect={(files) => handleFileUpload('dropzone', files)}
                  className="max-w-lg"
                >
                  Upload Files
                </FileUpload>
              </div>
              
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Minimal Upload:</span>
                <div className="p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius)] max-w-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Add attachments to your message</span>
                    <FileUpload
                      variant="minimal"
                      accept="*/*"
                      multiple
                      maxSize={5}
                      maxFiles={3}
                      onFileSelect={(files) => handleFileUpload('minimal', files)}
                      showPreview={false}
                    />
                  </div>
                  {uploadedFiles.minimal.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.minimal.map((file, index) => (
                          <div key={index} className="flex items-center gap-1 px-2 py-1 bg-[var(--color-secondary)] rounded text-xs">
                            <span>📎</span>
                            <span>{file.name}</span>
                            <button
                              onClick={() => {
                                const updated = uploadedFiles.minimal.filter((_, i) => i !== index);
                                setUploadedFiles(prev => ({ ...prev, minimal: updated }));
                              }}
                              className="text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)]"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Components Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Data Components</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Table Components</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">User Management Table:</span>
                <Table>
                  <TableCaption>A list of recent users and their information.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">John Doe</TableCell>
                      <TableCell>john.doe@example.com</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell><Badge variant="success">Active</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Alice Smith</TableCell>
                      <TableCell>alice.smith@example.com</TableCell>
                      <TableCell>Developer</TableCell>
                      <TableCell><Badge variant="success">Active</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bob Johnson</TableCell>
                      <TableCell>bob.johnson@example.com</TableCell>
                      <TableCell>Designer</TableCell>
                      <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Carol Williams</TableCell>
                      <TableCell>carol.williams@example.com</TableCell>
                      <TableCell>Manager</TableCell>
                      <TableCell><Badge variant="destructive">Inactive</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">Project Stats Table:</span>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Design System</TableCell>
                      <TableCell>
                        <Progress value={85} size="sm" />
                      </TableCell>
                      <TableCell className="font-mono">4</TableCell>
                      <TableCell>2024-02-15</TableCell>
                      <TableCell><Badge variant="warning">High</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mobile App</TableCell>
                      <TableCell>
                        <Progress value={65} size="sm" />
                      </TableCell>
                      <TableCell className="font-mono">6</TableCell>
                      <TableCell>2024-03-01</TableCell>
                      <TableCell><Badge variant="info">Medium</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Website Redesign</TableCell>
                      <TableCell>
                        <Progress value={30} size="sm" />
                      </TableCell>
                      <TableCell className="font-mono">3</TableCell>
                      <TableCell>2024-04-10</TableCell>
                      <TableCell><Badge variant="secondary">Low</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="mt-6">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">Analytics Dashboard Table:</span>
              <div className="max-w-2xl">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Previous Period</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Users</TableCell>
                      <TableCell className="font-mono">12,459</TableCell>
                      <TableCell className="font-mono text-[var(--color-muted-foreground)]">11,023</TableCell>
                      <TableCell><Badge variant="success">+12.5%</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Revenue</TableCell>
                      <TableCell className="font-mono">$45,231</TableCell>
                      <TableCell className="font-mono text-[var(--color-muted-foreground)]">$41,789</TableCell>
                      <TableCell><Badge variant="success">+8.2%</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bounce Rate</TableCell>
                      <TableCell className="font-mono">23.1%</TableCell>
                      <TableCell className="font-mono text-[var(--color-muted-foreground)]">22.5%</TableCell>
                      <TableCell><Badge variant="destructive">+2.7%</Badge></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Conversion Rate</TableCell>
                      <TableCell className="font-mono">3.24%</TableCell>
                      <TableCell className="font-mono text-[var(--color-muted-foreground)]">3.27%</TableCell>
                      <TableCell><Badge variant="warning">-0.9%</Badge></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="mt-8">
              <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-4 block">Paginated User Management Table:</span>
              
              <div className="space-y-4">
                {/* Table Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <PaginationInfo 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                  />
                  <div className="flex items-center gap-4">
                    <ItemsPerPage
                      value={itemsPerPage}
                      options={[5, 10, 20, 50]}
                      onValueChange={handleItemsPerPageChange}
                    />
                  </div>
                </div>
                
                {/* Sortable Table with Fixed Layout */}
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-[var(--color-secondary)]/50 select-none w-[180px]"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-[var(--color-secondary)]/50 select-none w-[220px]"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          {getSortIcon('email')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-[var(--color-secondary)]/50 select-none w-[120px]"
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center gap-2">
                          Role
                          {getSortIcon('role')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-[var(--color-secondary)]/50 select-none w-[100px]"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-[var(--color-secondary)]/50 select-none w-[110px]"
                        onClick={() => handleSort('joinDate')}
                      >
                        <div className="flex items-center gap-2">
                          Join Date
                          {getSortIcon('joinDate')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-[var(--color-secondary)]/50 select-none text-right w-[90px]"
                        onClick={() => handleSort('projects')}
                      >
                        <div className="flex items-center gap-2 justify-end">
                          Projects
                          {getSortIcon('projects')}
                        </div>
                      </TableHead>
                      <TableHead className="text-right w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium w-[180px] truncate">{user.name}</TableCell>
                        <TableCell className="text-[var(--color-muted-foreground)] w-[220px] truncate" title={user.email}>{user.email}</TableCell>
                        <TableCell className="w-[120px] truncate">{user.role}</TableCell>
                        <TableCell className="w-[100px]">{getStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-[var(--color-muted-foreground)] w-[110px]">{user.joinDate}</TableCell>
                        <TableCell className="font-mono text-right w-[90px]">{user.projects}</TableCell>
                        <TableCell className="text-right w-[140px]">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => showToast("info", `Viewing ${user.name}`)}>View</Button>
                            <Button variant="ghost" size="sm" onClick={() => showToast("info", `Editing ${user.name}`)}>Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>
                    Showing {paginatedUsers.length} of {totalItems} users
                  </TableCaption>
                </Table>
                
                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
                  <div className="text-sm text-[var(--color-muted-foreground)]">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    maxVisiblePages={5}
                    size="md"
                  />
                </div>
                
                {/* Additional Pagination Examples */}
                <div className="mt-8 space-y-6">
                  <div>
                    <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Different Pagination Sizes:</span>
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-[var(--color-muted-foreground)] mb-2 block">Small:</span>
                        <Pagination 
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          size="sm"
                          maxVisiblePages={3}
                          showFirstLast={false}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-[var(--color-muted-foreground)] mb-2 block">Medium:</span>
                        <Pagination 
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          size="md"
                          maxVisiblePages={5}
                        />
                      </div>
                      <div>
                        <span className="text-xs text-[var(--color-muted-foreground)] mb-2 block">Large:</span>
                        <Pagination 
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                          size="lg"
                          maxVisiblePages={7}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Minimal Pagination (no first/last):</span>
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      showFirstLast={false}
                      maxVisiblePages={5}
                    />
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-[var(--color-muted-foreground)] mb-3 block">Simple Pagination (prev/next only):</span>
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      showFirstLast={false}
                      maxVisiblePages={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Alerts - Bottom Right Stack */}
      {alerts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {alerts.map((alert, index) => (
            <Alert 
              key={alert.id}
              variant={alert.variant}
              className="min-w-[300px] max-w-[400px] shadow-lg animate-in slide-in-from-right-full duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{alert.message}</span>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="ml-2 text-current opacity-70 hover:opacity-100 text-xs"
                >
                  ✕
                </button>
              </div>
            </Alert>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
