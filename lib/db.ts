import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Set it in your environment or .env.local');
}

export const sql = neon(process.env.DATABASE_URL || '');

export type Client = {
  id: number;
  ma: string | null;
  ten_khach_hang: string;
  ten_day_du: string | null;
  mst: string | null;
  dia_chi: string | null;
  nguoi_dai_dien: string | null;
  chuc_danh: string | null;
  lien_he: string | null;
  trang_thai: string;
  bu_id: number | null;
  bu_name?: string | null;
  created_at: string;
  updated_at: string;
};

export type Bu = {
  id: number;
  name: string;
  created_at: string;
  client_count?: number;
};
