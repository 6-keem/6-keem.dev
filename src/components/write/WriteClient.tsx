'use client';

import { useTags } from '@/hooks/use-tags';
import { useThumbnail } from '@/hooks/use-thumbnail';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PostMeta } from './types';
import EditorPane from './EditorPane';
import PreviewPane from './PreviewPane';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface WriteClientProps {
  postId: string | null;
}

type UploadResponse = { url: string; path: string };

export default function WriteClient({ postId }: WriteClientProps) {
  const router = useRouter();

  const [meta, setMeta] = useState<PostMeta>({ title: '', tags: [], desc: '', seriesName: '', thumbnailUrl: '', category: '' });
  const [content, setContent] = useState<string>(``);

  const metaRef = useRef(meta);
  const contentRef = useRef(content);

  const thumb = useThumbnail();

  const tags = useTags({
    tags: meta.tags,
    setTags: (next) => setMeta((m) => ({ ...m, tags: next })),
  });

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/uploads/images', { method: 'POST', body: form });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as UploadResponse;
  };

  const onThumbnailFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있어요');
      return;
    }

    try {
      toast.message('썸네일 업로드 중...');
      const { url } = await uploadImage(file);

      setMeta((m) => ({ ...m, thumbnailUrl: url }));
      thumb.setThumbnailPreview?.(url);

      toast.success('썸네일 업로드 완료');
    } catch (e) {
      console.error(e);
      toast.error('썸네일 업로드 실패');
    }
  };

  const clearThumbnail = () => {
    setMeta((m) => ({ ...m, thumbnailUrl: '' }));
    thumb.clearThumbnail();
  };

  useEffect(() => {
    metaRef.current = meta;
  }, [meta]);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    if (!postId) return;

    (async () => {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: 'GET' });
      if (!res.ok) {
        toast.error('게시글을 불러오지 못했어요');
        return;
      }
      const data = await res.json();

      setMeta(data.meta);
      setContent(data.content);

      const thumbUrl = data.meta?.thumbnailUrl || data.thumbnailUrl || '';
      thumb.setThumbnailPreview?.(thumbUrl);
    })();
  }, [postId]);

  const insertAtCursor = (markdown: string) => {
    const el = document.querySelector<HTMLTextAreaElement>('#post-content-textarea');
    if (!el) {
      setContent((prev) => prev + '\n' + markdown + '\n');
      return;
    }

    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;

    const next = content.slice(0, start) + markdown + content.slice(end);
    setContent(next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + markdown.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const onInsertImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    try {
      toast.message('이미지 업로드 중...');
      const { url } = await uploadImage(file);

      const alt = file.name.replace(/\.[^/.]+$/, '');
      insertAtCursor(`\n![${alt}](${url})\n`);

      toast.success('이미지 삽입 완료');
    } catch (e) {
      console.error(e);
      toast.error('이미지 업로드 실패');
    }
  };

  const save = useCallback(
    async (published: boolean, payload?: { meta: PostMeta; content: string }) => {
      const m = payload?.meta ?? metaRef.current;
      const c = payload?.content ?? contentRef.current;

      if (!m.title.trim()) {
        toast.error('제목을 입력해주세요');
        return false;
      }

      if (published) {
        if (!m.thumbnailUrl) {
          toast.error('썸네일 이미지를 입력해주세요');
          return false;
        }
      }

      const form = new FormData();
      form.append('meta', JSON.stringify(m));
      form.append('content', c);
      form.append('published', String(published));

      const url = postId ? `/api/admin/posts/${postId}` : '/api/admin/posts';
      const method = postId ? 'PATCH' : 'POST';

      const res = await fetch(url, { method, body: form });
      if (!res.ok) {
        console.error(await res.text());
        toast.error(postId ? '게시글 저장(수정)이 실패했어요' : '게시글 저장이 실패했어요');
        return false;
      }

      toast.success(published ? (postId ? '수정 완료!' : '게시 완료!') : '임시저장 완료!');
      return true;
    },
    [postId]
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (metaRef.current.title.length === 0 || metaRef.current.thumbnailUrl?.length === 0) return;
      const ok = save(false, { meta: metaRef.current, content: contentRef.current });
      if (!ok) toast.error('자동 저장에 실패했습니다.');
    }, 1000 * 60);

    return () => clearInterval(id);
  }, [save]);

  const onPublish = async () => {
    const ok = await save(true);
    if (ok) router.push('/');
  };

  const onTempSave = async () => {
    const ok = await save(false);
    if (ok) router.push('/');
  };

  return (
    <main className="fixed inset-0 z-50 overflow-hidden bg-background">
      <div className="h-full w-full grid grid-cols-2 min-h-0">
        <EditorPane
          meta={meta}
          setMeta={setMeta}
          content={content}
          setContent={setContent}
          tagInput={tags.tagInput}
          setTagInput={tags.setTagInput}
          onTagKeyDown={tags.onTagKeyDown}
          removeTag={tags.removeTag}
          fileInputRef={thumb.fileInputRef}
          thumbnailFile={thumb.thumbnailFile}
          thumbnailPreview={thumb.thumbnailPreview}
          isDragOver={thumb.isDragOver}
          setIsDragOver={thumb.setIsDragOver}
          onPickThumbnail={thumb.onPickThumbnail}
          onDrop={(e) => {
            e.preventDefault();
            thumb.setIsDragOver(false);
            onThumbnailFiles(e.dataTransfer.files);
          }}
          onFiles={onThumbnailFiles}
          clearThumbnail={clearThumbnail}
          onPublish={onPublish}
          onExit={() => router.push('/')}
          onTempSave={onTempSave}
          onInsertImage={onInsertImage}
        />

        <PreviewPane meta={meta} content={content} thumbnailPreview={thumb.thumbnailPreview} />
      </div>
    </main>
  );
}
