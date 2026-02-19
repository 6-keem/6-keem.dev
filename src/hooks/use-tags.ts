'use client';

import { isImeComposing, splitTags } from '@/utils/tags';
import { useState } from 'react';

export function useTags(params: { tags: string[]; setTags: (tags: string[]) => void }) {
  const { tags, setTags } = params;
  const [tagInput, setTagInput] = useState('');

  const addTags = (raw: string) => {
    const newTags = splitTags(raw);
    if (!newTags.length) return;

    const set = new Set(tags);
    newTags.forEach((t) => set.add(t));
    setTags(Array.from(set));
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isImeComposing(e)) return;

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTags(tagInput);
      setTagInput('');
      return;
    }

    if (e.key === 'Backspace' && tagInput.length === 0 && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return { tagInput, setTagInput, addTags, removeTag, onTagKeyDown };
}
