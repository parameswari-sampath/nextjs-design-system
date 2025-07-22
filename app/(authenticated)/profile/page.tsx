"use client";

import React, { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import { authenticatedFetch } from '@/lib/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  const fetchUserProfile = async () => {
    try {
      // First, try to load from localStorage immediately
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          bio: parsedUser.bio || ''
        });
        setLoading(false); // Show data immediately
      }

      // Then try to fetch fresh data from API (with automatic token refresh)
      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/`);

      if (response.ok) {
        const profileData = await response.json();
        // Update localStorage with fresh data
        localStorage.setItem('user_data', JSON.stringify(profileData));
        setUser(profileData);
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          bio: profileData.bio || ''
        });
      } else {
        console.log('Profile fetch failed, using cached data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If API fails, keep showing localStorage data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
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
        <div className="lg:col-span-2">
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
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Email</label>
                  {isEditing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)]">{user.email}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Phone Number</label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)]">{formData.phone || 'Not provided'}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                    className="w-full p-2 border border-[var(--color-border)] rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
                  />
                ) : (
                  <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)] min-h-[80px]">
                    {formData.bio || 'No bio provided'}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
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
        <div className="lg:col-span-2">
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
                  <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Email</label>
                  {isEditing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)]">{user.email}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Phone Number</label>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)]">{formData.phone || 'Not provided'}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                    className="w-full p-2 border border-[var(--color-border)] rounded-[var(--radius)] bg-[var(--background)] text-[var(--foreground)]"
                  />
                ) : (
                  <div className="text-sm p-2 bg-[var(--color-secondary)] rounded-[var(--radius)] min-h-[80px]">
                    {formData.bio || 'No bio provided'}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
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

  return user.role === 'TEACHER' ? renderTeacherProfile() : renderStudentProfile();
}