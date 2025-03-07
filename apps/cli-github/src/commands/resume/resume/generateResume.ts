import fs from "node:fs";
import { env } from "@/utils/env";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import confirm from "@inquirer/confirm";
import { genkit, z } from "genkit";

export const generateResume = async (userName: string) => {
  const packedText = fs.readFileSync(`pack/${userName}.txt`, "utf8").toString();

  const answer = await confirm({
    message: `raw text size is ${packedText.length} (about ${Math.floor(packedText.length / 4)} token)\n
    Continue?`,
  });
  console.log(answer);

  // NOTE: 以下はテスト中
  const ai = genkit({
    plugins: [
      googleAI({
        apiKey: env.RESUME_GEMINI_API_KEY,
      }),
    ],
    model: gemini20Flash,
  });

  const { output } = await ai.generate({
    system: `
  あなたはgitの情報からエンジニアのResumeを生成するプログラムです。以下の責務を持ちます。：

  1. エンジニアの能力や強みを出来るだけ魅力的に見えるように資料にまとめる
  2. 常に日本語で出力する
  3. 与えられた情報からは直接は推測できなかった部分は、推測で記載することは避ける
  4. resumeはresumeMarkdownのスキーマにMarkdown形式で出力し、補足情報や注意事項、推測で記載した部分はsupplementに記載する(resumeMarkdownはそのままResumeとして使えるよう、余計な注釈は含めない)
  `,
    output: {
      schema: z.object({
        supplement: z.string(),
        resumeMarkdown: z.string(),
      }),
    },
    prompt: `以下はあるエンジニアの直近数年分の git diff です。この情報を元にこのエンジニアのResumeを日本語で作成してください。

  -----

  ${packedText}
  `,
  });

  if (!output) throw new Error("output is undefined");

  console.log({ md: output.resumeMarkdown });

  console.log({
    supplement: output.supplement,
  });

  /************ Results ************
  { md: '## 職務経歴\n\n- **Git Resume**\n  - ' }
  {
    supplement: '今回の diff からは、具体的な会社名やプロジェクトにおける役割、期間といった情報が不足しています。そのため、以下の情報を補足する必要があります。\n' +
    '\n' +
    '- 期間: いつからいつまで、そのプロジェクトに携わっていたのか\n' +
    '- 会社名: どこの会社でどのような業務をしていたのか\n' +
    '- プロジェクト名: どのようなプロジェクトで、どのような役割を担っていたのか (例: リーダー、メンバー、テックリード)\n' +
    '- チーム規模: チームの人数や構成\n' +
    '- プロジェクトの概要: 開発したシステムやアプリケーションの概要、規模、技術構成\n' +
    '- 担当業務: 担当した機能やタスクの詳細、役割 (例: 設計、開発、テスト、運用)\n' +
    '- 技術的な貢献: プロジェクトで特に貢献した点、技術的な課題をどのように解決したか (例: パフォーマンス改善、アーキテクチャ改善)\n' +
    '- プロジェクトの成果: プロジェクトがどのような成果を上げたか (例: 売上向上、コスト削減、効率化)\n' +
    '- 使用技術: 使用した技術 (プログラミング言語、フレームワーク、ツールなど)\n' +
    '\n' +
    '**注意点**\n' +
    '\n' +
    '- あくまで転職活動を支援するヘッドハンターとして履歴書を作成するという前提のため、直接取得できた情報以外は、全て推測で記載することは避ける必要があります。\n' +
    '- 個人情報保護の観点から、プロジェクトの詳細や数値目標など、公開できない情報は伏せる必要があります。\n' +
    '- 職務経歴は、直近のものから順に記載するのが一般的です。\n' +
    '\n' +
    '上記を踏まえて、不足している情報を加筆し、より魅力的な職務経歴書に改善してください。'
  }
   *********************************/

  //   const ai = genkit({
  //     plugins: [
  //       googleAI({
  //         apiKey: env.RESUME_GEMINI_API_KEY,
  //       }),
  //     ],
  //     // model: gemini20Flash,
  //     model: gemini20ProExp0205,
  //   });
  //
  //   const { text } = await ai.generate(`
  // Please make a resume from the following git diff.
  //
  // -----
  //
  // ${packedText}
  // `);
  //
  //   const { text: textJa } = await ai.generate(`
  // もし以下文章が英語の場合は、日本語のマークダウンに直してください.
  //
  // -----
  //
  // ${text}
  // `);
  //
  //   console.log(textJa);
};
