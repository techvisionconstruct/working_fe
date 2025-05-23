'use client'

import React, { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Input,
  Label,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shared";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Shield,
  Bell,
  Clock,
  Save,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  X,
} from "lucide-react";
import { useUser } from "@/components/contexts/user-context";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/api/user-profile/update-user-profile';
import { ProfileUpdateRequest } from '@/types/user-profile/dto';
import { toast } from 'sonner';

export default function ProfileSettingsPage() {
  const { user } = useUser();
  const userProfile = user?.data;
  // Signature image upload state
  const [signatureImage, setSignatureImage] = useState<string | undefined>(undefined);
  const [originalSignatureImage, setOriginalSignatureImage] = useState<string | undefined>(undefined);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [isDraggingSignature, setIsDraggingSignature] = useState(false);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Avatar (profile picture) upload state
  const [avatarImage, setAvatarImage] = useState<string | undefined>(userProfile?.avatar_url || undefined);
  const [originalAvatarImage, setOriginalAvatarImage] = useState<string | undefined>(userProfile?.avatar_url || undefined);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form field state (useState instead of useRef)
  const [firstName, setFirstName] = useState(userProfile?.created_by?.first_name || "");
  const [lastName, setLastName] = useState(userProfile?.created_by?.last_name || "");
  const [company, setCompany] = useState(userProfile?.company_name || "");
  const [jobTitle, setJobTitle] = useState(userProfile?.job_title || "");
  const [email] = useState(userProfile?.created_by?.email || "");
  const [phone, setPhone] = useState(userProfile?.phone_number || "");
  const [address, setAddress] = useState(userProfile?.address || "");
  const [city, setCity] = useState(userProfile?.city || "");
  const [stateVal, setStateVal] = useState(userProfile?.state || "");
  const [zip, setZip] = useState(userProfile?.postal_code || "");
  const [country, setCountry] = useState(userProfile?.country || "");

  // Prepopulate form fields when userProfile changes
  React.useEffect(() => {
    setFirstName(userProfile?.created_by?.first_name || "");
    setLastName(userProfile?.created_by?.last_name || "");
    setCompany(userProfile?.company_name || "");
    setJobTitle(userProfile?.job_title || "");
    // setEmail is not needed since email is disabled and not editable
    setPhone(userProfile?.phone_number || "");
    setAddress(userProfile?.address || "");
    setCity(userProfile?.city || "");
    setStateVal(userProfile?.state || "");
    setZip(userProfile?.postal_code || "");
    setCountry(userProfile?.country || "");
    setSignatureImage(userProfile?.signature_image || undefined);
    setOriginalSignatureImage(userProfile?.signature_image || undefined);
    setAvatarImage(userProfile?.avatar_url || undefined);
    setOriginalAvatarImage(userProfile?.avatar_url || undefined);
  }, [userProfile]);

  // TanStack Query mutation
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: ProfileUpdateRequest) => {
      if (!userProfile?.id) throw new Error('No user profile ID');
      return updateUserProfile(userProfile.id, data);
    },
    onSuccess: () => {
      toast.success("Your profile was updated successfully.");
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update profile');
    },
  });

  console.log("userProfile", userProfile);
  // Signature image upload handlers
  const handleSignatureFileSelect = () => {
    signatureInputRef.current?.click();
  };
  const handleSignatureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSignatureFile(e.target.files[0]);
    }
  };
  const handleSignatureDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSignature(true);
  };
  const handleSignatureDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSignature(false);
  };
  const handleSignatureDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleSignatureDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSignature(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSignatureFile(e.dataTransfer.files[0]);
    }
  };
  const processSignatureFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      return;
    }
    setIsUploadingSignature(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setSignatureImage(base64String);
      setIsUploadingSignature(false);
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveSignature = () => {
    setSignatureImage(undefined);
  };

  // Avatar image upload handlers
  const handleAvatarFileSelect = () => {
    avatarInputRef.current?.click();
  };
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAvatarFile(e.target.files[0]);
    }
  };
  const handleAvatarDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(true);
  };
  const handleAvatarDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(false);
  };
  const handleAvatarDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAvatar(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAvatarFile(e.dataTransfer.files[0]);
    }
  };
  const processAvatarFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed.");
      return;
    }
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setAvatarImage(base64String);
      setIsUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveAvatar = () => {
    setAvatarImage(undefined);
  };

  // Handler for Save Changes
  const handleSaveProfile = () => {
    // Create the base request object with all fields
    const data: ProfileUpdateRequest = {
      company_name: company || undefined,
      job_title: jobTitle || undefined,
      phone_number: phone || undefined,
      address: address || undefined,
      city: city || undefined,
      state: stateVal || undefined,
      postal_code: zip || undefined,
      country: country || undefined,
    };
    
    // Handle avatar image changes, including removal
    if (avatarImage !== originalAvatarImage) {
      // When avatarImage is undefined, it means the user wants to remove it
      // Send empty string to indicate removal to the server
      data.avatar_url = avatarImage === undefined ? "" : avatarImage;
    }
    
    // Handle signature image changes, including removal
    if (signatureImage !== originalSignatureImage) {
      // When signatureImage is undefined, it means the user wants to remove it
      // Send empty string to indicate removal to the server
      data.signature_image = signatureImage === undefined ? "" : signatureImage;
    }
    
    console.log("avatar", avatarImage, "orig", originalAvatarImage);
    console.log("signature", signatureImage, "orig", originalSignatureImage);
    mutation.mutate(data);
  };

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      {/* Profile Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
  
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Summary Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Profile Summary</CardTitle>
            <CardDescription>Your public profile information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="relative mb-4">
              {!avatarImage ? (
                <div
                  className={`h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors duration-200
                    ${isDraggingAvatar ? "border-primary/70 bg-primary/5" : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"}`}
                  onClick={handleAvatarFileSelect}
                  onDragEnter={handleAvatarDragEnter}
                  onDragLeave={handleAvatarDragLeave}
                  onDragOver={handleAvatarDragOver}
                  onDrop={handleAvatarDrop}
                  title="Upload profile picture"
                >
                  <input
                    ref={avatarInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                  />
                  {isUploadingAvatar ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <span className="text-xs font-medium">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <User className="w-8 h-8 mb-1 text-muted-foreground/70" />
                      <p className="text-xs font-medium text-muted-foreground">
                        {isDraggingAvatar ? "Drop to upload" : "Add photo"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative h-24 w-24">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-border">
                    {isUploadingAvatar ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
                        <span className="text-xs font-medium">Processing...</span>
                      </div>
                    ) : (
                      <img src={avatarImage} alt="Profile" className="object-cover w-full h-full" />
                    )}
                  </div>
                  
                  <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 bg-black/50 hover:bg-black/70 text-white border-0 text-xs" 
                        onClick={handleAvatarFileSelect}
                      >
                        Change
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 bg-black/50 hover:bg-red-600/70 text-white border-0 text-xs" 
                        onClick={handleRemoveAvatar}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                  
                  <input
                    ref={avatarInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                  />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold">{userProfile?.created_by ? `${userProfile.created_by.first_name} ${userProfile.created_by.last_name}` : "-"}</h2>
            <p className="text-sm text-muted-foreground">{userProfile?.job_title || "-"}</p>
            <div className="mt-4 flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              <span className="ml-2 text-sm text-muted-foreground">Active account</span>
            </div>
            <div className="mt-6 w-full">
              <div className="flex items-center justify-between border-t border-border py-4 text-sm">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Email</span>
                </div>
                <span className="font-medium">{userProfile?.created_by?.email || "-"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border py-4 text-sm">
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Phone</span>
                </div>
                <span className="font-medium">{userProfile?.phone_number || "-"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border py-4 text-sm">
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Company</span>
                </div>
                <span className="font-medium">{userProfile?.company_name || "-"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border py-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Location</span>
                </div>
                <span className="font-medium">{userProfile?.city || "-"}, {userProfile?.state || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="col-span-1 space-y-6 lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Clock className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name <span className="text-xs text-muted-foreground">(Not Editable WIP)</span></Label>
                      <Input id="first-name" value={firstName} disabled onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name <span className="text-xs text-muted-foreground">(Not Editable WIP)</span></Label>
                      <Input id="last-name" value={lastName} disabled onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Role</Label>
                      <Input id="job-title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-xs text-muted-foreground">(Not Editable WIP)</span></Label>
                      <Input id="email" type="email" value={email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={e => setAddress(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" value={stateVal} onChange={e => setStateVal(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Zip/Postal code</Label>
                      <Input id="zip" value={zip} onChange={e => setZip(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={country} onChange={e => setCountry(e.target.value)} />
                  </div>
                  {/* Signature Upload Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signature-upload">E-Signature <span className="text-gray-500">(Optional)</span></Label>
                    <div className="h-[180px] w-full relative">
                      {!signatureImage ? (
                        <div
                          onDragEnter={handleSignatureDragEnter}
                          onDragLeave={handleSignatureDragLeave}
                          onDragOver={handleSignatureDragOver}
                          onDrop={handleSignatureDrop}
                          onClick={handleSignatureFileSelect}
                          className={`absolute inset-0 border-2 border-dashed rounded-lg transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer
                            ${isDraggingSignature ? "border-primary/70 bg-primary/5" : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30"}`}
                        >
                          <input
                            ref={signatureInputRef}
                            type="file"
                            id="signature-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleSignatureFileChange}
                          />
                          {isUploadingSignature ? (
                            <div className="flex flex-col items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                              <span className="text-sm font-medium">Processing...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center px-4">
                              <User className="w-8 h-8 mb-2 text-muted-foreground/70" />
                              <p className="text-sm font-medium mb-1">
                                {isDraggingSignature ? "Drop to upload" : "Drop image here or click to browse"}
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="absolute inset-0">
                          <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <img
                              src={signatureImage}
                              alt="Signature preview"
                              className="w-full h-full object-contain bg-white"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-2">
                              <div className="flex justify-between items-center w-full">
                                <div className="flex items-center space-x-1.5">
                                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                                  <span className="text-xs font-medium text-white">Image uploaded</span>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    className="h-7 px-3 bg-black/30 hover:bg-black/50 text-white border-0 rounded-md text-xs font-medium"
                                    onClick={handleSignatureFileSelect}
                                  >
                                    Change
                                  </button>
                                  <button
                                    type="button"
                                    className="h-7 px-3 bg-black/30 hover:bg-red-600/70 text-white border-0 rounded-md text-xs font-medium flex items-center"
                                    onClick={handleRemoveSignature}
                                  >
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <input
                            ref={signatureInputRef}
                            type="file"
                            id="signature-upload-update"
                            className="hidden"
                            accept="image/*"
                            onChange={handleSignatureFileChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Two-factor Authentication</h3>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="font-medium">Authenticator app</p>
                        <p className="text-sm text-muted-foreground">
                          Use an authenticator app to generate one-time codes.
                        </p>
                      </div>
                      <Button variant="outline">Setup</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="font-medium">Text message</p>
                        <p className="text-sm text-muted-foreground">
                          Use your phone number to receive verification codes.
                        </p>
                      </div>
                      <Button variant="outline">Setup</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    {["Project updates", "Contract changes", "New proposals", "Team activity"].map((item) => (
                      <div key={item} className="flex items-center justify-between border-b border-border py-3">
                        <div className="space-y-0.5">
                          <p>{item}</p>
                          <p className="text-sm text-muted-foreground">Receive emails about {item.toLowerCase()}.</p>
                        </div>
                        <div className="h-6 w-11 cursor-pointer rounded-full bg-primary p-1">
                          <div className="h-4 w-4 transform rounded-full bg-white transition-transform duration-200 translate-x-5"></div>
                        </div>
                      </div>
                    ))}

                    <h3 className="text-lg font-medium pt-4">Push Notifications</h3>
                    {["Critical alerts", "Reminders", "New messages", "System announcements"].map((item) => (
                      <div key={item} className="flex items-center justify-between border-b border-border py-3">
                        <div className="space-y-0.5">
                          <p>{item}</p>
                          <p className="text-sm text-muted-foreground">Receive push notifications for {item.toLowerCase()}.</p>
                        </div>
                        <div className="h-6 w-11 cursor-pointer rounded-full bg-muted p-1">
                          <div className="h-4 w-4 transform rounded-full bg-white transition-transform duration-200"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent account activity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { 
                        icon: <FileText className="h-5 w-5 text-blue-500" />, 
                        title: "Created new proposal", 
                        description: "Commercial Building Project",
                        time: "Today at 10:30 AM" 
                      },
                      { 
                        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, 
                        title: "Contract signed", 
                        description: "Residential Renovation",
                        time: "Yesterday at 3:45 PM" 
                      },
                      { 
                        icon: <AlertCircle className="h-5 w-5 text-amber-500" />, 
                        title: "Template modified", 
                        description: "Standard Services Agreement",
                        time: "May 12, 2025" 
                      },
                      { 
                        icon: <HelpCircle className="h-5 w-5 text-gray-500" />, 
                        title: "Support request submitted", 
                        description: "Pricing calculation issue",
                        time: "May 10, 2025" 
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-4 mt-0.5 rounded-full bg-muted p-2">
                          {activity.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{activity.title}</p>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">View All Activity</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
