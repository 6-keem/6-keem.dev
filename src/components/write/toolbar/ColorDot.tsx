'use client';

import { cn } from '@/lib/utils';
import React from 'react';

type ColorDotProps = {
  className?: string;
  style?: React.CSSProperties;
};

export default function ColorDot({ className, style }: ColorDotProps) {
  return <span className={cn('inline-block h-2.5 w-2.5 rounded-full border border-border/60', className)} style={style} />;
}
