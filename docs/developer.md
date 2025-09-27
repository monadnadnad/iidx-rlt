# 開発手順

開発環境構築や基本的な開発フローをまとめたものです。

## 必要な環境

- Node.js v22 以上
- npm v11 以上
- Git

## セットアップ

### リポジトリのクローン

```bash
git clone https://github.com/monadnadnad/iidx-rlt.git
cd iidx-rlt
```

### 依存関係のインストール

```bash
npm ci
```

### アプリケーションデータの生成

ローカルに、楽曲マスターデータと当たり配置定義ファイルを生成する必要があります。

```
npm run update-master
npm run build:presets
```

## 開発サーバーの起動

開発サーバーを起動して、ブラウザで http://localhost:5173/iidx-rlt を開きます。

```
npm run dev
```

## テストの実行

```
npm test
```

## リンターとフォーマッターの実行

以下のコマンドでリンターとフォーマッターを実行できます。

```bash
npm run lint
npm run format
```

## 4. プロジェクト構造

- `public/`: 静的アセット（HTML、ブックマークレット、データファイルなど）
- `scripts/`: データ生成やマスターデータ更新のためのスクリプト
- `src/`: アプリケーションのソースコード

## データ管理

### アプリケーションデータ

アプリケーションが利用するデータファイルは、ビルドプロセスとは別に生成・管理され、GitHub Actionsで手動トリガーで反映させます。。

#### `atari-rules.json` (当たり配置ルール):

`scripts/buildAtariPresets.ts` スクリプトが Google Sheets から生成します。

```
npm run build:presets
```

#### `songs.json` (楽曲マスターデータ):

```
npm run update-master
```

### ユーザーデータ

ユーザー固有のデータは、ブラウザの `localStorage` を利用して永続化されます。

- インポートされたチケット
- プレイサイド

## デプロイメント

GitHub Actions を利用して GitHub Pages にデプロイされます。
`.github/workflows`を参照。
