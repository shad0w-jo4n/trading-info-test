-- Up Migration
CREATE TABLE IF NOT EXISTS "currency_rate"
(
    "from"  VARCHAR(255)             NOT NULL,
    "to"    VARCHAR(255)             NOT NULL,
    "price" DOUBLE PRECISION         NOT NULL,
    "date"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('currency_rate', 'date', if_not_exists := true);
SELECT add_retention_policy('currency_rate', INTERVAL '3 months', if_not_exists := true);

-- TODO: This doesn't support in transaction block. We need to think about it.
-- CREATE INDEX ON "currency_rate" ("from", "to", "date" DESC) WITH (timescaledb.transaction_per_chunk);

-- Down Migration
DROP TABLE "currency_rate";
