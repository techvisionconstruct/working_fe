'use client'

import React from 'react'
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
  Separator,
  Progress,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge
} from "@/components/shared"
import { 
  BarChart, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  FilePlus, 
  FileCheck, 
  PenLine, 
  Plus, 
  UserPlus,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-0">
      {/* Dashboard Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, John. Here's an overview of your projects.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button className="rounded-full">
              <FilePlus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
        <Separator />
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +2
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,563.00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +18.2%
              </span>{" "}
              from last quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500 font-medium flex items-center">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                -4%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +1
              </span>{" "}
              new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Project Status Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
                <CardDescription>
                  Your active projects and their completion status
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 rounded-md flex items-center justify-center">
                  <BarChart className="h-16 w-16 text-muted-foreground/30" />
                  <span className="ml-2 text-sm text-muted-foreground">Chart visualization</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Tasks Due Soon */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">Proposal: Northwest Renovation</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" /> May 14, 2025
                      </p>
                    </div>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">Contract: Lakeside Remodel</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" /> May 15, 2025
                      </p>
                    </div>
                    <Badge>Urgent</Badge>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">Review: Westside Builders Bid</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <CalendarIcon className="mr-1 h-3 w-3" /> May 18, 2025
                      </p>
                    </div>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-xs rounded-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Deadlines
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Projects & Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Projects */}
            <Card className="lg:col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your recently updated projects</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Oakridge Kitchen Remodel</div>
                          <div className="text-xs text-muted-foreground">Updated 3 hours ago</div>
                        </div>
                      </div>
                      <Badge>In Progress</Badge>
                    </div>
                    <Progress value={68} />
                  </div>

                  <Separator />

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full">
                          <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-medium">Westside Office Renovation</div>
                          <div className="text-xs text-muted-foreground">Updated yesterday</div>
                        </div>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <Progress value={100} className="bg-muted" />
                  </div>

                  <Separator />

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                          <PenLine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <div className="font-medium">Hillside Residence</div>
                          <div className="text-xs text-muted-foreground">Updated 2 days ago</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                    <Progress value={34} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-xs rounded-full">View All Projects</Button>
              </CardFooter>
            </Card>
            
            {/* Recent Activity */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src="/mockup/profile-pic.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">You</span> created a new proposal for{" "}
                        <span className="font-medium">Alpine Builders</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> 2 hours ago
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src="/mockup/profile-pic.jpg" alt="Client" />
                      <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Client</span> signed contract for{" "}
                        <span className="font-medium">Oakridge Remodel</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> Yesterday
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src="/mockup/profile-pic.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">You</span> added a new template{" "}
                        <span className="font-medium">Premium Proposal</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> 2 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-xs rounded-full">View All Activity</Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <FilePlus className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </CardHeader>
              <CardContent className="pb-2">
                <h3 className="font-semibold">Create Proposal</h3>
                <p className="text-sm text-muted-foreground">Draft a new proposal from scratch or template</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <FileCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
              </CardHeader>
              <CardContent className="pb-2">
                <h3 className="font-semibold">Generate Contract</h3>
                <p className="text-sm text-muted-foreground">Create a new contract from a proposal</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <UserPlus className="h-5 w-5 text-violet-600 dark:text-violet-500" />
              </CardHeader>
              <CardContent className="pb-2">
                <h3 className="font-semibold">Add Client</h3>
                <p className="text-sm text-muted-foreground">Create a new client profile</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              </CardHeader>
              <CardContent className="pb-2">
                <h3 className="font-semibold">Create Task</h3>
                <p className="text-sm text-muted-foreground">Add new task or follow-up</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Other tabs would go here - These are placeholders */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>View and manage all your projects here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Projects tab content would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients</CardTitle>
              <CardDescription>Manage your client relationships.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Clients tab content would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>Review and manage your contracts.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Contracts tab content would go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
