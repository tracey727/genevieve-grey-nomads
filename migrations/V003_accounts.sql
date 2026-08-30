BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS users_created_idx ON users (created_at DESC);

-- Nullable, additive: existing anonymous device_id flows for trips and
-- billing are untouched. Signing in only adds account portability across
-- devices on top of the existing per-device behaviour.
ALTER TABLE billing_accounts ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(id);
CREATE INDEX IF NOT EXISTS billing_accounts_user_idx ON billing_accounts (user_id) WHERE user_id IS NOT NULL;

ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(id);
CREATE INDEX IF NOT EXISTS trips_user_updated_idx ON trips (user_id, updated_at DESC) WHERE user_id IS NOT NULL;

COMMIT;
