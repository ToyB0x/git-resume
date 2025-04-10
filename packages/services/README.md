# @resume/services

**更新日**: 2025/3/29
**確認日**: 2025/3/29
**自動生成**: このドキュメントはAIによって自動生成されています

## 概要

このパッケージは、git-resumeプロジェクトで使用される共通サービス機能を提供します。GitHub連携、Git操作、データ処理など、複数のアプリケーション間で共有される機能が含まれています。

## 目的

アプリケーション間で共通して使用される機能を集約し、コードの再利用性を高め、一貫した動作を保証することを目的としています。特に、GitHubからのデータ取得、Git操作、レジュメ生成のための処理を統一的に提供します。

## 主な機能

- **GitHub連携** - GitHubのAPIと連携し、ユーザー情報やリポジトリデータを取得
- **Git操作** - リポジトリのクローンやプルなどのGit操作を実行
- **パッケージング** - リポジトリのコードを解析し、パッケージ化
- **レジュメ生成** - ユーザーのGitHub活動データからレジュメを生成
- **サマリー作成** - リポジトリやユーザー活動のサマリー情報を生成・管理

## 詳細ドキュメント

- [アーキテクチャ](./docs/architecture.md) - パッケージの設計と構造
- [使用ガイド](./docs/usage-guide.md) - 使用方法と例
