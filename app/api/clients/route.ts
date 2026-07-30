import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql`
      SELECT c.*, b.name AS bu_name
      FROM clients c
      LEFT JOIN bus b ON b.id = c.bu_id
      ORDER BY c.ten_khach_hang ASC
    `;
    return NextResponse.json({ clients: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ma,
      ten_khach_hang,
      ten_day_du,
      mst,
      dia_chi,
      nguoi_dai_dien,
      chuc_danh,
      lien_he,
      trang_thai,
      bu_id,
    } = body;

    if (!ten_khach_hang || !String(ten_khach_hang).trim()) {
      return NextResponse.json(
        { error: 'Tên khách hàng là bắt buộc' },
        { status: 400 }
      );
    }

    const rows = await sql`
      INSERT INTO clients (
        ma, ten_khach_hang, ten_day_du, mst, dia_chi,
        nguoi_dai_dien, chuc_danh, lien_he, trang_thai, bu_id
      ) VALUES (
        ${ma || null}, ${ten_khach_hang}, ${ten_day_du || null}, ${mst || null}, ${dia_chi || null},
        ${nguoi_dai_dien || null}, ${chuc_danh || null}, ${lien_he || null}, ${trang_thai || 'Active'}, ${bu_id || null}
      )
      RETURNING *
    `;

    return NextResponse.json({ client: rows[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
