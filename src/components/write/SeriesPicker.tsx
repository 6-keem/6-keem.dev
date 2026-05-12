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
import SeriesDialog, { Series } from './SeriesDialog';

const NEW_VALUE = '__new__';
const NONE_VALUE = '__none__';

type Props = {
  seriesId: number | null;
  onChange: (id: number | null, name: string) => void;
};

export default function SeriesPicker({ seriesId, onChange }: Props) {
  const [list, setList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/series', { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const { data } = (await res.json()) as { data: Series[] };
      setList(data);
    } catch (e) {
      console.error(e);
      toast.error('시리즈 목록을 불러오지 못했어요');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const value =
    seriesId == null ? NONE_VALUE : list.some((s) => s.id === seriesId) ? String(seriesId) : NONE_VALUE;

  const handleChange = (v: string) => {
    if (v === NEW_VALUE) {
      setDialogOpen(true);
      return;
    }
    if (v === NONE_VALUE) {
      onChange(null, '');
      return;
    }
    const id = Number(v);
    const picked = list.find((s) => s.id === id);
    onChange(id, picked?.series_name ?? '');
  };

  const onCreated = (series: Series) => {
    setList((prev) => [...prev, series].sort((a, b) => a.series_name.localeCompare(b.series_name)));
    onChange(series.id, series.series_name);
  };

  return (
    <>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="h-auto w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm shadow-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40">
          <SelectValue placeholder={loading ? '불러오는 중...' : '시리즈를 선택하세요 (선택)'} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>시리즈 없음</SelectItem>
          {list.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.series_name}
            </SelectItem>
          ))}
          <SelectItem value={NEW_VALUE}>
            <span className="inline-flex items-center gap-2 text-primary">
              <Plus className="h-3.5 w-3.5" /> 새 시리즈 만들기
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <SeriesDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={onCreated} />
    </>
  );
}
