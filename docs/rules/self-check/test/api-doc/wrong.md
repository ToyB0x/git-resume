# ユーザー認証API

## エンドポイント
POST /api/auth/login

## リクエスト
{
  "username": "string",
  "password": "string"
}

## レスポンス
{
  "token": "string"
}