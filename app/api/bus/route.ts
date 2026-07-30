import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const rows = await sql`
      SELECT b.*, COUNT(c.id)::int AS client_count
      FROM bus b
      LEFT JOIN clients c ON c.bu_id = b.id
      GROUP BY b.id
      ORDER BY b.name ASC
    `;
    return NextResponse.json({ bus: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: 'Tên BU là bắt buộc' }, { status: 400 });
    }
    const rows = await sql`
      INSERT INTO bus (name) VALUES (${name.trim()})
      ON CONFLICT (name) DO NOTHING
      RETURNING *
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'BU đã tồn tại' }, { status: 409 });
    }
    return NextResponse.json({ bu: rows[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
