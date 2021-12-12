import {compiler, Compiler} from './free';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TrampolineProgram<R> = (...args: any[]) => Trampoline<R>;
export type Suspend<A> = {f: TrampolineProgram<A>};
export type Done<A> = {value: A};
export type Trampoline<A> = Suspend<A> | Done<A>;

export const isDone = <A>(free: Trampoline<A>): free is Done<A> =>
  'value' in free;
export const suspend = <A>(f: TrampolineProgram<A>): Trampoline<A> => ({
  f,
});
export const done = <A>(value: A): Trampoline<A> => ({value});

class TrampolineCompiler<T> implements Compiler<TrampolineProgram<T>, T> {
  constructor(readonly context: unknown) {}

  prepare(f: TrampolineProgram<T>): TrampolineProgram<T> {
    return this.context ? f.bind(this.context) : f;
  }

  compile(f: TrampolineProgram<T>): (...args: unknown[]) => T {
    return (...args: unknown[]) => {
      let r = this.prepare(f)(...args);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (isDone(r)) {
          return r.value;
        } else {
          r = this.prepare(r.f)();
        }
      }
    };
  }
}

/**
 *
 * @param program 스택을 소비하는 재귀함수를 사용하는 함수
 * @param context 함수에 사용할 컨텍스트
 */
export const trampoline = <A>(
  program: TrampolineProgram<A>,
  context?: unknown
) =>
  compiler((context?: unknown) => new TrampolineCompiler<A>(context))(
    program,
    context
  );
