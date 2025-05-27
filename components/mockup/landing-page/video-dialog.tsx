"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/shared";

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export default function VideoDialog({ isOpen, onClose, videoId }: VideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="w-full aspect-video">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
