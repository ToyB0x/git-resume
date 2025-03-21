# ユーザーダッシュボード機能 - API実装詳細

**更新日**: 2025/03/01
**確認日**: 2025/03/01

このドキュメントでは、ユーザーダッシュボード機能のAPI実装に関する詳細な技術仕様と実装例を提供します。

## ディレクトリ構造

以下のディレクトリ構造で実装します：

```
apps/api/src/
├── routes/
│   └── api/
│       └── dashboard/
│           ├── index.ts              # ルートエクスポート
│           ├── dashboardController.ts # コントローラ
│           ├── dashboardService.ts    # サービス層
│           ├── dashboardValidation.ts # バリデーション
│           └── websocket/
│               ├── index.ts          # WebSocketハンドラ
│               └── events.ts         # イベント定義
├── middlewares/
│   ├── cache.ts                     # キャッシュミドルウェア
│   └── dashboardAuth.ts             # ダッシュボード用認証
└── server.ts                        # WebSocket統合
```

## RESTful API実装

### コントローラ実装

```typescript
// apps/api/src/routes/api/dashboard/dashboardController.ts

import { Request, Response } from 'express';
import { dashboardService } from './dashboardService';
import { cacheMiddleware } from '../../../middlewares/cache';

export class DashboardController {
  /**
   * ダッシュボード概要を取得
   */
  async getDashboard(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const dashboard = await dashboardService.getUserDashboard(userId);
      
      return res.status(200).json({
        success: true,
        data: dashboard
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  /**
   * ウィジェット一覧と設定を取得
   */
  async getWidgets(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const widgets = await dashboardService.getUserWidgets(userId);
      
      return res.status(200).json({
        success: true,
        data: widgets
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // 他のエンドポイント実装...
}

export const dashboardController = new DashboardController();
```

### ルート定義

```typescript
// apps/api/src/routes/api/dashboard/index.ts

import { Router } from 'express';
import { dashboardController } from './dashboardController';
import { dashboardValidation } from './dashboardValidation';
import { authMiddleware } from '../../../middlewares/auth';
import { cacheMiddleware } from '../../../middlewares/cache';

const router = Router();

// ダッシュボード概要 - 5分キャッシュ
router.get('/', 
  authMiddleware, 
  cacheMiddleware(300),
  dashboardController.getDashboard
);

// ウィジェット一覧
router.get('/widgets', 
  authMiddleware, 
  cacheMiddleware(180),
  dashboardController.getWidgets
);

// 特定ウィジェットの詳細
router.get('/widgets/:id', 
  authMiddleware, 
  dashboardValidation.validateWidgetId,
  cacheMiddleware(60),
  dashboardController.getWidgetById
);

// ウィジェット設定更新
router.put('/widgets/:id', 
  authMiddleware, 
  dashboardValidation.validateWidgetUpdate,
  dashboardController.updateWidget
);

// レイアウト取得
router.get('/layout', 
  authMiddleware, 
  cacheMiddleware(300),
  dashboardController.getLayout
);

// レイアウト更新
router.put('/layout', 
  authMiddleware, 
  dashboardValidation.validateLayoutUpdate,
  dashboardController.updateLayout
);

export default router;
```

### キャッシュミドルウェア

```typescript
// apps/api/src/middlewares/cache.ts

import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL);

export const cacheMiddleware = (ttl: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }
    
    try {
      // キャッシュキーの生成（ユーザーIDとURLパスから）
      const userId = req.user?.id || 'anonymous';
      const cacheKey = `dashboard:${userId}:${req.originalUrl}`;
      
      // キャッシュ確認
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        const data = JSON.parse(cachedData);
        return res.status(200).json({
          success: true,
          data,
          fromCache: true
        });
      }
      
      // レスポンスをキャプチャして保存
      const originalSend = res.send;
      res.send = function(body) {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            if (data.success) {
              redisClient.set(cacheKey, JSON.stringify(data.data), 'EX', ttl);
            }
          } catch (e) {
            console.error('Cache serialization error:', e);
          }
        }
        return originalSend.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// キャッシュ無効化関数
export const invalidateCache = async (pattern: string) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
};
```

