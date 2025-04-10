# Git Resume ユーザーガイド

Git Resumeは、GitHubの活動履歴からレジュメを自動生成するサービスです。このガイドでは、Git Resumeの基本的な使い方を説明します。

## 基本的な使い方

### 1. GitHub ユーザー名の入力

1. ホーム画面（`/`）にアクセスします。
2. 中央のフォームにGitHub ユーザー名を入力します。
3. 「Search」ボタンをクリックします。

### 2. 調査計画の確認

1. 調査計画画面（`/github/:username/plan`）に遷移します。
2. 入力したGitHub ユーザーの基本情報が表示されます。
3. 実行予定の調査ステップと予想所要時間を確認します。
4. 「Execute Research」ボタンをクリックして調査を開始するか、ブラウザの戻るボタンをクリックしてホーム画面に戻ります。

### 3. 調査進行状況の確認

1. 調査進行画面（`/github/:username/progress`）に遷移します。
2. 進捗バーで全体の進行状況を確認できます。
3. ステップリストで各調査ステップの状態（待機中/進行中/完了/エラー）を確認できます。
4. 「You can safely exit at any time. Research will continue in the background.」というメッセージが表示されます。このメッセージは、ユーザーがいつでも安全に離脱できることを示しています。
5. 「Cancel Research」ボタンをクリックすると、調査を中止してホーム画面に戻ります。

### 4. 調査結果の確認

1. 調査が完了すると、調査結果画面（`/github/:username/results`）に遷移します。
2. GitHub ユーザーの基本情報とAI生成のレジュメが表示されます。
3. 「Export」ボタンをクリックすると、レジュメをエクスポートできます。
4. 「Share」ボタンをクリックすると、レジュメを共有できます。

## その他の機能

### エラー画面

調査中にエラーが発生した場合、エラー画面（`/error`）に遷移します。エラー情報とトラブルシューティングのガイダンスが表示されます。「Return to Home」ボタンをクリックしてホーム画面に戻るか、「Retry」ボタンをクリックして再試行できます。

### ヘルプ・サポート画面

ヘルプ・サポート画面（`/help`）では、Git Resumeの詳細な使い方、よくある質問（FAQ）、サポート連絡先などを確認できます。

### 履歴画面

フッターの「History」リンクをクリックすると、履歴画面（`/history`）に遷移します。ここでは、過去に調査したGitHubユーザーのリストを確認できます。各ユーザーの基本情報と調査日時が表示され、結果を再表示するためのリンクも提供されています。

## 注意事項

- Git Resumeは、公開されているGitHubの情報のみを使用します。
- 生成されたレジュメは、30日間保存されます。
- 調査プロセスは、リポジトリの数によって数分から数十分かかる場合があります。