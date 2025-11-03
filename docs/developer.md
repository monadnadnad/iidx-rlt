# 開発手順

開発環境構築や基本的な開発フローをまとめたものです。

## 必要な環境

- Node.js v22 以上（推奨: Volta などで 22.18.0 を固定）
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

### アプリケーションデータの生成

ローカルに、楽曲マスターデータを生成する必要があります。

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
pnpm test
```

## リンターとフォーマッターの実行

以下のコマンドでリンターとフォーマッターを実行できます。

```bash
pnpm lint
pnpm format
```

## 4. プロジェクト構造

- `public/`: 静的アセット（HTML、ブックマークレット、データファイルなど）
- `scripts/`: データ生成やマスターデータ更新のためのスクリプト
- `src/`: アプリケーションのソースコード

## データ管理

### アプリケーションデータ

アプリケーションが利用するデータファイルは、ビルドプロセスとは別に生成・管理され、GitHub Actionsで手動トリガーで反映させます。。

#### `atari-rules.json` (当たり配置ルール):

リポジトリ直下の `public/data/atari-rules.json` を直接編集して管理します。Zod スキーマ `atariRuleSchema` で構造が検証されます。

#### `songs.json` (楽曲マスターデータ):

```
pnpm run gen-songs
```

### ユーザーデータ

ユーザー固有のデータは、ブラウザの `localStorage` を利用して永続化されます。

- インポートされたチケット
- プレイサイド

## デプロイメント

GitHub Actions を利用して GitHub Pages にデプロイされます。
`.github/workflows`を参照。
