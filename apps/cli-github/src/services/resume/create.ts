import fs from "node:fs";
import { env } from "@/utils/env";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import confirm from "@inquirer/confirm";
import type { Summary } from "@resume/models";
import { genkit } from "genkit";

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: env.RESUME_GEMINI_API_KEY,
    }),
  ],
  model: gemini20Flash,
});

export const create = async (
  userName: string,
  summaries: Summary[],
  skipConfirm: boolean,
) => {
  if (!skipConfirm) {
    const answer = await confirm({
      message: `all summary text size is ${summaries.toString().length} (about ${Math.floor(summaries.toString().length / 4)} token)
Continue?`,
    });

    console.log(answer);
    if (!answer) {
      process.exit(1);
    }
  }

  const { text } = await ai.generate({
    system: `以下の 2 Step で git のログからエンジニアのResumeを生成しようとしています。
    - STEP1: リポジトリごとに対象エンジニアの git log と git show の結果を分析し、そのリポジトリについてのエンジニアのサマリを作成する(複数のリポジトリで一気に分析を行うとLLMのトークン制限に引っかかるため、リポジトリごとに分けて分析を行う)
    - STEP2: STEP1で作成したリポジトリごとのサマリを元に、エンジニアのResumeを作成する

      あなたは上記の STEP2 の役割を担うプログラムで、以下の責務を持ちます。：

      1. エンジニアの能力や強みを出来るだけ魅力的に見えるように資料にまとめる
      2. 常に日本語で出力する
      3. 前段のSTEP1から渡された情報から、なるべくエンジニアの経験や利用技術を漏れなく分析し利用されているライブラリやフレームワーク、推測される職務経験を詳細に書く
      4. frontmatterに以下の情報を記載する
        - user: ${userName}
        - startAt: Resumeの分析対象に利用した資料の開始日時 (yyyy-mm-dd形式)
        - endAt: Resumeの分析対象に利用した資料の終了日時 (yyyy-mm-dd形式)
      5. 以下のセクションを含める
        - 概要: 対象ユーザの活動の概要
        - 使用技術: 対象ユーザが利用した技術とその熟練度を10段階でテーブルにまとめる
        - 職務経験: 対象ユーザの活動を職務経験化
        - アピールポイント: 対象ユーザの活動から、転職時にアピールできるポイントをまとめる
        - 補足事項: 分析に関する補足情報や注意事項、推測で記載した内容の注釈等
      `,
    prompt: `以下の STEP1 の複数の結果からSTEP2の資料を作成しマークダウン形式で出力してください。(STEP1の各資料は ========== で区切られています)

      -----

      ${summaries.join("\n\n==========\n\n")}
      `,
  });

  const resumeDir = "./generated/resumes";
  fs.mkdirSync(resumeDir, { recursive: true });
  fs.writeFileSync(
    `${resumeDir}/${userName}.md`,
    text
      .replace("```markdown", "")
      .replace("```", ""), // マークダウン用のコードブロックで全体が括られる場合があるので削除
    "utf8",
  );
};
