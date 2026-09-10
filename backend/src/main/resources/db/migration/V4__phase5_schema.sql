-- V4__phase5_schema.sql
-- Phase 5 Schema Additions for AI, Admin, Notifications, News, and System Monitoring

-- AI & ML Models
CREATE TABLE ai_recommendations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    category VARCHAR(50) NOT NULL, -- PORTFOLIO, TRADING, RISK
    content TEXT NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE ai_predictions (
    id VARCHAR(36) PRIMARY KEY,
    token_id VARCHAR(36) NOT NULL REFERENCES tokens(id),
    timeframe VARCHAR(20) NOT NULL, -- 1H, 24H, 7D
    predicted_price DECIMAL(19,8) NOT NULL,
    confidence_score INTEGER NOT NULL, -- 0-100
    signal VARCHAR(20) NOT NULL, -- BUY, HOLD, SELL
    support_level DECIMAL(19,8),
    resistance_level DECIMAL(19,8),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- TRADE, ALERT, SYSTEM
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- News Module
CREATE TABLE news_articles (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    source VARCHAR(100),
    url VARCHAR(500),
    image_url VARCHAR(500),
    related_token_id VARCHAR(36) REFERENCES tokens(id),
    published_at TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE TABLE news_bookmarks (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    article_id VARCHAR(36) NOT NULL REFERENCES news_articles(id),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    UNIQUE(user_id, article_id)
);

-- System Monitoring
CREATE TABLE system_metrics (
    id VARCHAR(36) PRIMARY KEY,
    cpu_usage DECIMAL(5,2) NOT NULL,
    memory_usage DECIMAL(5,2) NOT NULL,
    api_response_time_ms INTEGER NOT NULL,
    active_users INTEGER NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_ai_predictions_token ON ai_predictions(token_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);
