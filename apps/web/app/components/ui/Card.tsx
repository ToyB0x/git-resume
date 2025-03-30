import type { ReactNode } from "react";

export interface CardProps {
  /**
   * 追加のクラス名
   */
  className?: string;
  /**
   * カードの内容
   */
  children: ReactNode;
  /**
   * パディングサイズ（p-6, p-8など）
   * デフォルトは p-6
   */
  padding?: string;
  /**
   * 下部マージン（mb-6, mb-8など）
   * 指定しない場合はマージンなし
   */
  marginBottom?: string;
  /**
   * テキスト配置（text-center, text-leftなど）
   */
  textAlign?: string;
  /**
   * 最大幅（max-w-md, max-w-lgなど）
   */
  maxWidth?: string;
  /**
   * 幅（w-full, w-autoなど）
   */
  width?: string;
}

/**
 * ガラスモーフィズム風のカードコンポーネント
 */
export function Card({
  className = "",
  children,
  padding = "p-6",
  marginBottom = "",
  textAlign = "",
  maxWidth = "",
  width = "",
}: CardProps) {
  // 基本クラス名
  const baseClassName = "glass rounded-xl border border-gray-800 shadow-xl";

  // 追加のクラス名を結合
  const combinedClassName = [
    baseClassName,
    padding,
    marginBottom,
    textAlign,
    maxWidth,
    width,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={combinedClassName}>{children}</div>;
}
