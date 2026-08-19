BEGIN;

CREATE TABLE IF NOT EXISTS trips (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL UNIQUE,
  device_id TEXT NOT NULL,
  name TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT '',
  destination TEXT NOT NULL DEFAULT '',
  total_budget NUMERIC(12,2) NOT NULL DEFAULT 0,
  route_distance_km NUMERIC(10,1) NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'AUD',
  status TEXT NOT NULL DEFAULT 'planned',
  plan JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trips_device_updated_idx ON trips (device_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS trips_device_updated_id_idx ON trips (device_id, updated_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS trips_updated_idx ON trips (updated_at DESC);

CREATE TABLE IF NOT EXISTS budget_entries (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL UNIQUE,
  trip_id BIGINT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  note TEXT NOT NULL DEFAULT '',
  happened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  idempotency_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS budget_entries_idempotency_idx ON budget_entries (trip_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS budget_entries_trip_time_idx ON budget_entries (trip_id, happened_at DESC);

COMMIT;
