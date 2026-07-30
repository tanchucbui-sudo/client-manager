import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const allowed = [
      'ma',
      'ten_khach_hang',
      'ten_day_du',
      'mst',
      'dia_chi',
      'nguoi_dai_dien',
      'chuc_danh',
      'lien_he',
      'trang_thai',
      'bu_id',
    ];

    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Không có gì để cập nhật' }, { status: 400 });
    }

    // Fetch current row, merge in the requested changes, then write all
    // fields back explicitly. Avoids building dynamic SQL text.
    const current = await sql`SELECT * FROM clients WHERE id = ${id}`;
    if (current.length === 0) {
      return NextResponse.json({ error: 'Không tìm thấy client' }, { status: 404 });
    }
    const merged = { ...current[0], ...updates };

    const rows = await sql`
      UPDATE clients SET
        ma = ${merged.ma},
        ten_khach_hang = ${merged.ten_khach_hang},
        ten_day_du = ${merged.ten_day_du},
        mst = ${merged.mst},
        dia_chi = ${merged.dia_chi},
        nguoi_dai_dien = ${merged.nguoi_dai_dien},
        chuc_danh = ${merged.chuc_danh},
        lien_he = ${merged.lien_he},
        trang_thai = ${merged.trang_thai},
        bu_id = ${merged.bu_id},
        updated_at = now()
      WHERE id = ${id} RETURNING *
    `;

    return NextResponse.json({ client: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await sql`DELETE FROM clients WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
