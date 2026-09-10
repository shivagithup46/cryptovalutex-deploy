-- V2__trading_engine_schema.sql
-- Phase 3 Schema Additions for Trading, Markets, and Portfolio

CREATE TABLE markets (
    id VARCHAR(36) PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE, -- e.g., BTC_USDT
    base_token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    quote_token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    base_min_size DECIMAL(38,18) NOT NULL,
    base_max_size DECIMAL(38,18) NOT NULL,
    quote_tick_size DECIMAL(19,8) NOT NULL,
    base_tick_size DECIMAL(19,8) NOT NULL,
    maker_fee_rate DECIMAL(19,8) NOT NULL,
    taker_fee_rate DECIMAL(19,8) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    market_id VARCHAR(36) NOT NULL REFERENCES markets(id),
    type VARCHAR(50) NOT NULL, -- MARKET, LIMIT, STOP_LIMIT
    side VARCHAR(50) NOT NULL, -- BUY, SELL
    price DECIMAL(19,8), -- Null for MARKET
    stop_price DECIMAL(19,8), -- Null unless STOP_LIMIT
    quantity DECIMAL(38,18) NOT NULL,
    filled_quantity DECIMAL(38,18) NOT NULL DEFAULT 0,
    remaining_quantity DECIMAL(38,18) NOT NULL,
    fee DECIMAL(38,18) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- PENDING, OPEN, PARTIALLY_FILLED, FILLED, CANCELLED
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE trades (
    id VARCHAR(36) PRIMARY KEY,
    market_id VARCHAR(36) NOT NULL REFERENCES markets(id),
    maker_order_id VARCHAR(36) NOT NULL REFERENCES orders(id),
    taker_order_id VARCHAR(36) NOT NULL REFERENCES orders(id),
    price DECIMAL(19,8) NOT NULL,
    quantity DECIMAL(38,18) NOT NULL,
    maker_fee DECIMAL(38,18) NOT NULL,
    taker_fee DECIMAL(38,18) NOT NULL,
    side VARCHAR(50) NOT NULL, -- Side of the taker (BUY/SELL)
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE portfolio (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id),
    total_balance_usdt DECIMAL(38,18) NOT NULL DEFAULT 0,
    total_profit_usdt DECIMAL(38,18) NOT NULL DEFAULT 0,
    today_profit_usdt DECIMAL(38,18) NOT NULL DEFAULT 0,
    roi_percentage DECIMAL(19,8) NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE watchlists (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    market_id VARCHAR(36) NOT NULL REFERENCES markets(id),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CONSTRAINT uq_watchlist_user_market UNIQUE (user_id, market_id)
);

CREATE TABLE price_alerts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    market_id VARCHAR(36) NOT NULL REFERENCES markets(id),
    target_price DECIMAL(19,8) NOT NULL,
    is_above BOOLEAN NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes for performance
CREATE INDEX idx_markets_symbol ON markets(symbol);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_market_status ON orders(market_id, status);
CREATE INDEX idx_trades_market_id ON trades(market_id);
CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
