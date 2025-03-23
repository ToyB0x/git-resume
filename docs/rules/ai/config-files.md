# AIの設定ファイルルール

**更新日**: 2025/3/23
**確認日**: 2025/3/23

**文書情報**:
- ステータス: 承認済み
- バージョン: 1.0.0

## 目的

- AIのセットアップが適切に行われていることを確認するためのルールを定義する
- プロジェクト特性に合わせた最適な設定を提供する
- 設定ファイルの不足や問題を早期に発見し、修正する
- AIツールの一貫した動作を確保する

## 設定ファイルの確認

### Clineの設定ファイル

Clineを使用する場合は、以下の設定ファイルの存在と内容を確認してください：

1. **プロジェクトルートの `.clinerules` ディレクトリ**
   - `.clinerules/README.md`: Clineルール全体の目次
   - `.clinerules/important-docs.md`: 重要ドキュメント一覧
   - `.clinerules/commit-rules.md`: コミットメッセージのルール
   - `.clinerules/prompts/`: プロンプトテンプレート

2. **VSCode拡張の設定**
   - `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`: MCP設定
   - `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_custom_modes.json`: カスタムモード設定

### Roo Codeの設定ファイル

Roo Codeを使用する場合は、以下の設定ファイルの存在と内容を確認してください：

1. **プロジェクトルートの `.roomodes` ファイル**
   - プロジェクト固有のカスタムモード定義

2. **VSCode拡張の設定**
   - VSCodeの設定で `roo.code.*` 関連の設定


### .clinerules.md の標準構造

```markdown
# Cline Rules

## プロジェクト概要

このプロジェクトは...（プロジェクトの簡単な説明）

## 重要ドキュメント

- [プロジェクト概要](./README.md)
- [開発者ガイド](./docs/guide/developer/README.md)
- [アーキテクチャ概要](./docs/guide/developer/architecture/README.md)

## コーディング規約

- インデントはスペース2つを使用
- 変数名はキャメルケースを使用
- 関数名はキャメルケースを使用
- クラス名はパスカルケースを使用

## コミットメッセージ規約

- コミットメッセージは「種類: 要約」の形式で記述
- 詳細は[コミットルール](./docs/rules/ai/commit.md)を参照

## AIインストラクション

このプロジェクトでAIを使用する際は以下のルールに従ってください：

1. コードを変更する前に、関連するドキュメントを確認する
2. 大きな変更を行う場合は、事前に計画を提示し承認を得る
3. コード変更と同時にドキュメントも更新する
4. コミットメッセージは規約に従って記述する
```

### .roomodes の標準構造

```json
{
  "customModes": [
    {
      "slug": "developer",
      "name": "Developer",
      "roleDefinition": "You are Roo, a software developer specializing in this project. Your expertise includes:\n- Writing clean, maintainable code\n- Following the project's coding standards\n- Implementing features according to specifications\n- Writing comprehensive tests",
      "groups": [
        "read",
        "edit",
        "browser",
        "command",
        "mcp"
      ],
      "customInstructions": "Follow the project's coding standards as defined in docs/guide/developer/coding-standards.md. Always update documentation when changing code."
    }
  ]
}
```

### MCP（Model Context Protocol）サーバーの設定

MCPサーバーを使用する場合は、以下の設定を確認してください：

1. **MCP設定ファイル**
   - `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

2. **MCP設定の例**
   ```json
   {
     "mcpServers": {
       "weather": {
         "command": "node",
         "args": ["/path/to/weather-server/build/index.js"],
         "env": {
           "OPENWEATHER_API_KEY": "your-api-key"
         }
       }
     }
   }
   ```

## 設定ファイルの最適化

### プロジェクト特性に合わせた設定

プロジェクトの特性に合わせて、以下の設定を最適化してください：

1. **カスタムモード**
   - プロジェクトの役割に応じたカスタムモードを定義
   - 適切なツールグループのアクセス権を設定

2. **MCPサーバー**
   - プロジェクトで必要なAPIやツールに対応するMCPサーバーを設定
   - 必要な環境変数や認証情報を適切に設定

## 設定ファイルのベストプラクティス

1. **セキュリティ**
   - APIキーなどの機密情報は環境変数として設定し、ハードコードしない
   - `.gitignore` に機密情報を含むファイルを追加

2. **メンテナンス性**
   - 設定ファイルには適切なコメントを追加
   - 設定の目的と影響を明記

3. **一貫性**
   - プロジェクト全体で一貫した命名規則を使用
   - 関連する設定は論理的にグループ化

## 設定ファイルの問題と対応

### 一般的な問題と解決策

| 問題 | 症状 | 解決策 |
| ---- | ---- | ------ |
| 設定ファイルの不足 | AIツールが期待通りに動作しない | 必要な設定ファイルを作成 |
| APIキーの不足 | 外部サービスへの接続エラー | 必要なAPIキーを取得し設定 |
| 設定の不整合 | 一部の機能が動作しない | 設定の整合性を確認し修正 |
| 古い設定形式 | 新機能が利用できない | 最新の設定形式に更新 |

### 設定ファイルのトラブルシューティング

1. **設定ファイルの場所の確認**
   - 正しいディレクトリに設定ファイルが存在するか確認
   - ファイル名が正確か確認

2. **設定内容の検証**
   - JSON構文が正しいか確認
   - 必須フィールドが存在するか確認
   - 値の型が正しいか確認

3. **権限の確認**
   - 設定ファイルの読み取り権限が適切か確認
   - 実行ファイルの実行権限が適切か確認

## AIインストラクション

このルールを読んだAIは以下の行動をとってください：

- Cline/Roo Codeの設定ファイルを確認し、不足や問題がある場合は作成・修正を提案する
- プロジェクト特性に合わせた最適設定を提案し、変更の影響を説明する
- 設定ファイルの問題を検出した場合、トラブルシューティング手順に従って解決策を提案する
- APIキーなどの機密情報の取得方法を案内し、安全な設定方法を提案する
- 設定変更後は動作確認を促し、問題があれば迅速に対応する

## Changelog

- 2025/3/23: [追加] config.mdの内容を統合
- 2025/3/23: 初回作成