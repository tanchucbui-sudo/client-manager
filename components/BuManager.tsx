'use client';

import { useState } from 'react';
import type { Bu } from '@/lib/db';

export default function BuManager({
  bus,
  onClose,
  onChanged,
}: {
  bus: Bu[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function addBu(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/bus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra');
      }
      setName('');
      onChanged();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeBu(id: number) {
    if (!confirm('Xóa BU này? Client thuộc BU sẽ chuyển về trạng thái chưa phân.')) return;
    await fetch(`/api/bus/${id}`, { method: 'DELETE' });
    onChanged();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quản lý BU</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <form onSubmit={addBu} className="flex gap-2">
            <input
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              placeholder="Tên BU mới"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              Thêm
            </button>
          </form>
          {error && <div className="text-sm text-red-600">{error}</div>}

          <ul className="divide-y border rounded-md">
            {bus.length === 0 && (
              <li className="px-3 py-3 text-sm text-slate-500">Chưa có BU nào.</li>
            )}
            {bus.map((b) => (
              <li key={b.id} className="px-3 py-2 flex items-center justify-between text-sm">
                <span>
                  {b.name}{' '}
                  <span className="text-slate-400">({b.client_count ?? 0} client)</span>
                </span>
                <button
                  onClick={() => removeBu(b.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
