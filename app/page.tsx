'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Bu, Client } from '@/lib/db';
import ClientTable from '@/components/ClientTable';
import AddClientModal from '@/components/AddClientModal';
import BuManager from '@/components/BuManager';

export default function Page() {
  const [clients, setClients] = useState<Client[]>([]);
  const [bus, setBus] = useState<Bu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showBu, setShowBu] = useState(false);
  const [search, setSearch] = useState('');
  const [buFilter, setBuFilter] = useState('');

  async function load() {
    setLoading(true);
    const [cRes, bRes] = await Promise.all([fetch('/api/clients'), fetch('/api/bus')]);
    const cData = await cRes.json();
    const bData = await bRes.json();
    setClients(cData.clients || []);
    setBus(bData.bus || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        !search ||
        c.ten_khach_hang?.toLowerCase().includes(search.toLowerCase()) ||
        c.ma?.toLowerCase().includes(search.toLowerCase());
      const matchesBu =
        !buFilter || (buFilter === 'none' ? !c.bu_id : String(c.bu_id) === buFilter);
      return matchesSearch && matchesBu;
    });
  }, [clients, search, buFilter]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý Client</h1>
          <p className="text-sm text-slate-500">
            {clients.length} client · {bus.length} BU
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBu(true)}
            className="px-3 py-2 text-sm rounded-md border hover:bg-slate-50"
          >
            Quản lý BU
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-700"
          >
            + Thêm Client
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="border rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
          placeholder="Tìm theo tên hoặc mã..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={buFilter}
          onChange={(e) => setBuFilter(e.target.value)}
        >
          <option value="">Tất cả BU</option>
          <option value="none">Chưa phân BU</option>
          {bus.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm py-12 text-center">Đang tải...</div>
      ) : (
        <ClientTable clients={filtered} bus={bus} onChanged={load} />
      )}

      {showAdd && (
        <AddClientModal
          bus={bus}
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}
      {showBu && (
        <BuManager bus={bus} onClose={() => setShowBu(false)} onChanged={load} />
      )}
    </main>
  );
}
