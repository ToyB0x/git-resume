# ユーザー認証API

## メタデータ
**最終更新日**: 2025/03/23
**ステータス**: 公開
**バージョン**: 2.1.0
**担当者**: 認証チーム

## 目的
ユーザー認証のためのAPIエンドポイントを提供し、安全なアクセストークンを発行する。

## エンドポイント
`POST /api/v2/auth/login`

## リクエスト
### ヘッダー
| 名前 | 必須 | 説明 |
|------|------|------|
| Content-Type | 必須 | application/json |
| Accept | 任意 | application/json |

### ボディ
```json
{
  "username": "string",  // メールアドレスまたはユーザー名
  "password": "string",  // 8文字以上の英数字記号
  "remember_me": boolean // 省略可、デフォルトはfalse
}
```

## レスポンス
### 成功時 (200 OK)
```json
{
  "access_token": "string",  // JWT形式のアクセストークン
  "refresh_token": "string", // リフレッシュトークン
  "expires_in": 3600,        // アクセストークンの有効期限（秒）
  "token_type": "Bearer"     // トークンタイプ
}
```

### エラー時
| ステータスコード | 説明 |
|----------------|------|
| 400 Bad Request | リクエスト形式が不正 |
| 401 Unauthorized | 認証情報が不正 |
| 429 Too Many Requests | リクエスト回数制限超過 |
| 500 Internal Server Error | サーバーエラー |

## 使用例
```bash
curl -X POST https://api.example.com/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user@example.com", "password": "secureP@ss123"}'
```

## セキュリティ考慮事項
- レート制限: 同一IPアドレスからの連続失敗は10回まで
- パスワードポリシー: 8文字以上、英数字記号混在
- トークン有効期限: アクセストークン1時間、リフレッシュトークン30日

## ドキュメント関係
### 参照ドキュメント
- [認証フロー概要](../../guide/developer/auth/flow.md)
- [エラーコード一覧](../error-codes.md)

### 被参照ドキュメント
- [ユーザープロファイルAPI](../user/profile.md)
- [認証ミドルウェア](../../guide/developer/middleware/auth.md)

### 関連キーワード
#API #認証 #セキュリティ #JWT