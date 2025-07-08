# Renderデプロイガイド

## 前提条件
- GitHubアカウント
- Renderアカウント（無料プランでOK）
- Node.js環境（ローカル開発用）

## ステップ1: GitHubリポジトリの準備

```bash
# cardmail-pro-newディレクトリに移動
cd cardmail-pro-new

# Gitリポジトリを初期化
git init

# .gitignoreファイルが存在することを確認
cat .gitignore

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit - CardMail Pro with user API keys"
```

GitHubで新しいリポジトリを作成:
1. GitHub.comにログイン
2. 「New repository」をクリック
3. リポジトリ名: `cardmail-pro-new`
4. Public/Privateを選択
5. 「Create repository」をクリック

リポジトリ作成後:
```bash
# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/cardmail-pro-new.git

# mainブランチにリネーム
git branch -M main

# プッシュ
git push -u origin main
```

## ステップ2: Renderアカウントの設定

1. [https://render.com](https://render.com)にアクセス
2. 「Get Started for Free」をクリック
3. GitHubでサインイン
4. Renderに必要な権限を付与

## ステップ3: Renderでのデプロイ

1. Renderダッシュボードで「**New +**」ボタンをクリック
2. 「**Blueprint**」を選択
3. GitHubリポジトリのリストから`cardmail-pro-new`を選択
4. 「**Connect**」をクリック
5. `render.yaml`ファイルが検出されることを確認
6. 「**Apply**」をクリックしてデプロイ開始

## ステップ4: サービスの確認

以下の3つのサービスが作成されます：

### 1. cardmail-pro-api (Webサービス)
- タイプ: Web Service
- 実行環境: Node.js
- URL例: `https://cardmail-pro-api-xxx.onrender.com`

### 2. cardmail-pro-web (静的サイト)
- タイプ: Static Site
- ビルド: Vite
- URL例: `https://cardmail-pro-web-xxx.onrender.com`

### 3. cardmail-redis (Redis)
- タイプ: Redis
- プラン: Starter（無料）

## ステップ5: 環境変数の設定

### cardmail-pro-apiの環境変数

1. Renderダッシュボードで`cardmail-pro-api`サービスをクリック
2. 「Environment」タブを選択
3. 以下を確認・設定:
   - `JWT_SECRET`: 自動生成される
   - `REDIS_URL`: 自動設定される
   - `FRONTEND_URL`: 静的サイトのURLを設定
     - 例: `https://cardmail-pro-web-xxx.onrender.com`
4. 「Save Changes」をクリック

## ステップ6: デプロイの確認

1. **ビルドログの確認**
   - 各サービスの「Logs」タブでビルドの進行状況を確認
   - エラーがないことを確認

2. **サービスステータスの確認**
   - すべてのサービスが「Live」になるまで待つ
   - 初回デプロイは10-15分程度かかる場合がある

3. **アプリケーションへのアクセス**
   - 静的サイトのURL（例: `https://cardmail-pro-web-xxx.onrender.com`）にアクセス
   - 設定画面が表示されることを確認

## ステップ7: 初期設定

1. アプリケーションにアクセス
2. 自動的に設定画面が開く
3. 以下のAPIキーを入力:
   - **OpenAI API Key**: ChatGPT APIキー
   - **Google Client ID**: Google OAuth2クライアントID
   - **Google Client Secret**: Google OAuth2クライアントシークレット
   - **Clearbit API Key**: （オプション）
4. 「保存」をクリック

## トラブルシューティング

### ビルドエラーが発生する場合

1. **package.jsonの確認**
   ```bash
   # 依存関係の確認
   npm install
   npm run build
   ```

2. **TypeScriptエラー**
   ```bash
   # 型エラーの確認
   npm run build:client
   cd server && npm run build
   ```

### デプロイ後にアクセスできない場合

1. **CORSエラー**
   - `FRONTEND_URL`環境変数が正しく設定されているか確認
   - APIサービスを再デプロイ

2. **404エラー**
   - 静的サイトのビルドが完了しているか確認
   - `dist`フォルダが作成されているか確認

### APIキーが機能しない場合

1. **ブラウザの開発者ツール**でネットワークタブを確認
2. リクエストヘッダーにAPIキーが含まれているか確認
3. APIレスポンスのエラーメッセージを確認

## 無料プランの制限

Renderの無料プランには以下の制限があります：

1. **スピンダウン**: 15分間アクセスがないとサービスが停止
2. **月間実行時間**: 750時間まで
3. **帯域幅**: 100GB/月
4. **ビルド時間**: 500分/月

商用利用の場合は有料プランへのアップグレードを検討してください。

## 次のステップ

1. **カスタムドメインの設定**
   - Renderダッシュボードで「Settings」→「Custom Domains」

2. **SSL証明書**
   - 自動的に設定される（Let's Encrypt）

3. **監視とアラート**
   - Renderダッシュボードで「Metrics」タブを確認

## サポート

問題が解決しない場合：
1. Renderのドキュメント: https://render.com/docs
2. Renderのコミュニティ: https://community.render.com
3. GitHubのIssues: リポジトリにIssueを作成