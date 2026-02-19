import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      callout: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string;
        title?: string;
        className?: string;
      };

      highlight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        color?: string;
        className?: string;
      };

      quotation: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        className?: string;
      };
    }
  }
}

export {};
