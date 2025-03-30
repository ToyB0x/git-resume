import { sleep } from "./sleep";

export const retry = async ({
  fn,
  timingSeconds,
}: {
  fn: () => Promise<void>;
  timingSeconds: number[]; // [2, 4, 8, 16, 32] // 指数バックオフしたい場合(AI のRATE Limitなどで単に指数バックオフ以上の分数指定したい場合があるので利用側でリトライ感覚を指定)
}) => {
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
};
