# 開発環境構築

**パス**: [ドキュメントガイドライン](../../../README.md) > [開発者ガイド](../README.md) > [開発環境構築](./README.md)

## 概要

このドキュメントでは、開発環境の構築手順を説明します。

## 前提条件

- オペレーティングシステム: macOS
- ターミナル: zsh

## 手順

1. **リポジトリのクローン**:
   ```bash
   git clone git@github.com:your-username/survive.git
   cd survive
   ```

2. **Node.jsのインストール**:
   Node.jsのバージョン管理には`fnm`を使用します。
   ```bash
   brew install fnm
   fnm install
   fnm use
   ```

3. **パッケージマネージャーのインストール**:
   `pnpm`を使用します。
   ```bash
   npm install -g pnpm
   ```

4. **依存関係のインストール**:
   ```bash
   pnpm install
   ```

5. **環境変数の設定**:
   `.env.sample`を`.env`にコピーし、必要な環境変数を設定します。

6. **開発サーバーの起動**:
   ```bash
   pnpm run dev
   ```

## メタデータ

**更新・確認情報**:
- 最終更新日: 2025/03/23
- 最終確認日: 2025/03/23

**文書情報**:
- ステータス: 草案
- バージョン: 0.1.0

## 関連ドキュメント

- [開発者ガイド](../README.md)