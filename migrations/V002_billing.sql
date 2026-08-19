BEGIN;

CREATE TABLE IF NOT EXISTS billing_accounts (
  id BIGSERIAL PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  email TEXT,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'none',
  entitlement_active BOOLEAN NOT NULL DEFAULT false,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS billing_accounts_status_idx
  ON billing_accounts (subscription_status, updated_at DESC);

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  stripe_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  processing_error TEXT
);

CREATE INDEX IF NOT EXISTS stripe_webhook_events_unprocessed_idx
  ON stripe_webhook_events (received_at)
  WHERE processed_at IS NULL;

COMMIT;
