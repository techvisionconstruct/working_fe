// "use client";

// import React from "react";
// import { 
//   Card, 
//   CardContent,
//   Button 
// } from "@/components/shared";
// import { Printer, Download, Mail } from "lucide-react";
// import { TemplateResponse } from "@/types/templates/dto";

// interface PreviewTabProps {
//   formData: {
//     template: null;
//     proposalDetails: {
//         name: string;
//         description: string;
//         image: string;
//         client_name: string;
//         client_email: string;
//         client_phone: string;
//         client_address: string;
//         valid_until: string;
//         location: string;
//     };
//   };
// }

// const PreviewTab: React.FC<PreviewTabProps> = ({ formData }) => {
//   const { proposalDetails } = formData;

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleDownload = () => {
//     // In a real application, this would generate and download a PDF
//     console.log("Download PDF functionality would be implemented here");
//   };

//   const handleSendEmail = () => {
//     // In a real application, this would open a modal to send the proposal via email
//     console.log("Email sending functionality would be implemented here");
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return "Not specified";
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (e) {
//       return "Invalid date";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Preview Your Proposal</h2>
//         <p className="text-muted-foreground mb-6">
//           Review your proposal before finalizing. You can print, download as PDF, or send it directly to your client.
//         </p>
//       </div>
      
//       <div className="flex flex-wrap gap-2 mb-6">
//         <Button variant="outline" onClick={handlePrint}>
//           <Printer className="mr-2 h-4 w-4" />
//           Print
//         </Button>
//         <Button variant="outline" onClick={handleDownload}>
//           <Download className="mr-2 h-4 w-4" />
//           Download PDF
//         </Button>
//         <Button variant="outline" onClick={handleSendEmail}>
//           <Mail className="mr-2 h-4 w-4" />
//           Send via Email
//         </Button>
//       </div>

//       {/* Proposal Preview */}
//       <div className="border rounded-md p-8 bg-white">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="mb-8 text-center">
//             <h1 className="text-3xl font-bold mb-2">{proposalDetails.name || "Untitled Proposal"}</h1>
//             <p className="text-lg text-muted-foreground">Prepared for: {proposalDetails.client_name || "Client Name"}</p>
//             <p className="text-sm text-muted-foreground mt-2">Date: {formatDate(proposalDetails.valid_until)}</p>
//             {proposalDetails.location && (
//               <p className="text-sm text-muted-foreground">Location: {proposalDetails.location}</p>
//             )}
//           </div>

//           {/* Project Description */}
//           {proposalDetails.description && (
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Project Description</h2>
//               <Card>
//                 <CardContent className="p-4">
//                   <p className="whitespace-pre-wrap">{proposalDetails.description}</p>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {/* Estimated Cost */}
//           {/* {proposalDetails. && (
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Estimated Cost</h2>
//               <Card>
//                 <CardContent className="p-4">
//                   <p className="text-lg font-semibold">{proposalDetails.}</p>
//                 </CardContent>
//               </Card>
//             </div>
//           )} */}

//           {/* Trades and Elements */}
//           {tradesAndElements.length > 0 && (
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Project Scope</h2>
              
//               {tradesAndElements.map((trade) => (
//                 <div key={trade.id} className="mb-6">
//                   <h3 className="text-lg font-medium mb-3">{trade.name}</h3>
                  
//                   {trade.elements.length > 0 ? (
//                     <div className="space-y-4">
//                       {trade.elements.map((element) => (
//                         <Card key={element.id}>
//                           <CardContent className="p-4">
//                             <h4 className="text-md font-medium mb-2">{element.name}</h4>
                            
//                             {/* Placeholder content based on element type */}
//                             <div className="p-2 border border-dashed rounded-md text-sm text-muted-foreground">
//                               {element.type === 'text' && <p>Text content would be displayed here.</p>}
//                               {element.type === 'table' && (
//                                 <table className="min-w-full border-collapse">
//                                   <thead>
//                                     <tr>
//                                       <th className="border p-2">Header 1</th>
//                                       <th className="border p-2">Header 2</th>
//                                       <th className="border p-2">Header 3</th>
//                                     </tr>
//                                   </thead>
//                                   <tbody>
//                                     <tr>
//                                       <td className="border p-2">Sample data</td>
//                                       <td className="border p-2">Sample data</td>
//                                       <td className="border p-2">Sample data</td>
//                                     </tr>
//                                     <tr>
//                                       <td className="border p-2">Sample data</td>
//                                       <td className="border p-2">Sample data</td>
//                                       <td className="border p-2">Sample data</td>
//                                     </tr>
//                                   </tbody>
//                                 </table>
//                               )}
//                               {element.type === 'list' && (
//                                 <ul className="list-disc pl-5">
//                                   <li>Sample list item 1</li>
//                                   <li>Sample list item 2</li>
//                                   <li>Sample list item 3</li>
//                                 </ul>
//                               )}
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-muted-foreground italic">No elements in this trade.</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Signature Section */}
//           <div className="mt-12 pt-8 border-t">
//             <div className="grid grid-cols-2 gap-8">
//               <div>
//                 <p className="font-medium mb-12">Client Signature:</p>
//                 <div className="border-b border-gray-400 w-full"></div>
//                 <p className="mt-2">Date: _________________</p>
//               </div>
//               <div>
//                 <p className="font-medium mb-12">Contractor Signature:</p>
//                 <div className="border-b border-gray-400 w-full"></div>
//                 <p className="mt-2">Date: _________________</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreviewTab;
