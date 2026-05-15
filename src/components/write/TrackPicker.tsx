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
import TrackDialog, { Track } from './TrackDialog';

const NEW_VALUE = '__new__';
const NONE_VALUE = '__none__';

type Props = {
  trackId: number | null;
  onChange: (id: number | null, name: string) => void;
};

export default function TrackPicker({ trackId, onChange }: Props) {
  const [list, setList] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/track', { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const { data } = (await res.json()) as { data: Track[] };
      setList(data);
    } catch (e) {
      console.error(e);
      toast.error('트랙 목록을 불러오지 못했어요');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const value =
    trackId == null ? NONE_VALUE : list.some((s) => s.id === trackId) ? String(trackId) : NONE_VALUE;

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
    onChange(id, picked?.track_name ?? '');
  };

  const onCreated = (track: Track) => {
    setList((prev) => [...prev, track].sort((a, b) => a.track_name.localeCompare(b.track_name)));
    onChange(track.id, track.track_name);
  };

  return (
    <>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="h-auto w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-sm shadow-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40">
          <SelectValue placeholder={loading ? '불러오는 중...' : '트랙을 선택하세요 (선택)'} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_VALUE}>트랙 없음</SelectItem>
          {list.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.track_name}
            </SelectItem>
          ))}
          <SelectItem value={NEW_VALUE}>
            <span className="inline-flex items-center gap-2 text-primary">
              <Plus className="h-3.5 w-3.5" /> 새 트랙 만들기
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <TrackDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreated={onCreated} />
    </>
  );
}
