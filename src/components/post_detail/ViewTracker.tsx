'use client';

import { useEffect } from 'react';

export default function ViewTracker({ postId }: { postId: number }) {
  useEffect(() => {
    fetch(`/api/post/${postId}/view`, { method: 'POST', keepalive: true }).catch(() => {});
  }, [postId]);
  return null;
}
