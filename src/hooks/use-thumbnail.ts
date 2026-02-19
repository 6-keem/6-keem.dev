'use client';

import { useEffect, useRef, useState } from 'react';

export function useThumbnail() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview('');
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const onPickThumbnail = () => fileInputRef.current?.click();

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    setThumbnailFile(file);
  };

  const clearThumbnail = () => setThumbnailFile(null);

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onFiles(e.dataTransfer.files);
  };

  return {
    fileInputRef,
    thumbnailFile,
    setThumbnailFile,
    thumbnailPreview,
    setThumbnailPreview,
    isDragOver,
    setIsDragOver,
    onPickThumbnail,
    onFiles,
    clearThumbnail,
    onDrop,
  };
}
