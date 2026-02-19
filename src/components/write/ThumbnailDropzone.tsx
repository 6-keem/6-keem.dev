'use client';

type Props = {
  labelClassName?: string;
  thumbnailFile: File | null;
  thumbnailPreview: string;
  isDragOver: boolean;
  setIsDragOver: (v: boolean) => void;
  onPickThumbnail: () => void;
  onDrop: React.DragEventHandler<HTMLDivElement>;
  onFiles: (files: FileList | null) => void;
  clearThumbnail: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export default function ThumbnailDropzone({
  labelClassName = 'mb-2 text-xs font-semibold text-foreground/70',
  thumbnailFile,
  thumbnailPreview,
  isDragOver,
  setIsDragOver,
  onPickThumbnail,
  onDrop,
  onFiles,
  clearThumbnail,
  fileInputRef,
}: Props) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className={labelClassName}>썸네일</div>

        {thumbnailPreview ? (
          <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={clearThumbnail}>
            제거
          </button>
        ) : null}
      </div>

      <div
        className={[
          'mt-2 rounded-2xl border border-dashed p-4 cursor-pointer select-none transition-colors',
          isDragOver ? 'border-primary bg-primary/10' : 'border-border bg-background/70',
        ].join(' ')}
        onClick={onPickThumbnail}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={onDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />

        {thumbnailPreview ? (
          <div className="flex items-start gap-4">
            <img src={thumbnailPreview} alt="thumbnail preview" className="h-24 w-40 rounded-xl object-cover border border-border" />
            <div className="text-sm text-muted-foreground">
              <div className="font-semibold text-foreground">썸네일 설정됨</div>
              <div className="mt-1">클릭해서 변경하거나, 드래그&드롭으로 교체</div>
              {thumbnailFile ? <div className="mt-2 text-xs">{thumbnailFile.name}</div> : null}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">클릭 또는 드래그&드롭으로 업로드</div>
            <div className="mt-1">썸네일은 파일 업로드만 지원</div>
          </div>
        )}
      </div>
    </div>
  );
}
