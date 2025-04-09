"use client"

import Image from "next/image"
import { Card, CardContent, Button, Badge } from "@/components/shared"
import type { Template } from "@/types/proposals"
import { templates } from "@/data/templates"

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void
  selectedTemplateId: number
}

export function TemplateSelector({ onSelectTemplate, selectedTemplateId }: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
         <Card
           key={template.id}
           className={`h-full rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
             selectedTemplateId === template.id 
               ? "shadow-xl translate-y-[-8px] ring-2 ring-primary/50" 
               : ""
           }`}
         >
           <div className="w-full h-30 relative">
             <Image
               src={template.imageUrl || "/placeholder.svg"}
               alt={template.title}
               fill
               className="object-cover"
             />
           </div>
           <CardContent>
             <h1 className="text-xl font-bold mt-2">{template.title}</h1>
             <p className="mt-1 text-sm text-black/50 line-clamp-3">
               {template.description}
             </p>

             <div className="flex justify-between items-center mt-4">
               <div className="flex flex-wrap gap-2 max-w-full">
                 {template.categories.slice(0, 4).map((category) => (
                   <Badge
                     key={category.id}
                     variant="outline"
                     className="font-bold uppercase text-xs"
                   >
                     {category.name}
                   </Badge>
                 ))}
                 {template.categories.length > 4 && (
                   <Badge
                     variant="outline"
                     className="font-bold uppercase text-xs"
                   >
                     +{template.categories.length - 4} more
                   </Badge>
                 )}
               </div>
             </div>
             <div className="flex gap-2 mt-2">
               <Badge variant="outline" className="flex items-center gap-1">
                 <span className="uppercase font-bold">Variables</span>
                 <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                   {template.variables?.length || 0}
                 </span>
               </Badge>
               <Badge variant="outline" className="flex items-center gap-1">
                 <span className="uppercase font-bold">Categories</span>
                 <span className="ml-1 h-4 w-4 rounded-sm bg-black/50 text-xs text-primary-foreground flex items-center justify-center">
                   {template.categories?.length || 0}
                 </span>
               </Badge>
             </div>

             <div className="flex justify-between items-center mt-4 ml-1">
               <p className="text-sm font-bold">{template.created_at}</p>
               
               {selectedTemplateId === template.id ? (
                 <Button 
                   className="text-sm font-bold uppercase" 
                   disabled
                 >
                   Selected
                 </Button>
               ) : (
                 <Button 
                   className="text-sm font-bold uppercase" 
                   onClick={() => {
                     // Add markup_percentage to each element
                     const templateWithMarkup = {
                       ...template,
                       image: template.imageUrl,
                       categories: template.categories.map(cat => ({
                         ...cat,
                         elements: cat.elements.map(el => ({
                           ...el,
                           markup_percentage: 2
                         }))
                       }))
                     };
                     onSelectTemplate(templateWithMarkup);
                   }}
                 >
                   Use this template
                 </Button>
               )}
             </div>
           </CardContent>
         </Card>
        ))}
      </div>
    </div>
  )
}

