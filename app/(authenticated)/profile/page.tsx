"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import Alert from '@/components/ui/alert';
import { authenticatedFetch } from '@/lib/auth';

export default function ProfilePage() {
  console.log("👤 [PROFILE] Component mounting/rendering");
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alerts, setAlerts] = useState<Array<{id: number, variant: "info" | "success" | "warning" | "destructive", message: string}>>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirm: ''
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fetchUserProfile = async () => {
    try {
      // First, load from localStorage immediately
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || ''
        });
        setLoading(false);
      }

      // Then fetch fresh data from API
      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/`);

      if (response.ok) {
        const profileData = await response.json();
        localStorage.setItem('user_data', JSON.stringify(profileData));
        setUser(profileData);
        setFormData({
          name: profileData.name || '',
          email: profileData.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const showToast = (variant: "info" | "success" | "warning" | "destructive", message: string) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, variant, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/update/`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name.trim()
        })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        
        
        // Extract the actual user data from API response
        const actualUserData = updatedProfile.user || updatedProfile;
        
        // Use the updated profile data directly (no more phone/bio to merge)
        const mergedProfile = actualUserData;
        
        // Update localStorage with CORRECT structure (direct user object, not nested)
        localStorage.setItem('user_data', JSON.stringify(mergedProfile));
        
        
        // Update local state
        setUser(mergedProfile);
        setFormData({
          name: mergedProfile.name || '',
          email: mergedProfile.email || ''
        });
        
        setIsEditing(false);
        showToast('success', 'Profile updated successfully!');
        
        // Force complete page refresh
        setTimeout(() => {
          // Use both methods to ensure complete refresh
          router.refresh();
          // This forces a hard refresh by navigating to the same URL
          window.location.replace(window.location.href);
        }, 500); // Very short delay to show the toast briefly
      } else {
        const errorData = await response.json();
        console.error('Failed to update profile:', errorData);
        
        // Handle validation errors
        if (errorData.error && errorData.error.details) {
          const errors = errorData.error.details;
          let errorMessage = 'Profile update failed:\n';
          
          if (errors.name) {
            errorMessage += `Name: ${errors.name.join(', ')}\n`;
          }
          if (errors.email) {
            errorMessage += `Email: ${errors.email.join(', ')}\n`;
          }
          
          showToast('destructive', errorMessage.trim());
        } else {
          showToast('destructive', 'Failed to update profile. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('destructive', 'Failed to update profile. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirm) {
      showToast('destructive', 'Please fill in all password fields');
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirm) {
      showToast('destructive', 'New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      showToast('destructive', 'New password must be at least 8 characters long');
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/password/change/`, {
        method: 'POST',
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          new_password_confirm: passwordData.new_password_confirm
        })
      });

      if (response.ok) {
        const result = await response.json();
        showToast('success', result.message || 'Password changed successfully!');
        
        // Clear password form
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirm: ''
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to change password:', errorData);
        
        if (errorData.error && errorData.error.details) {
          const errors = errorData.error.details;
          let errorMessage = 'Password change failed:\n';
          
          if (errors.current_password) {
            errorMessage += `Current Password: ${errors.current_password.join(', ')}\n`;
          }
          if (errors.new_password) {
            errorMessage += `New Password: ${errors.new_password.join(', ')}\n`;
          }
          if (errors.new_password_confirm) {
            errorMessage += `Password Confirmation: ${errors.new_password_confirm.join(', ')}\n`;
          }
          
          showToast('destructive', errorMessage.trim());
        } else {
          showToast('destructive', 'Failed to change password. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('destructive', 'Failed to change password. Please check your connection and try again.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      current_password: '',
      new_password: '',
      new_password_confirm: ''
    });
  };

  const renderProfileSkeleton = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Skeleton */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
              <div className="text-center">
                <Skeleton className="h-8 w-8 mx-auto mb-2" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-28" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (loading || !user) {
    return renderProfileSkeleton();
  }

  const renderTeacherProfile = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Teacher Profile</h1>
        <Badge variant="info">TEACHER</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Personal Information
                <Button 
                  variant={isEditing ? "outline" : "secondary"} 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Full Name</label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)]">{user.name}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="cursor-not-allowed"
                  />
                </div>
              </div>



              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Change Section */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Current Password</label>
                <Input
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">New Password</label>
                  <Input
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 8 chars)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Confirm New Password</label>
                  <Input
                    name="new_password_confirm"
                    type="password"
                    value={passwordData.new_password_confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="primary" onClick={handlePasswordSubmit} disabled={isSavingPassword}>
                  {isSavingPassword ? 'Changing...' : 'Change Password'}
                </Button>
                <Button variant="outline" onClick={handlePasswordCancel} disabled={isSavingPassword}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teaching Stats */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Teaching Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-primary)]">5</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-success)]">142</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-warning)]">3.5</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Years Teaching</div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Master of Education</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">University of Excellence, 2020</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Bachelor of Science</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">State University, 2018</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Teaching Certificate</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">Education Board, 2019</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderStudentProfile = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Student Profile</h1>
        <Badge variant="success">STUDENT</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Personal Information
                <Button 
                  variant={isEditing ? "outline" : "secondary"} 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Full Name</label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)]">{user.name}</div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted-foreground)] mb-2 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="cursor-not-allowed"
                  />
                </div>
              </div>



              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Change Section */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Current Password</label>
                <Input
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">New Password</label>
                  <Input
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min 8 chars)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Confirm New Password</label>
                  <Input
                    name="new_password_confirm"
                    type="password"
                    value={passwordData.new_password_confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="primary" onClick={handlePasswordSubmit} disabled={isSavingPassword}>
                  {isSavingPassword ? 'Changing...' : 'Change Password'}
                </Button>
                <Button variant="outline" onClick={handlePasswordCancel} disabled={isSavingPassword}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Stats */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-success)]">3.8</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Overall GPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-primary)]">6</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Enrolled Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-warning)]">45</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">Credits Earned</div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Semester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { course: 'Mathematics 101', grade: 'A-' },
                  { course: 'Physics', grade: 'B+' },
                  { course: 'Chemistry', grade: 'A' },
                  { course: 'History', grade: 'B' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{item.course}</span>
                    <Badge variant={item.grade.startsWith('A') ? 'success' : 'info'}>
                      {item.grade}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {user.role === 'TEACHER' ? renderTeacherProfile() : renderStudentProfile()}
      
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
    </>
  );
}