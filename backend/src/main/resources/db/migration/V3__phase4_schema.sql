-- V3__phase4_schema.sql
-- Phase 4 Schema Additions for P2P, Staking, Tax, Analytics and AML

-- P2P Marketplace
CREATE TABLE p2p_ads (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    fiat_currency VARCHAR(10) NOT NULL, -- e.g., INR, USD
    type VARCHAR(20) NOT NULL, -- BUY, SELL
    price DECIMAL(19,8) NOT NULL,
    total_quantity DECIMAL(38,18) NOT NULL,
    available_quantity DECIMAL(38,18) NOT NULL,
    min_order_limit DECIMAL(38,18) NOT NULL,
    max_order_limit DECIMAL(38,18) NOT NULL,
    payment_methods VARCHAR(255) NOT NULL, -- JSON array or comma separated e.g. "UPI,IMPS,BANK_TRANSFER"
    terms TEXT,
    status VARCHAR(50) NOT NULL, -- ACTIVE, INACTIVE, COMPLETED, CANCELLED
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE p2p_orders (
    id VARCHAR(36) PRIMARY KEY,
    ad_id VARCHAR(36) NOT NULL REFERENCES p2p_ads(id),
    buyer_id VARCHAR(36) NOT NULL REFERENCES users(id),
    seller_id VARCHAR(36) NOT NULL REFERENCES users(id),
    token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    fiat_amount DECIMAL(38,18) NOT NULL,
    crypto_amount DECIMAL(38,18) NOT NULL,
    price DECIMAL(19,8) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, PAID, RELEASED, CANCELLED, DISPUTED
    payment_proof_url VARCHAR(500),
    expires_at TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE escrow_transactions (
    id VARCHAR(36) PRIMARY KEY,
    p2p_order_id VARCHAR(36) NOT NULL UNIQUE REFERENCES p2p_orders(id),
    wallet_id VARCHAR(36) NOT NULL REFERENCES wallets(id),
    amount DECIMAL(38,18) NOT NULL,
    status VARCHAR(50) NOT NULL, -- LOCKED, RELEASED, REFUNDED
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Staking
CREATE TABLE staking_products (
    id VARCHAR(36) PRIMARY KEY,
    token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    duration_days INTEGER NOT NULL, -- 0 for flexible, 30, 60, 90, etc.
    apy DECIMAL(19,8) NOT NULL,
    min_stake_amount DECIMAL(38,18) NOT NULL,
    max_stake_amount DECIMAL(38,18) NOT NULL,
    total_staked DECIMAL(38,18) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE staking_positions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    product_id VARCHAR(36) NOT NULL REFERENCES staking_products(id),
    staked_amount DECIMAL(38,18) NOT NULL,
    accumulated_reward DECIMAL(38,18) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- ACTIVE, REDEEMED, EARLY_REDEMPTION
    auto_compound BOOLEAN NOT NULL DEFAULT FALSE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP, -- Null for flexible
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE reward_history (
    id VARCHAR(36) PRIMARY KEY,
    position_id VARCHAR(36) NOT NULL REFERENCES staking_positions(id),
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    amount DECIMAL(38,18) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Tax Management
CREATE TABLE tax_records (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    trade_id VARCHAR(36) REFERENCES trades(id), -- Nullable, could be P2P
    token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    transaction_type VARCHAR(50) NOT NULL, -- BUY, SELL
    quantity DECIMAL(38,18) NOT NULL,
    price_inr DECIMAL(38,18) NOT NULL,
    total_value_inr DECIMAL(38,18) NOT NULL,
    tds_amount_inr DECIMAL(38,18) NOT NULL DEFAULT 0,
    profit_loss_inr DECIMAL(38,18) NOT NULL DEFAULT 0,
    tax_amount_inr DECIMAL(38,18) NOT NULL DEFAULT 0, -- 30% of profit
    financial_year VARCHAR(20) NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- AML & Compliance
CREATE TABLE aml_alerts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    transaction_id VARCHAR(36), -- Reference to transactions or trades
    rule_triggered VARCHAR(255) NOT NULL, -- e.g., "LARGE_DEPOSIT", "RAPID_TRADING"
    risk_level VARCHAR(50) NOT NULL, -- LOW, MEDIUM, HIGH, SEVERE
    status VARCHAR(50) NOT NULL, -- OPEN, INVESTIGATING, RESOLVED, FALSE_POSITIVE
    description TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE risk_scores (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id),
    score INTEGER NOT NULL DEFAULT 0, -- 0-100
    risk_level VARCHAR(50) NOT NULL DEFAULT 'LOW',
    last_assessed_at TIMESTAMP,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_p2p_ads_token_type ON p2p_ads(token_id, type, status);
CREATE INDEX idx_p2p_orders_buyer ON p2p_orders(buyer_id);
CREATE INDEX idx_p2p_orders_seller ON p2p_orders(seller_id);
CREATE INDEX idx_staking_positions_user ON staking_positions(user_id);
CREATE INDEX idx_tax_records_user_fy ON tax_records(user_id, financial_year);
CREATE INDEX idx_aml_alerts_user ON aml_alerts(user_id, status);
