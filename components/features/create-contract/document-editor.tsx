"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save,
  ChevronDown,
  Grid,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Input,
  Separator,
  Switch,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shared";
import { TooltipProvider } from "@/providers/tooltip-provider";
import { cn } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";

// Page size definitions in pixels (based on 96 DPI)
const PAGE_SIZES = {
  Letter: { width: 816, height: 1056 }, // 8.5" x 11"
  Legal: { width: 816, height: 1344 }, // 8.5" x 14"
  A4: { width: 794, height: 1123 }, // 210mm x 297mm
};

type PageSize = keyof typeof PAGE_SIZES;

export default function DocumentEditor() {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pageSize, setPageSize] = useState<PageSize>("Letter");
  const [pages, setPages] = useState([{ id: 1, content: "" }]);
  const [currentPage, setCurrentPage] = useState(1);

  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
//   const { toast } = useToast();

  // Font sizes for dropdown
  const fontSizes = [
    8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
  ];
  const [fontSize, setFontSize] = useState(11);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      handleSave();
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, []);

  // Handle formatting commands
  const formatText = (command: string, value = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handle save functionality
  const handleSave = () => {
    setIsSaving(true);

    // Simulate saving to server
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());

    //   toast({
    //     title: "Document saved",
    //     description: "All changes have been saved to the cloud",
    //     duration: 3000,
    //   });
    }, 800);
  };

  // Handle font size change
  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    formatText("fontSize", (size / 16).toString());
  };

  // Handle zoom level change
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  // Handle page size change
  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size);
  };

  // Add a new page
  const addNewPage = () => {
    setPages((prev) => [...prev, { id: prev.length + 1, content: "" }]);
    setCurrentPage((prev) => prev + 1);
  };

  // Calculate current page dimensions based on zoom
  const getPageStyle = () => {
    const dimensions = PAGE_SIZES[pageSize];
    return {
      width: `${dimensions.width * (zoomLevel / 100)}px`,
      minHeight: `${dimensions.height * (zoomLevel / 100)}px`,
    };
  };

  // Handle content change and check if we need to add a new page
  const handleContentChange = () => {
    if (editorRef.current) {
      // In a real implementation, we would check content height vs page height
      // and automatically create new pages when content overflows
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Document header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 max-w-[300px]"
          />
          <div className="text-sm text-muted-foreground">
            {isSaving
              ? "Saving..."
              : lastSaved
              ? `Last saved ${lastSaved.toLocaleTimeString()}`
              : "All changes saved"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="grid-mode"
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
            <Label htmlFor="grid-mode" className="flex items-center gap-1">
              <Grid className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Grid
              </span>
            </Label>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {pageSize}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Page Size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={pageSize}
                onValueChange={(value) =>
                  handlePageSizeChange(value as PageSize)
                }
              >
                <DropdownMenuRadioItem value="Letter">
                  Letter (8.5" x 11")
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Legal">
                  Legal (8.5" x 14")
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="A4">
                  A4 (210mm x 297mm)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border rounded-md mb-4 flex-wrap">
        <TooltipProvider>
          {/* Font size dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
                    {fontSize}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Font size</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              {fontSizes.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={cn(fontSize === size && "bg-muted")}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-8" />

          {/* Text formatting */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText("bold")}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText("italic")}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText("underline")}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-8" />

          {/* Text alignment */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText("justifyLeft")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText("justifyCenter")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText("justifyRight")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align right</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => formatText("justifyFull")}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Justify</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Document canvas container */}
      <div
        className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center"
        ref={containerRef}
      >
        <div className="flex flex-col items-center gap-8">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className={cn(
                "bg-white rounded-sm shadow-md flex-shrink-0 relative rounded-sm",
                currentPage === page.id && ""
              )}
              style={getPageStyle()}
              onClick={() => setCurrentPage(page.id)}
            >
              {/* Page content */}
              <div
                className={cn("absolute inset-0 p-16", showGrid && "bg-grid")}
                style={{ boxSizing: "border-box" }}
              >
                {currentPage === page.id && (
                  <div
                    ref={editorRef}
                    contentEditable
                    className="outline-none h-full w-full whitespace-pre-wrap word-break break-word"
                    suppressContentEditableWarning
                    onInput={handleContentChange}
                    style={{
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                    }}
                  />
                )}
              </div>

              {/* Page number indicator */}
              <div className="absolute bottom-2 w-full text-center text-xs text-gray-400">
                Page {page.id}
              </div>
            </div>
          ))}

          {/* Add new page button */}
          <Button variant="outline" className="mb-4" onClick={addNewPage}>
            Add New Page
          </Button>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="fixed bottom-4 right-4 bg-white rounded-md shadow-md p-2 flex items-center gap-2 border">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium w-12 text-center">
          {zoomLevel}%
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleZoomReset}
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
