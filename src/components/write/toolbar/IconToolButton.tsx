'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type IconToolButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
};

export function ToolbarTooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider delayDuration={150}>{children}</TooltipProvider>;
}

export default function IconToolButton({ icon: Icon, label, onClick, className }: IconToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={cn(
            'h-9 w-9 rounded-lg border border-border bg-background/60 text-foreground/80 hover:bg-accent hover:text-accent-foreground',
            className
          )}
          aria-label={label}
        >
          <Icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
