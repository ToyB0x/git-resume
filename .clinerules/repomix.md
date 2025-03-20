# repomixを利用したリポジトリコード理解の効率化

**更新日**: 2025/3/21
**確認日**: 2025/3/21

このファイルは、repomix MCPを利用して、git-resumeリポジトリのコードを効率的に理解するための方法をまとめたものです。AIとのやり取りにおけるトークン使用量を最適化しつつ、コードベースの全体像を短時間で把握するためのガイドラインを提供します。

## repomixとは

repomixは、リポジトリ全体またはディレクトリのコードを、AIが解析しやすい形式に圧縮・パッケージ化するツールです。特に大規模なコードベースを扱う際に、トークン使用量を削減しながら効率的にコードの構造と機能を理解するのに役立ちます。

## セットアップ方法

repomix MCPがまだ設定されていない場合は、以下の手順でセットアップを行います：

1. `npx -y repomix --mcp` を実行して、repomix MCPサーバーを起動します
2. Clineの設定ファイルに以下の設定を追加します：

```json
{
  "mcpServers": {
    "repomix": {
      "command": "npx",
      "args": ["-y", "repomix", "--mcp"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## 効率的なコード理解の手順

### 1. リポジトリ全体のパッケージ化

```
repomixのpack_codebaseツールを使用して、リポジトリ全体をパッケージ化します：

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

### 2. 特定ディレクトリのパッケージ化

特定のディレクトリ（例：apps/web）に焦点を当てたい場合：

```
<use_mcp_tool>
<server_name>repomix</server_name>
<tool_name>pack_codebase</tool_name>
<arguments>
{
  "directory": "/Users/user/github/survive/apps/web",
  "compress": true
}
</arguments>
</use_mcp_tool>
```

### 3. フィルタリングオプションの活用

特定のファイルタイプのみを含めたい場合は、includePatterns を使用します：

```
<use_mcp_tool>
<server_name>repomix</server_name>
<tool_name>pack_codebase</tool_name>
<arguments>
{
  "directory": "/Users/user/github/survive",
  "compress": true,
  "includePatterns": "**/*.ts,**/*.tsx"
}
</arguments>
</use_mcp_tool>
```

### 4. 重要ではないファイルの除外

テストファイルなど、現在のタスクに関連しないファイルを除外する場合：

```
<use_mcp_tool>
<server_name>repomix</server_name>
<tool_name>pack_codebase</tool_name>
<arguments>
{
  "directory": "/Users/user/github/survive",
  "compress": true,
  "ignorePatterns": "**/*.test.ts,**/*.spec.ts"
}
</arguments>
</use_mcp_tool>
```

## 効果的な使用シナリオ

1. **新しいプロジェクトの概要理解**: リポジトリに初めて取り組む際に、全体構造を把握
2. **特定の機能実装前の調査**: 関連コードを集中的に分析
3. **リファクタリング前の依存関係把握**: コード間の関係性を理解
4. **バグ修正のための影響範囲特定**: 関連するコードモジュールを特定

## 注意点とベストプラクティス

1. トークン使用量とコード理解のバランスを取るため、必要に応じて圧縮レベルを調整してください
2. 大きなリポジトリの場合は、タスクに関連する部分だけをパッケージ化することを検討してください
3. フィルタパターンを効果的に使用して、関連性の高いファイルに焦点を当ててください
4. リポジトリの全体像を把握した後は、個別のファイルの詳細を確認するために標準の `read_file` ツールを使用することをお勧めします

## トラブルシューティング

repomix MCPが正しく動作しない場合は、以下を確認してください：

1. Node.jsが最新バージョンであること
2. repomixパッケージが正しくインストールされていること
3. MCP設定ファイルの構文が正しいこと
4. ファイルパスが絶対パスで指定されていること

## Changelog

- 2025/3/21: 初回作成
