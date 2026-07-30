import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const { name } = await req.json();
    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: 'Tên BU là bắt buộc' }, { status: 400 });
    }
    const rows = await sql`
      UPDATE bus SET name = ${name.trim()} WHERE id = ${id} RETURNING *
    `;
    return NextResponse.json({ bu: rows[0] });
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
    // Clients assigned to this BU fall back to unassigned (bu_id NULL) via FK ON DELETE SET NULL.
    await sql`DELETE FROM bus WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
