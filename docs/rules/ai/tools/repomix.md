# AIのRepomixの活用

## 目的

- AIがRepomixを効果的に活用するためのルールを定義
- 大規模コードベースの効率的な理解と分析を支援
- MCPを通じたコード分析の最適化方法を提供

## Repomixの効果的な活用ルール

### 基本原則

- **効率的な理解**: MCPを利用して大規模コードベースを効率的に理解
- **パッケージ分析**: 特定パッケージの調査には、repomixによる分析を推奨
- **通信負荷軽減**: 数十ファイル以上のパッケージでは、関数シグネチャのみを分析し時間短縮
- **柔軟な利用**: リポジトリ全体、特定パッケージ、特定ディレクトリなど様々な階層で利用可能
- **設定確認**: MCPが未設定の場合は、ユーザにセットアップを促す

### 使用シナリオ

1. **新規プロジェクト理解**
   - リポジトリ全体を圧縮モードで分析し、全体構造を把握
   - 主要コンポーネントとその関係性を特定
   - 重要なファイルとディレクトリを特定

2. **特定機能の調査**
   - 関連するディレクトリやパッケージを特定
   - 該当部分のみを詳細に分析
   - 依存関係と影響範囲を把握

3. **バグ修正・機能追加**
   - 修正対象のコードを含むパッケージを分析
   - 関連するテストコードも含めて分析
   - 変更の影響範囲を特定

### 最適な設定パラメータ

- **compress**: 大規模コードベースでは `true` を推奨（デフォルト）
- **includePatterns**: 分析対象を絞り込む（例: `"src/**/*.ts,tests/**/*.ts"`）
- **ignorePatterns**: 不要なファイルを除外（例: `"**/*.test.js,**/*.spec.js"`）
- **topFilesLength**: 重要ファイル表示数（デフォルト: 5）

## 使用例

### リポジトリ全体の分析

```javascript
<use_mcp_tool>
<server_name>repomix</server_name>
<tool_name>pack_codebase</tool_name>
<arguments>
{
  "directory": "/Users/user/github/survive",
  "compress": true
}
</arguments>
</use_mcp_tool>
```

### 特定ディレクトリの分析

```javascript
<use_mcp_tool>
<server_name>repomix</server_name>
<tool_name>pack_codebase</tool_name>
<arguments>
{
  "directory": "/Users/user/github/survive/packages/services",
  "compress": true,
  "includePatterns": "src/**/*.ts"
}
</arguments>
</use_mcp_tool>
```

### リモートリポジトリの分析

```javascript
<use_mcp_tool>
<server_name>repomix</server_name>
<tool_name>pack_remote_repository</tool_name>
<arguments>
{
  "remote": "ToyB0x/survive",
  "compress": true
}
</arguments>
</use_mcp_tool>
```

## 分析結果の活用

- **構造把握**: ディレクトリ構造とファイル関係を理解
- **依存関係分析**: モジュール間の依存関係を把握
- **重要ファイル特定**: 中心的な役割を果たすファイルを特定
- **コード品質評価**: 複雑度や一貫性などの品質指標を評価
- **リファクタリング提案**: 改善可能な箇所を特定

## AIインストラクション

このルールを読んだAIは以下の行動をとってください：

- 大規模コードベース分析にMCP経由でRepomixを活用し、目的に応じた適切な分析範囲を選択する
- 大きなパッケージでは関数シグネチャのみの分析を優先し、通信負荷を軽減する
- 分析結果からコードベースの構造と依存関係を明確に説明し、必要に応じてセットアップを支援する
- 分析結果を基に、コードの理解、バグ修正、機能追加などのタスクを効率的に進める
- MCPが未設定の場合は、ユーザにセットアップ手順を提案する