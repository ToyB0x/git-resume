import { sleep } from "./sleep";

export const retry = async <T>({
  fn,
  timingSeconds,
}: {
  fn: () => Promise<T>;
  timingSeconds: number[]; // [2, 4, 8, 16, 32] // 指数バックオフしたい場合(AI のRATE Limitなどで単に指数バックオフ以上の分数指定したい場合があるので利用側でリトライ感覚を指定)
}): Promise<T> => {
  let count = 0;

  while (count < timingSeconds.length) {
    try {
      return await fn();
    } catch (e) {
      count += 1;
      console.error("retry ERROR:", { count }, e);

      const delaySec = timingSeconds[count];
      if (!delaySec) throw new Error("retries delaySec is undefined");
      await sleep(delaySec * 1000);
    }
  }

  throw Error("retries exceeded");
};
