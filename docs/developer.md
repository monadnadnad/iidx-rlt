# 開発手順

開発環境構築や基本的な開発フローをまとめたものです。

## 必要な環境

- Node.js v22 以上
- pnpm 9 系

## セットアップ

### リポジトリのクローン

```bash
git clone https://github.com/monadnadnad/iidx-rlt.git
cd iidx-rlt
```

### 依存関係のインストール

```bash
pnpm install
```

### 曲データの生成

以下で `public/data/songs.json` が生成されます。
本番ではGitHub Actionsで main ブランチで手動でワークフローを実行します。

```
pnpm gen-songs
```

## 開発サーバーの起動

開発サーバーを起動して、ブラウザで http://localhost:5173/iidx-rlt を開きます。

```
pnpm dev
```

## テストの実行

```
pnpm vitest run
```

## リンターとフォーマッターの実行

```bash
pnpm lint
pnpm format
```

## 4. プロジェクト構造

- `public/`: 静的アセット（HTML、ブックマークレット、データ）
- `scripts/songs`: 曲データを生成するスクリプト
- `src/`: ソースコード

## データ管理

### アプリケーションデータ

アプリケーションが利用するデータファイルは、ビルドプロセスとは別に生成・管理され、GitHub Actionsで手動トリガーで反映させます。。

#### `atari-rules.json` (当たり配置ルール):

リポジトリ直下の `public/data/atari-rules.json` を直接編集して管理します。
Zod スキーマ `atariRuleSchema` で構造が検証されます。

#### `songs.json` / `songs.version.json` (楽曲データ):

```
pnpm gen-songs
```

### ユーザーデータ

ユーザー固有のデータは、ブラウザの `localStorage` を利用して永続化されます。

- インポートされたチケット
- プレイサイド

## デプロイメント

GitHub Actions を利用して GitHub Pages にデプロイされます。
`.github/workflows`を参照。
