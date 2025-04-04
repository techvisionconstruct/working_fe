"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ChevronDown,
  Share2,
  Image,
  Table,
  BarChart,
  PenTool,
  FormInput,
  X,
} from "lucide-react"
import { Button, Input, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shared"

export default function GoogleDocsClone() {
  const [documentTitle, setDocumentTitle] = useState("Untitled document")
  const [isTitleFocused, setIsTitleFocused] = useState(false)
  const [showComponentPanel, setShowComponentPanel] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dropIndicator, setDropIndicator] = useState({ show: false, x: 0, y: 0 })
  const [selectedComponent, setSelectedComponent] = useState<HTMLElement | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Handle formatting commands
  const formatText = (command: string, value = "") => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            formatText("bold")
            break
          case "i":
            e.preventDefault()
            formatText("italic")
            break
          case "u":
            e.preventDefault()
            formatText("underline")
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData("componentType", componentType)
    setIsDragging(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (isDragging) {
      setDropIndicator({
        show: true,
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDropIndicator({ show: false, x: 0, y: 0 })
  }

  // Component selection handler
  const handleComponentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const component = target.closest("[data-component]") as HTMLElement

    // Deselect previous component
    if (selectedComponent) {
      selectedComponent.classList.remove("component-selected")
    }

    // Select new component if clicked on one
    if (component) {
      e.stopPropagation()
      setSelectedComponent(component)
      component.classList.add("component-selected")
    } else {
      setSelectedComponent(null)
    }
  }

  // Delete selected component
  const deleteSelectedComponent = () => {
    if (selectedComponent && selectedComponent.parentNode) {
      selectedComponent.parentNode.removeChild(selectedComponent)
      setSelectedComponent(null)
    }
  }

  // Setup click listener for component selection
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.addEventListener("click", handleComponentClick)
    }

    // Click outside to deselect
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-component]") && selectedComponent) {
        selectedComponent.classList.remove("component-selected")
        setSelectedComponent(null)
      }
    }

    document.addEventListener("click", handleOutsideClick)

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("click", handleComponentClick)
      }
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [selectedComponent])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData("componentType")

    // Get cursor position in the editor
    if (editorRef.current) {
      // Create and insert the appropriate element based on component type
      let element: HTMLElement | null = null

      switch (componentType) {
        case "image":
          element = document.createElement("div")
          element.setAttribute("data-component", "image")
          element.className =
            "my-4 border-2 border-dashed border-gray-300 rounded p-8 text-center text-gray-500 bg-gray-50 relative component-wrapper"
          element.innerHTML = `
            <div class="component-controls absolute top-0 right-0 bg-white border border-gray-200 rounded-bl shadow-sm hidden">
              <button class="p-1 hover:bg-gray-100 component-move cursor-move" title="Move">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3"></path><path d="M9 5l3-3 3 3"></path><path d="M15 19l3 3 3-3"></path><path d="M19 9l3 3-3 3"></path><path d="M2 12h20"></path><path d="M12 2v20"></path></svg>
              </button>
              <button class="p-1 hover:bg-gray-100 component-resize cursor-se-resize" title="Resize">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6h-6"></path><path d="M3 3v18h18"></path></svg>
              </button>
              <button class="p-1 hover:bg-red-100 text-red-600 component-delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p>Drag and drop an image or click to upload</p>
          `
          break
        case "table":
          element = document.createElement("div")
          element.setAttribute("data-component", "table")
          element.className = "my-4 relative component-wrapper"
          element.innerHTML = `
            <div class="component-controls absolute top-0 right-0 bg-white border border-gray-200 rounded-bl shadow-sm hidden">
              <button class="p-1 hover:bg-gray-100 component-move cursor-move" title="Move">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3"></path><path d="M9 5l3-3 3 3"></path><path d="M15 19l3 3 3-3"></path><path d="M19 9l3 3-3 3"></path><path d="M2 12h20"></path><path d="M12 2v20"></path></svg>
              </button>
              <button class="p-1 hover:bg-red-100 text-red-600 component-delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
            <table class="border-collapse w-full">
              <thead>
                <tr>
                  <th class="border border-gray-300 px-4 py-2">Header 1</th>
                  <th class="border border-gray-300 px-4 py-2">Header 2</th>
                  <th class="border border-gray-300 px-4 py-2">Header 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-2" contenteditable="true">Cell 1</td>
                  <td class="border border-gray-300 px-4 py-2" contenteditable="true">Cell 2</td>
                  <td class="border border-gray-300 px-4 py-2" contenteditable="true">Cell 3</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2" contenteditable="true">Cell 4</td>
                  <td class="border border-gray-300 px-4 py-2" contenteditable="true">Cell 5</td>
                  <td class="border border-gray-300 px-4 py-2" contenteditable="true">Cell 6</td>
                </tr>
              </tbody>
            </table>
          `
          break
        case "chart":
          element = document.createElement("div")
          element.setAttribute("data-component", "chart")
          element.className =
            "my-4 border-2 border-gray-300 rounded p-4 bg-gray-50 text-center relative component-wrapper"
          element.innerHTML = `
            <div class="component-controls absolute top-0 right-0 bg-white border border-gray-200 rounded-bl shadow-sm hidden">
              <button class="p-1 hover:bg-gray-100 component-move cursor-move" title="Move">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3"></path><path d="M9 5l3-3 3 3"></path><path d="M15 19l3 3 3-3"></path><path d="M19 9l3 3-3 3"></path><path d="M2 12h20"></path><path d="M12 2v20"></path></svg>
              </button>
              <button class="p-1 hover:bg-gray-100 component-resize cursor-se-resize" title="Resize">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6h-6"></path><path d="M3 3v18h18"></path></svg>
              </button>
              <button class="p-1 hover:bg-red-100 text-red-600 component-delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
            <div class="text-gray-500" contenteditable="true">Chart Title</div>
            <div class="h-40 flex items-end justify-around px-4 pt-4">
              <div class="w-8 bg-blue-400 h-1/4"></div>
              <div class="w-8 bg-blue-400 h-2/4"></div>
              <div class="w-8 bg-blue-400 h-3/4"></div>
              <div class="w-8 bg-blue-400 h-1/2"></div>
              <div class="w-8 bg-blue-400 h-3/4"></div>
            </div>
          `
          break
        case "drawing":
          element = document.createElement("div")
          element.setAttribute("data-component", "drawing")
          element.className =
            "my-4 border-2 border-gray-300 rounded p-4 h-40 bg-gray-50 flex items-center justify-center relative component-wrapper"
          element.innerHTML = `
            <div class="component-controls absolute top-0 right-0 bg-white border border-gray-200 rounded-bl shadow-sm hidden">
              <button class="p-1 hover:bg-gray-100 component-move cursor-move" title="Move">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3"></path><path d="M9 5l3-3 3 3"></path><path d="M15 19l3 3 3-3"></path><path d="M19 9l3 3-3 3"></path><path d="M2 12h20"></path><path d="M12 2v20"></path></svg>
              </button>
              <button class="p-1 hover:bg-gray-100 component-resize cursor-se-resize" title="Resize">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6h-6"></path><path d="M3 3v18h18"></path></svg>
              </button>
              <button class="p-1 hover:bg-red-100 text-red-600 component-delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
            <div class="text-gray-500">Drawing Canvas (Click to Edit)</div>
          `
          break
        case "form":
          element = document.createElement("div")
          element.setAttribute("data-component", "form")
          element.className = "my-4 border-2 border-gray-300 rounded p-4 bg-gray-50 relative component-wrapper"
          element.innerHTML = `
            <div class="component-controls absolute top-0 right-0 bg-white border border-gray-200 rounded-bl shadow-sm hidden">
              <button class="p-1 hover:bg-gray-100 component-move cursor-move" title="Move">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3"></path><path d="M9 5l3-3 3 3"></path><path d="M15 19l3 3 3-3"></path><path d="M19 9l3 3-3 3"></path><path d="M2 12h20"></path><path d="M12 2v20"></path></svg>
              </button>
              <button class="p-1 hover:bg-red-100 text-red-600 component-delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </div>
            <div class="space-y-2">
              <div class="text-gray-700 font-medium" contenteditable="true">Form Field</div>
              <input type="text" placeholder="Text input" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          `
          break
      }

      if (element) {
        // Add event listeners for component controls
        setTimeout(() => {
          const deleteButtons = element?.querySelectorAll(".component-delete")
          deleteButtons?.forEach((button) => {
            button.addEventListener("click", (e) => {
              e.stopPropagation()
              const component = (e.target as HTMLElement).closest("[data-component]")
              if (component && component.parentNode) {
                component.parentNode.removeChild(component)
                setSelectedComponent(null)
              }
            })
          })

          // Add resize functionality
          const resizeButtons = element?.querySelectorAll(".component-resize")
          resizeButtons?.forEach((button) => {
            button.addEventListener("mousedown", (e) => {
              e.stopPropagation()
              e.preventDefault()

              const component = (e.target as HTMLElement).closest("[data-component]") as HTMLElement
              if (!component) return

              const startWidth = component.clientWidth
              const startHeight = component.clientHeight
              const startX = (e as MouseEvent).clientX
              const startY = (e as MouseEvent).clientY

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX
                const deltaY = moveEvent.clientY - startY

                component.style.width = `${startWidth + deltaX}px`
                component.style.height = `${startHeight + deltaY}px`
              }

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
              }

              document.addEventListener("mousemove", handleMouseMove)
              document.addEventListener("mouseup", handleMouseUp)
            })
          })

          // Add drag functionality for components
          const moveButtons = element?.querySelectorAll(".component-move")
          moveButtons?.forEach((button) => {
            button.addEventListener("mousedown", (e) => {
              e.stopPropagation()
              e.preventDefault()

              const component = (e.target as HTMLElement).closest("[data-component]")
              if (!component || !editorRef.current) return

              const componentRect = component.getBoundingClientRect()
              const editorRect = editorRef.current.getBoundingClientRect()

              // Create a ghost element for dragging
              const ghost = component.cloneNode(true) as HTMLElement
              ghost.style.position = "absolute"
              ghost.style.width = `${componentRect.width}px`
              ghost.style.height = `${componentRect.height}px`
              ghost.style.opacity = "0.7"
              ghost.style.pointerEvents = "none"
              ghost.style.zIndex = "1000"
              document.body.appendChild(ghost)

              // Position the ghost at the mouse position
              const mouseEvent = e as MouseEvent
              const offsetX = mouseEvent.clientX - componentRect.left
              const offsetY = mouseEvent.clientY - componentRect.top

              const handleMouseMove = (moveEvent: MouseEvent) => {
                ghost.style.left = `${moveEvent.clientX - offsetX}px`
                ghost.style.top = `${moveEvent.clientY - offsetY}px`

                // Show drop indicator
                const editorY = moveEvent.clientY - editorRect.top
                setDropIndicator({
                  show: true,
                  x: 0,
                  y: editorY,
                })
              }

              const handleMouseUp = (upEvent: MouseEvent) => {
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)

                // Remove ghost element
                document.body.removeChild(ghost)

                // Hide drop indicator
                setDropIndicator({ show: false, x: 0, y: 0 })

                // Get the position in the editor
                const editorY = upEvent.clientY - editorRect.top

                // Find the element at that position
                const elementsAtPosition = document.elementsFromPoint(
                  editorRect.left + editorRect.width / 2,
                  upEvent.clientY,
                )

                // Find if we're dropping inside the editor
                const isInEditor = elementsAtPosition.some((el) => el === editorRef.current)

                if (isInEditor) {
                  // Move the component to the new position
                  const range = document.createRange()
                  const selection = window.getSelection()

                  // Find the closest text node or element to insert after
                  let insertAfterNode = null

                  // Simple algorithm to find where to insert based on Y position
                  const allNodes = Array.from(editorRef.current!.childNodes)
                  for (const node of allNodes) {
                    const nodeRect = (node as HTMLElement).getBoundingClientRect()
                    if (nodeRect.top + nodeRect.height / 2 > upEvent.clientY) {
                      break
                    }
                    insertAfterNode = node
                  }

                  // Remove from current position
                  component.parentNode?.removeChild(component)

                  // Insert at new position
                  if (insertAfterNode && insertAfterNode.parentNode) {
                    insertAfterNode.parentNode.insertBefore(component, insertAfterNode.nextSibling)
                  } else {
                    // Insert at beginning if no node found
                    editorRef.current!.insertBefore(component, editorRef.current!.firstChild)
                  }
                }
              }

              document.addEventListener("mousemove", handleMouseMove)
              document.addEventListener("mouseup", handleMouseUp)
            })
          })
        }, 0)

        // Get selection and insert at cursor position
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.insertNode(element)

          // Move cursor after the inserted element
          range.setStartAfter(element)
          range.setEndAfter(element)
          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          // If no selection, append to the end
          editorRef.current.appendChild(element)
        }

        // Focus back on editor
        editorRef.current.focus()
      }
    }

    setIsDragging(false)
    setDropIndicator({ show: false, x: 0, y: 0 })
  }

  // Component panel items
  const componentItems = [
    { type: "image", icon: <Image className="h-5 w-5" />, label: "Image" },
    { type: "table", icon: <Table className="h-5 w-5" />, label: "Table" },
    { type: "chart", icon: <BarChart className="h-5 w-5" />, label: "Chart" },
    { type: "drawing", icon: <PenTool className="h-5 w-5" />, label: "Drawing" },
    { type: "form", icon: <FormInput className="h-5 w-5" />, label: "Form" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mr-2">
          <span className="text-blue-600 font-bold">D</span>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center">
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
              className={`border-none text-lg font-medium h-8 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 ${isTitleFocused ? "bg-gray-100" : "bg-transparent"}`}
            />
          </div>
          <div className="flex text-sm space-x-4 text-gray-600">
            <button className="hover:bg-gray-100 px-1 rounded">File</button>
            <button className="hover:bg-gray-100 px-1 rounded">Edit</button>
            <button className="hover:bg-gray-100 px-1 rounded">View</button>
            <button
              className="hover:bg-gray-100 px-1 rounded"
              onClick={() => setShowComponentPanel(!showComponentPanel)}
            >
              Insert
            </button>
            <button className="hover:bg-gray-100 px-1 rounded">Format</button>
            <button className="hover:bg-gray-100 px-1 rounded">Tools</button>
            <button className="hover:bg-gray-100 px-1 rounded">Help</button>
          </div>
        </div>

        <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </header>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-1 flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-sm">
              Normal text
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => formatText("formatBlock", "p")}>Normal text</DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatText("formatBlock", "h1")}>Heading 1</DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatText("formatBlock", "h2")}>Heading 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => formatText("formatBlock", "h3")}>Heading 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <Separator orientation="vertical" className="h-6" /> */}

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("underline")}>
          <Underline className="h-4 w-4" />
        </Button>

        {/* <Separator orientation="vertical" className="h-6" /> */}

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("justifyLeft")}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("justifyCenter")}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("justifyRight")}>
          <AlignRight className="h-4 w-4" />
        </Button>

        {/* <Separator orientation="vertical" className="h-6" />Drawing.  */}

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Content Area with Component Panel */}
      <div className="flex-1 flex bg-gray-100 overflow-auto">
        {/* Component Panel */}
        {showComponentPanel && (
          <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Insert</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowComponentPanel(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {componentItems.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center gap-3 p-2 rounded cursor-grab hover:bg-gray-100 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded bg-gray-100">{item.icon}</div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Editor */}
        <div className="flex-1 flex justify-center p-8">
          <div
            className="w-full max-w-[850px] bg-white shadow-sm rounded-sm min-h-[1100px] p-12 relative"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              ref={editorRef}
              contentEditable
              className="outline-none min-h-[1000px] prose prose-sm max-w-none"
              suppressContentEditableWarning
            />

            {/* Drop indicator */}
            {dropIndicator.show && (
              <div
                className="absolute w-full h-0.5 bg-blue-500 pointer-events-none"
                style={{
                  top: `${dropIndicator.y}px`,
                  left: 0,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex justify-between">
        <div>Last edit was seconds ago</div>
        <div>100% zoom</div>
      </footer>

      {/* CSS for component selection and controls */}
      <style jsx global>{`
        .component-wrapper {
          position: relative;
        }
        
        .component-wrapper:hover .component-controls {
          display: flex;
        }
        
        .component-selected {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        .component-selected .component-controls {
          display: flex;
        }
        
        .component-controls {
          display: none;
          flex-direction: row;
        }
      `}</style>
    </div>
  )
}

