-- Client Manager schema for Neon Postgres

CREATE TABLE IF NOT EXISTS bus (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  ma TEXT UNIQUE,
  ten_khach_hang TEXT NOT NULL,
  ten_day_du TEXT,
  mst TEXT,
  dia_chi TEXT,
  nguoi_dai_dien TEXT,
  chuc_danh TEXT,
  lien_he TEXT,
  trang_thai TEXT NOT NULL DEFAULT 'Active',
  bu_id INTEGER REFERENCES bus(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_bu_id ON clients(bu_id);
