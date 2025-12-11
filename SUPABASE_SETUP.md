# Supabase Setup Guide

このガイドに従って、Supabaseプロジェクトをセットアップしてください。

## 1. Supabaseアカウント作成

1. [supabase.com](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ（推奨）

## 2. 新規プロジェクト作成

1. ダッシュボードで「New Project」をクリック
2. 以下を入力:
   - **Name**: `smagol-portal` (任意)
   - **Database Password**: 強力なパスワードを設定（保存してください）
   - **Region**: `Northeast Asia (Tokyo)` を選択
3. 「Create new project」をクリック
4. プロジェクトの準備完了まで1-2分待機

## 3. API認証情報の取得

1. 左サイドバーの「Project Settings」（歯車アイコン）をクリック
2. 「API」タブを選択
3. 以下をコピー:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (長い文字列)

## 4. 環境変数の設定

ローカルの `.env` ファイルを編集:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 5. データベーススキーマの作成

1. 左サイドバーの「SQL Editor」をクリック
2. 「New query」をクリック
3. 以下のSQLをコピー&ペースト:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  usage_type TEXT NOT NULL CHECK (usage_type IN ('OneTime', 'Unlimited')),
  image_url TEXT,
  terms TEXT,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Config table
CREATE TABLE config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default config
INSERT INTO config (key, value) VALUES
  ('systemPrompt', 'あなたは企業の公式アプリのAIコンシェルジュです。ユーザーに対して、親しみやすく丁寧な日本語で接してください。'),
  ('knowledgeBase', '[店舗情報]
・営業時間: 9:00 - 22:00
・定休日: 年中無休
・電話番号: 03-1234-5678');

-- Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read config" ON config FOR SELECT USING (true);

-- Public write policies (for demo - restrict in production!)
CREATE POLICY "Public write partners" ON partners FOR ALL USING (true);
CREATE POLICY "Public write coupons" ON coupons FOR ALL USING (true);
CREATE POLICY "Public write news" ON news FOR ALL USING (true);
CREATE POLICY "Public write config" ON config FOR ALL USING (true);
```

4. 「Run」をクリック
5. 成功メッセージを確認

## 6. Storageバケットの作成

1. 左サイドバーの「Storage」をクリック
2. 「Create a new bucket」をクリック
3. 以下の3つのバケットを作成:

### バケット1: coupon-images
- **Name**: `coupon-images`
- **Public bucket**: ✅ チェック
- 「Create bucket」をクリック

### バケット2: news-images
- **Name**: `news-images`
- **Public bucket**: ✅ チェック
- 「Create bucket」をクリック

### バケット3: partner-logos
- **Name**: `partner-logos`
- **Public bucket**: ✅ チェック
- 「Create bucket」をクリック

## 7. 動作確認

ローカルで開発サーバーを起動:
```bash
npm run dev
```

管理画面（`/?admin=true`）でパートナーやクーポンを追加し、Supabaseダッシュボードの「Table Editor」でデータが保存されているか確認してください。

## トラブルシューティング

### エラー: "Invalid API key"
- `.env` ファイルの `VITE_SUPABASE_ANON_KEY` が正しいか確認
- 開発サーバーを再起動

### エラー: "Failed to fetch"
- `VITE_SUPABASE_URL` が正しいか確認
- Supabaseプロジェクトが起動しているか確認

### 画像アップロードエラー
- Storageバケットが「Public」に設定されているか確認
- ブラウザのコンソールでエラー詳細を確認
