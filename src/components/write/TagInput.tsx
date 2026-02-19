'use client';

type Props = {
  tags: string[];
  tagInput: string;
  setTagInput: (v: string) => void;
  onTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;
};

export default function TagInput({ tags, tagInput, setTagInput, onTagKeyDown, removeTag }: Props) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      {tags.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => removeTag(t)}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm shadow-sm"
          title="클릭하면 삭제"
        >
          <span className="font-semibold text-primary">#{t}</span>
          <span className="opacity-50 group-hover:opacity-100">×</span>
        </button>
      ))}

      <div className="flex items-center gap-2">
        <span className="font-semibold text-primary">#</span>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={onTagKeyDown}
          placeholder={tags.length ? '' : '태그를 입력하고 Enter'}
          className="w-60 border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
