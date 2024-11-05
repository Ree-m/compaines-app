CREATE TABLE companies_views(
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(5) UNIQUE,
    views int DEFAULT 0
);