## WebSocket通信の実装

### WebSocketサーバー統合

```typescript
// apps/api/src/server.ts の変更部分

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dashboardWSHandler from './routes/api/dashboard/websocket';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Expressの設定
// ...

// WebSocketハンドラの設定
io.of('/dashboard').use(socketAuthMiddleware);
dashboardWSHandler(io.of('/dashboard'));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

### WebSocketイベントハンドラ

```typescript
// apps/api/src/routes/api/dashboard/websocket/index.ts

import { Namespace } from 'socket.io';
import { dashboardService } from '../dashboardService';
import { EVENTS } from './events';

export default function dashboardWSHandler(io: Namespace) {
  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`User ${userId} connected to dashboard`);
    
    // ユーザーごとのRoom作成
    socket.join(`user:${userId}`);
    
    // 初期接続イベント
    socket.on(EVENTS.CONNECT, async (data) => {
      try {
        const dashboard = await dashboardService.getUserDashboard(userId);
        socket.emit(EVENTS.UPDATE, { dashboard });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // レイアウト変更イベント
    socket.on(EVENTS.LAYOUT_CHANGE, async (data) => {
      try {
        await dashboardService.updateLayout(userId, data.layout);
        
        // 同じユーザーの他接続にも通知（複数デバイス同期）
        io.to(`user:${userId}`).emit(EVENTS.LAYOUT_CHANGE, { layout: data.layout });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // 接続解除
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from dashboard`);
    });
  });
  
  // 定期的なダッシュボード更新通知（バックグラウンド）
  setInterval(async () => {
    // アクティブユーザーのリスト取得（実際の実装はより効率的に）
    const activeUsers = await dashboardService.getActiveUsers();
    
    for (const userId of activeUsers) {
      try {
        const updates = await dashboardService.getRealtimeUpdates(userId);
        if (updates) {
          io.to(`user:${userId}`).emit(EVENTS.UPDATE, { updates });
        }
      } catch (error) {
        console.error(`Error sending updates to user ${userId}:`, error);
      }
    }
  }, 30000); // 30秒ごと
}
```

### WebSocketイベント定義

```typescript
// apps/api/src/routes/api/dashboard/websocket/events.ts

export const EVENTS = {
  CONNECT: 'dashboard:connect',
  UPDATE: 'dashboard:update',
  WIDGET_UPDATE: 'widget:update',
  LAYOUT_CHANGE: 'layout:change'
};
```

## 認証・認可

### WebSocket認証ミドルウェア

```typescript
// apps/api/src/middlewares/socketAuth.ts

import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error: Token not provided'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};
```

## エラーハンドリング

API全体で一貫したエラーレスポンス形式を使用します：

```typescript
// apps/api/src/utils/errorResponse.ts

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export class APIError extends Error {
  code: string;
  details?: any;
  
  constructor(message: string, code: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
  
  toResponse(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details
      }
    };
  }
}

// 使用例
// throw new APIError('Widget not found', 'WIDGET_NOT_FOUND', { widgetId });
```

## 制約と考慮事項

1. **パフォーマンス**
   - 1リクエストあたりの処理時間: 200ms以内
   - WebSocketメッセージサイズ: 最大10KB

2. **認証トークン有効期限**
   - JWTトークン: 1時間
   - リフレッシュトークン: 7日間

3. **API利用制限**
   - 認証ユーザー: 1分あたり60リクエスト
   - 匿名ユーザー: 1分あたり10リクエスト

## テスト要件

各エンドポイントに対して以下のテストを実装します：
- 正常系テスト（期待通りのレスポンス）
- 認証エラーテスト
- バリデーションエラーテスト
- キャッシュ動作テスト
- パフォーマンステスト（負荷テスト）

詳細なテスト計画は [APIテスト計画](./tests.md) を参照してください。

## Changelog

- 2025/03/01: 初回作成
