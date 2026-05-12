'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type Category = {
  id: number;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (category: Category) => void;
};

export default function CategoryDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const fieldBase =
    'w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none ' +
    'placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/25 focus:border-primary/40';
  const label = 'mb-2 text-xs font-semibold text-foreground/70';

  const reset = () => {
    setName('');
    setDescription('');
    setThumbnailUrl('');
    setUploading(false);
    setSaving(false);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const onFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있어요');
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/uploads/images', { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const { url } = (await res.json()) as { url: string };
      setThumbnailUrl(url);
      toast.success('썸네일 업로드 완료');
    } catch (e) {
      console.error(e);
      toast.error('썸네일 업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error('카테고리 이름을 입력해주세요');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          description: description.trim() || null,
          thumbnail_url: thumbnailUrl || null,
        }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const { data } = (await res.json()) as { data: Category };
      toast.success('카테고리 생성 완료');
      onCreated(data);
      handleOpenChange(false);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? '카테고리 생성 실패');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>새 카테고리 만들기</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <div className={label}>이름</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="카테고리 이름 (예: Frontend)"
            className={fieldBase}
            autoFocus
          />
        </div>

        <div className="mt-4">
          <div className={label}>설명 (선택)</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="카테고리 설명"
            className={fieldBase + ' resize-none'}
            rows={2}
          />
        </div>

        <div className="mt-4">
          <div className={label}>썸네일 (선택)</div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className="rounded-2xl border border-dashed border-border bg-background/70 p-4 cursor-pointer"
          >
            {thumbnailUrl ? (
              <div className="flex items-start gap-4">
                <img
                  src={thumbnailUrl}
                  alt="category thumbnail"
                  className="h-20 w-32 rounded-xl object-cover border border-border"
                />
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-foreground">썸네일 설정됨</div>
                  <div className="mt-1">클릭해서 변경</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {uploading ? '업로드 중...' : '클릭해서 이미지 업로드'}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground/70 hover:bg-accent"
            disabled={saving}
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving || uploading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '만들기'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
