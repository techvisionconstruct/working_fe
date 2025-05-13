'use client'

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
} from "@/components/shared";
import {
  Mail,
  Phone,
  Building,
  MapPin,
  CheckCircle2,
  Briefcase,
  Clock,
  ExternalLink,
  FilePenLine,
  FileCheck,
  MessagesSquare,
  Handshake,
  Share2
} from "lucide-react";
import { useUser } from '@/components/contexts/user-context';
import { format, parseISO, formatDistanceToNow, subDays } from 'date-fns';

export default function ProfilePage() {
  const { user, isLoading, error } = useUser();

  const userProfile = user?.data;
  
  // Dummy data for recent activity
  const recentActivity = [
    { 
      icon: <FilePenLine className="h-5 w-5 text-blue-500" />, 
      title: "Created new proposal", 
      project: "Commercial Building Renovation",
      time: formatDistanceToNow(subDays(new Date(), 0), { addSuffix: true })
    },
    { 
      icon: <Handshake className="h-5 w-5 text-green-500" />, 
      title: "Contract signed", 
      project: "Residential Kitchen Remodel",
      time: formatDistanceToNow(subDays(new Date(), 1), { addSuffix: true })
    },
    { 
      icon: <FileCheck className="h-5 w-5 text-purple-500" />, 
      title: "Updated template", 
      project: "Standard Service Agreement",
      time: formatDistanceToNow(subDays(new Date(), 3), { addSuffix: true })
    },
    { 
      icon: <MessagesSquare className="h-5 w-5 text-amber-500" />, 
      title: "New comment added", 
      project: "Office Complex Project",
      time: formatDistanceToNow(subDays(new Date(), 6), { addSuffix: true })
    },
    { 
      icon: <Share2 className="h-5 w-5 text-indigo-500" />, 
      title: "Shared document", 
      project: "Contractor Agreement",
      time: formatDistanceToNow(subDays(new Date(), 10), { addSuffix: true })
    }
  ];
  
  // Dummy data for skills
  const skills = [
    "Project Management", 
    "Contract Negotiation", 
    "Cost Estimation", 
    "Client Relations",
    "Sustainable Building",
    "Team Leadership"
  ];

  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      {/* Profile Header */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View your personal profile information and recent activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Main Profile Card */}
          <Card className="h-[480px] overflow-y-auto">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.created_by.username} />
                <AvatarFallback className="text-2xl">{userProfile?.created_by.first_name.charAt(0)}{userProfile?.created_by.last_name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-2xl font-bold">{userProfile?.created_by.first_name} {userProfile?.created_by.last_name}</h2>
              <p className="text-muted-foreground">{userProfile?.job_title}</p>
              
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  Pro Member
                </Badge>
              </div>
              
              <div className="mt-5 w-full border-t pt-5">
                <p className="text-sm text-left px-2 text-muted-foreground mb-4">
                  {userProfile?.bio}
                </p>

                <div className="space-y-3 w-full text-left">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{userProfile?.created_by.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{userProfile?.phone_number}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{userProfile?.company_name}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <span className="text-sm">{userProfile?.country}</span>
                  </div>
                </div>
                
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards - Moved under profile card */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Projects</p>
                    <h3 className="text-2xl font-bold">10 <span className='text-sm text-gray-400'>(Dummy Data)</span></h3>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <h3 className="text-2xl font-bold">10 <span className='text-sm text-gray-400'>(Dummy Data)</span></h3>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Briefcase className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Years of Experience</p>
                    <h3 className="text-2xl font-bold">{userProfile?.years_of_experience}</h3>
                  </div>
                  <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                    <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Projects and Activity Section */}
        <div className="md:col-span-2 space-y-6">

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>Professional capabilities and industry focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Industry Section */}
              {userProfile?.industry && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Industry Focus</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-medium">{userProfile.industry.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{userProfile.industry.description}</p>
                  </div>
                </div>
              )}
              
              {/* Skills Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Key Skills <span className='text-sm text-gray-400'>(Dummy Data)</span></h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1 bg-primary/5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity<span className='text-sm text-gray-400'> (Dummy Data)</span></CardTitle>
              <CardDescription>Latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 rounded-full bg-muted p-2">
                    {activity.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.project}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}