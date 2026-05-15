'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TagInput from './TagInput';
import ThumbnailDropzone from './ThumbnailDropzone';
import StickyActionBar from './StickyActionBar';
import TrackPicker from './TrackPicker';
import CategoryPicker from './CategoryPicker';
import { PostMeta } from './types';
import EditorToolbar from './toolbar/EditorToolbar';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type Props = {
  meta: PostMeta;
  setMeta: React.Dispatch<React.SetStateAction<PostMeta>>;
  content: string;
  setContent: (v: string) => void;

  tagInput: string;
  setTagInput: (v: string) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;

  fileInputRef: React.RefObject<HTMLInputElement>;
  thumbnailFile: File | null;
  thumbnailPreview: string;
  isDragOver: boolean;
  setIsDragOver: (v: boolean) => void;
  onPickThumbnail: () => void;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onFiles: (files: FileList | null) => void;
  clearThumbnail: () => void;

  onPublish: () => void;
  onExit?: () => void;
  onTempSave?: () => void;

  onInsertImage?: (file: File) => Promise<void>;
};

export default function EditorPane({
  meta,
  setMeta,
  content,
  setContent,
  tagInput,
  setTagInput,
  onTagKeyDown,
  removeTag,
  fileInputRef,
  thumbnailFile,
  thumbnailPreview,
  isDragOver,
  setIsDragOver,
  onPickThumbnail,
  onDrop,
  onFiles,
  clearThumbnail,
  onPublish,
  onExit,
  onTempSave,
  onInsertImage,
}: Props) {
  const fieldBase =
    'w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground outline-none ' +
    'placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/25 focus:border-primary/40';
  const label = 'mb-2 text-xs font-semibold text-foreground/70';

  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [metaOpen, setMetaOpen] = useState(true);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;

    // 스크롤 컨테이너 탐색 (overflow-y-auto인 부모)
    const scroller = el.closest('.overflow-y-auto') as HTMLElement | null;
    const savedScrollTop = scroller?.scrollTop ?? 0;

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    // 높이 재계산 후 스크롤 위치 복원
    if (scroller) {
      scroller.scrollTop = savedScrollTop;
    }
  };

  useLayoutEffect(() => {
    autoResize(descRef.current);
  }, [meta.desc]);

  useLayoutEffect(() => {
    autoResize(contentRef.current);
  }, [content]);

  return (
    <section className="h-full min-h-0 bg-card border-r border-border flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="px-8 pt-8 pb-10">
          <div className="flex items-start gap-3">
            <input
              value={meta.title}
              onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
              placeholder="제목을 입력하세요"
              className="flex-1 min-w-0 border-0 bg-transparent p-0 text-[2.6rem] font-extrabold leading-tight tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setMetaOpen((v) => !v)}
              aria-expanded={metaOpen}
              aria-label={metaOpen ? '메타 정보 접기' : '메타 정보 펼치기'}
              className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/70 transition hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronDown className={cn('h-5 w-5 transition-transform', metaOpen ? '' : '-rotate-90')} />
            </button>
          </div>

          <div className="mt-6 h-[6px] w-16 rounded bg-foreground/80" />

          <div
            className={cn(
              'grid transition-all duration-200 ease-out',
              metaOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            )}
          >
            <div className="overflow-hidden">
              <TagInput tags={meta.tags} tagInput={tagInput} setTagInput={setTagInput} onTagKeyDown={onTagKeyDown} removeTag={removeTag} />

              <div className="mt-8">
                <div className={label}>설명</div>
                <textarea
                  ref={descRef}
                  value={meta.desc}
                  onChange={(e) => {
                    setMeta((m) => ({ ...m, desc: e.target.value }));
                    autoResize(e.currentTarget);
                  }}
                  placeholder="포스트를 한 줄로 소개해보세요."
                  className={fieldBase + ' resize-none overflow-hidden scrollbar-hide'}
                  rows={1}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className={label}>카테고리</div>
                  <CategoryPicker
                    category={meta.category}
                    onChange={(name) => setMeta((m) => ({ ...m, category: name }))}
                  />
                </div>

                <div>
                  <div className={label}>트랙</div>
                  <TrackPicker
                    trackId={meta.trackId}
                    onChange={(id, name) => setMeta((m) => ({ ...m, trackId: id, trackName: name }))}
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-background/70 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">홈 Hero에 노출</div>
                  <div className="text-xs text-muted-foreground mt-1">메인 페이지 상단 슬라이더에 이 글을 포함합니다.</div>
                </div>
                <Switch
                  checked={meta.isHero}
                  onCheckedChange={(v) => setMeta((m) => ({ ...m, isHero: v }))}
                />
              </div>

              <ThumbnailDropzone
                labelClassName={label}
                thumbnailFile={thumbnailFile}
                thumbnailPreview={thumbnailPreview}
                isDragOver={isDragOver}
                setIsDragOver={setIsDragOver}
                onPickThumbnail={onPickThumbnail}
                onDrop={onDrop}
                onFiles={onFiles}
                clearThumbnail={clearThumbnail}
                fileInputRef={fileInputRef}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="sticky top-0 z-30 -mx-8 px-8 py-2.5 bg-card/85 backdrop-blur">
              <EditorToolbar content={content} setContent={setContent} />
            </div>

            <textarea
              ref={contentRef}
              id="post-content-textarea"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                autoResize(e.currentTarget);
              }}
              className="mt-6 min-h-[70vh] w-full resize-none border-0 bg-transparent p-0 font-pretendard text-[1.05rem] leading-8 text-foreground outline-none placeholder:text-muted-foreground overflow-hidden scrollbar-hide"
              spellCheck={false}
              placeholder="당신의 이야기를 적어보세요..."
              onDrop={async (e) => {
                const f = e.dataTransfer.files?.[0];
                if (f && f.type.startsWith('image/')) {
                  e.preventDefault();
                  await onInsertImage?.(f);
                }
              }}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes('Files')) e.preventDefault();
              }}
              onPaste={async (e) => {
                const items = e.clipboardData?.items;
                if (!items) return;
                for (const it of items) {
                  if (it.type.startsWith('image/')) {
                    const f = it.getAsFile();
                    if (f) {
                      e.preventDefault();
                      await onInsertImage?.(f);
                    }
                    break;
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card/85 backdrop-blur">
        <StickyActionBar onExit={onExit} onTempSave={onTempSave} onPublish={onPublish} />
      </div>
    </section>
  );
}
