import React from 'react'

export default function Error() {
  return (
   <div className="p-0 mx-auto">
         <div className="flex items-center justify-center p-8 rounded-lg border border-red-200 bg-red-50">
           <div className="text-red-500 flex items-center gap-2">
             <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               className="h-5 w-5"
             >
               <circle cx="12" cy="12" r="10" />
               <line x1="12" y1="8" x2="12" y2="12" />
               <line x1="12" y1="16" x2="12.01" y2="16" />
             </svg>
             Error loading template details. Please try again later.
           </div>
         </div>
       </div>
  )
}
