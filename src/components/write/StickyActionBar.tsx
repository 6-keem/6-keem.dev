'use client';

type Props = {
  onExit?: () => void;
  onTempSave?: () => void;
  onPublish: () => void;
};

export default function StickyActionBar({ onExit, onTempSave, onPublish }: Props) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <button type="button" className="text-sm font-semibold text-foreground/80 hover:text-foreground" onClick={onExit}>
          나가기
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground"
            onClick={onTempSave}
          >
            임시저장
          </button>

          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            onClick={onPublish}
          >
            게시하기
          </button>
        </div>
      </div>
    </div>
  );
}
