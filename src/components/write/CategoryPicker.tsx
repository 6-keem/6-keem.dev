'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CategoryDialog, { Category } from './CategoryDialog';

const NEW_VALUE = '__new__';

type Props = {
  category: string;
  onChange: (name: string) => void;
};

export default function CategoryPicker({ category, onChange }: Props) {
  const [list, setList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const { data } = (await res.json()) as { data: Category[] };
      setList(data);
    } catch (e) {
      console.error(e);
      toast.error('카테고리 목록을 불러오지 못했어요');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Tolerate categories that exist on the post but not yet (or no longer) in the catalog.
  const value = category && list.some((c) => c.name === category) ? category : category || '';

  const handleChange = (v: string) => {
    if (v === NEW_VALUE) {
      setDialogOpen(true);
      return;
    }
    onChange(v);
  };

  const onCreated = (cat: Category) => {
    setList((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
    onChange(cat.name);
  };

  return (
    <>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="h-auto w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm shadow-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40">
          <SelectValue placeholder={loading ? '불러오는 중...' : '카테고리를 선택하세요'} />
        </SelectTrigger>
        <SelectContent>
          {list.map((c) => (
            <SelectItem key={c.id} value={c.name}>
              {c.name}
            </SelectItem>
          ))}
          <SelectItem value={NEW_VALUE}>
            <span className="inline-flex items-center gap-2 text-primary">
              <Plus className="h-3.5 w-3.5" /> 새 카테고리 만들기
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={onCreated} />
    </>
  );
}
