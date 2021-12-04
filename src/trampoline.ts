import {frozen, sealed} from './decorators';

// eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars
export interface Trampoline<A> {}

const trampolineOps = (() => {
  @sealed
  @frozen
  class Done<A> implements Trampoline<A> {
    constructor(readonly a: A) {}
  }

  @sealed
  @frozen
  class Suspend<A> implements Trampoline<A> {
    constructor(readonly supplier: () => Trampoline<A>) {}
  }

  const done = <A>(value: A): Trampoline<A> => new Done(value);
  const suspend = <A>(supplier: () => Trampoline<A>): Trampoline<A> =>
    new Suspend(supplier);

  const builder = <A>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    f: (...args: any[]) => Trampoline<A>,
    context?: unknown
  ) => {
    const tryBind = (supplier: (...args: unknown[]) => Trampoline<A>) =>
      context ? supplier.bind(context) : supplier;
    return (...args: unknown[]): A => {
      let result: Trampoline<unknown> = tryBind(f)(...args);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (result instanceof Suspend) {
          result = tryBind(result.supplier)();
        } else if (result instanceof Done) {
          return result.a;
        }
      }
    };
  };
  return {
    done: done,
    suspend: suspend,
    builder: builder,
  };
})();
/**
 * 트램폴린을 시작한다.
 */
export const trampolineOf = trampolineOps.builder;
/**
 * 트램폴린을 완료하고 결과를 리턴한다.
 */
export const done = trampolineOps.done;
/**
 * 트랜폴린을 재개한다.
 */
export const suspend = trampolineOps.suspend;
