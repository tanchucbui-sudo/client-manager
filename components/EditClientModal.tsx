'use client';

import { useState } from 'react';
import type { Bu, Client } from '@/lib/db';

export default function EditClientModal({
  client,
  bus,
  onClose,
  onSaved,
  onDeleted,
}: {
  client: Client;
  bus: Bu[];
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [form, setForm] = useState({
    ma: client.ma ?? '',
    ten_khach_hang: client.ten_khach_hang ?? '',
    ten_day_du: client.ten_day_du ?? '',
    mst: client.mst ?? '',
    dia_chi: client.dia_chi ?? '',
    nguoi_dai_dien: client.nguoi_dai_dien ?? '',
    chuc_danh: client.chuc_danh ?? '',
    lien_he: client.lien_he ?? '',
    trang_thai: client.trang_thai ?? 'Active',
    bu_id: client.bu_id ? String(client.bu_id) : '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.ten_khach_hang.trim()) {
      setError('Vui lòng nhập tên khách hàng');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bu_id: form.bu_id ? Number(form.bu_id) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra');
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Xóa client "${client.ten_khach_hang}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra');
      }
      onDeleted();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sửa Client</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="px-6 py-4 space-y-3">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Mã</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.ma}
              onChange={(e) => set('ma', e.target.value)}
              placeholder="VD: ADMP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.ten_khach_hang}
              onChange={(e) => set('ten_khach_hang', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên đầy đủ theo GPKD</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.ten_day_du}
              onChange={(e) => set('ten_day_du', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">MST</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.mst}
                onChange={(e) => set('mst', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.trang_thai}
                onChange={(e) => set('trang_thai', e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Disable">Disable</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ đăng ký</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.dia_chi}
              onChange={(e) => set('dia_chi', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Người đại diện</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.nguoi_dai_dien}
                onChange={(e) => set('nguoi_dai_dien', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chức danh</label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.chuc_danh}
                onChange={(e) => set('chuc_danh', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thông tin liên hệ</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.lien_he}
              onChange={(e) => set('lien_he', e.target.value)}
              placeholder="Email / SĐT"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phân cho BU</label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={form.bu_id}
              onChange={(e) => set('bu_id', e.target.value)}
            >
              <option value="">— Chưa phân —</option>
              {bus.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <button
              type="button"
              onClick={remove}
              disabled={deleting}
              className="px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? 'Đang xóa...' : 'Xóa client'}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md border hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
