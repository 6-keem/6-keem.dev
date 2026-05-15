'use client';

import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, MouseEvent, forwardRef } from 'react';
import { useNavigateAndScrollTop } from '@/lib/smooth-navigate';

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: React.ReactNode;
  };

const ScrollTopLink = forwardRef<HTMLAnchorElement, Props>(function ScrollTopLink(
  { href, onClick, ...rest },
  ref,
) {
  const navigate = useNavigateAndScrollTop();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (typeof href !== 'string') return;
    e.preventDefault();
    navigate(href);
  };

  return <Link ref={ref} href={href} onClick={handleClick} {...rest} />;
});

export default ScrollTopLink;
