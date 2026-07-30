'use client';

import type { Bu, Client } from '@/lib/db';

export default function ClientTable({
  clients,
  bus,
  onChanged,
}: {
  clients: Client[];
  bus: Bu[];
  onChanged: () => void;
}) {
  async function assignBu(clientId: number, buId: string) {
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bu_id: buId ? Number(buId) : null }),
    });
    onChanged();
  }

  async function removeClient(clientId: number) {
    if (!confirm('Xóa client này?')) return;
    await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
    onChanged();
  }

  return (
    <div className="overflow-x-auto border rounded-xl bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Mã</th>
            <th className="text-left px-4 py-2 font-medium">Tên khách hàng</th>
            <th className="text-left px-4 py-2 font-medium">Trạng thái</th>
            <th className="text-left px-4 py-2 font-medium">BU</th>
            <th className="text-left px-4 py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {clients.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-2 font-mono text-xs text-slate-500">{c.ma}</td>
              <td className="px-4 py-2">{c.ten_khach_hang}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                    c.trang_thai === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.trang_thai}
                </span>
              </td>
              <td className="px-4 py-2">
                <select
                  className="border rounded-md px-2 py-1 text-xs"
                  value={c.bu_id ?? ''}
                  onChange={(e) => assignBu(c.id, e.target.value)}
                >
                  <option value="">— Chưa phân —</option>
                  {bus.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => removeClient(c.id)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                Không có client nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
