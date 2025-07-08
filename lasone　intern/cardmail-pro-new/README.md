# CardMail Pro - New Version

名刺管理とメール送信を統合したWebアプリケーション

## 機能

- 名刺のアップロードとOCR処理
- 自動的な連絡先情報の抽出
- AIによるメール文章の生成
- Gmailとの統合によるメール送信
- 送信履歴の管理

## 技術スタック

### フロントエンド
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (状態管理)
- Framer Motion (アニメーション)

### バックエンド
- Express.js + TypeScript
- BullMQ (ジョブキュー)
- Google APIs (OAuth, Gmail)
- OpenAI API
- Redis

## セットアップ

### 1. 依存関係のインストール

```bash
# ルートディレクトリで
npm install

# サーバーディレクトリで
cd server
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして、必要な環境変数を設定してください。

```bash
cp .env.example .env
```

必要な環境変数:
- `JWT_SECRET` - JWT認証用のシークレットキー
- `REDIS_URL` - Redis接続URL
- `FRONTEND_URL` - フロントエンドのURL（CORS設定用）

**注意**: APIキー（OpenAI、Google OAuthなど）はユーザーがアプリ内の設定画面から個別に設定します。

### 3. 開発サーバーの起動

```bash
npm run dev
```

これにより、フロントエンド（http://localhost:3000）とバックエンド（http://localhost:4000）が同時に起動します。

## Renderへのデプロイ

### 1. Renderアカウントの作成

[Render](https://render.com)でアカウントを作成します。

### 2. 環境変数の設定

Renderダッシュボードで以下の環境変数を設定:

- `FRONTEND_URL` - フロントエンドのURL（例: https://cardmail-pro-web.onrender.com）
- `JWT_SECRET` - 自動生成されます

### 3. デプロイ

1. このリポジトリをGitHubにプッシュ
2. Renderダッシュボードで「New」→「Blueprint」を選択
3. GitHubリポジトリを接続
4. `render.yaml`ファイルが自動的に検出されます
5. 「Apply」をクリックしてデプロイ

### 4. ユーザーのAPIキー設定

デプロイ後、各ユーザーはアプリ内の設定画面から以下のAPIキーを設定する必要があります:

1. **OpenAI APIキー**: メール文章生成用
2. **Google OAuth認証情報**: Gmail連携用
   - Client ID
   - Client Secret
3. **Clearbit APIキー**（オプション）: 企業情報エンリッチメント用

各サービスのアカウント作成方法:
- [OpenAI Platform](https://platform.openai.com/)
- [Google Cloud Console](https://console.cloud.google.com)
- [Clearbit](https://clearbit.com)

## ビルド

```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview
```

## ライセンス

Private