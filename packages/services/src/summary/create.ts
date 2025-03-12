import fs from "node:fs";
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import type { Pack } from "@resume/models";
import { genkit } from "genkit";

export const create = async (
  userName: string,
  pack: Pack,
  RESUME_GEMINI_API_KEY: string,
) => {
  const ai = genkit({
    plugins: [
      googleAI({
        apiKey: RESUME_GEMINI_API_KEY,
      }),
    ],
    model: gemini20Flash,
  });

  const prevSummaryFilePath = `generated/summaries/${userName}/${pack.meta.owner}/${pack.meta.repo}.md`;
  const prevSummaryFile = fs.existsSync(prevSummaryFilePath)
    ? fs.readFileSync(prevSummaryFilePath, "utf-8")
    : null;

  const { text } = await ai.generate({
    system: `以下の 2 Step で git のログからエンジニアのResumeを生成しようとしています。
- STEP1: リポジトリごとに対象エンジニアの git log と git show の結果を分析し、そのリポジトリについてのエンジニアのサマリを作成する(複数のリポジトリで一気に分析を行うとLLMのトークン制限に引っかかるため、リポジトリごとに分けて分析を行う)
- STEP2: STEP1で作成したリポジトリごとのサマリを元に、エンジニアのResumeを作成する

  あなたは上記の STEP1 の役割を担うプログラムで、以下の責務を持ちます。：

  1. エンジニアの能力や強みを出来るだけ魅力的に見えるように資料にまとめる
  2. 常に日本語で出力する
  3. 後続のSTEP2でなるべくエンジニアの経験や利用技術を漏れなく分析するための材料を提供するために、可能な限り利用されているライブラリやフレームワーク、推測される職務経験を詳細に書く
  4. frontmatterに以下の情報を記載する
    - owner: ${pack.meta.owner}
    - repo: ${pack.meta.repo}
    - period: git log に含まれたCommitの開始期間と終了期間 (yyyy-mm-dd - yyyy-mm-dd形式)
  5. 以下のセクションを含める
    - 概要: リポジトリ内のユーザの活動の概要
    - 使用技術: リポジトリ内でユーザが利用した技術とその熟練度を10段階でテーブルにまとめる
    - 職務経験: リポジトリ内のユーザの活動を職務経験化
    - アピールポイント: リポジトリ内のユーザの活動から、転職時にアピールできるポイントをまとめる
    - 補足事項: 分析に関する補足情報や注意事項、推測で記載した内容の注釈等
    - Changelog: 本資料の変更履歴を記載するセクション。過去に出力した資料と差分がある場合は変更内容を記載すること。フォーマットはyyyy-mm-dd(マークダウンの生成または更新日時): 変更内容としてください
 ${
   !prevSummaryFile
     ? ""
     : `
 6. 今回出力したマークダウンは過去に出力済みの以下内容に対して差分をCommitする予定です。経歴面の追加等の実質的な変更がない場合は git の差分が出てしまい人間が確認するとき混乱しないように過去分と全く同じ内容を出力してください。逆に重要な変更がある場合は、Changelog のセクションに追加変更内容(変更差分の要約)をまとめてください。(意味のない変更履歴は追加しないでください)
=====
${prevSummaryFile.toString()} 
 `
 }
  `,
    prompt: `以下の git show の結果からSTEP1の資料を作成しマークダウン形式で出力してください。

  -----

  ${pack.body}
  `,
  });

  const summaryDir = `./generated/summaries/${userName}/${pack.meta.owner}`;
  fs.mkdirSync(summaryDir, { recursive: true });
  fs.writeFileSync(
    `${summaryDir}/${pack.meta.repo}.md`,
    text
      .replace("```markdown", "")
      .replace("```", "") // マークダウン用のコードブロックで全体が括られる場合があるので削除
      .trim(),
    "utf8",
  );
};
