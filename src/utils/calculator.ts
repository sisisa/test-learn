/**
 * calculator.ts — 単体テスト学習用の純粋関数モジュール
 *
 * このモジュールには四則演算と入力バリデーションを含む関数を定義しています。
 * テストでは正常系・異常系・境界値を検証します。
 */

/**
 * 2つの数値を足す
 */
export function add(a: number, b: number): number {
  return a + b
}

/**
 * 2つの数値を引く
 */
export function subtract(a: number, b: number): number {
  return a - b
}

/**
 * 2つの数値を掛ける
 */
export function multiply(a: number, b: number): number {
  return a * b
}

/**
 * 2つの数値を割る
 * @throws {Error} 0で割ろうとした場合
 */
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('0で割ることはできません')
  }
  return a / b
}

/**
 * 数値が正の整数かどうかを検証する
 */
export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

/**
 * 配列の合計を計算する
 * @throws {Error} 空の配列の場合
 */
export function sum(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('空の配列は許可されていません')
  }
  return numbers.reduce((acc, curr) => acc + curr, 0)
}

/**
 * 配列の平均を計算する
 * @throws {Error} 空の配列の場合
 */
export function average(numbers: number[]): number {
  return sum(numbers) / numbers.length
}
