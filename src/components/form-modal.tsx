import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  showFooter?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function FormModal({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  showFooter = true,
  size = "md",
}: FormModalProps) {
  const sizeClasses = {
    sm: "sm:max-w-[425px]",
    md: "sm:max-w-[525px]",
    lg: "sm:max-w-[725px]",
    xl: "sm:max-w-[925px]",
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses[size]} max-h-[95vh] flex flex-col overflow-hidden`}>
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div
          className="grid gap-4 py-4 overflow-y-auto flex-1 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {children}
        </div>
        {showFooter && (
          <DialogFooter className="shrink-0">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {cancelButtonText}
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {submitButtonText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
