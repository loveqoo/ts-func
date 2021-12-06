export interface Compiler<FREE_FLATMAP, T> {
  context?: unknown;

  prepare(f: FREE_FLATMAP): FREE_FLATMAP;

  compile(f: FREE_FLATMAP): (...args: unknown[]) => T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FreeTrampolineFlatMap<R> = (...args: any[]) => FreeTrampoline<R>;
export type Suspend<A> = {f: FreeTrampolineFlatMap<A>};
export type Done<A> = {value: A};
export type FreeTrampoline<A> = Suspend<A> | Done<A>;

export const isDone = <A>(free: FreeTrampoline<A>): free is Done<A> =>
  'value' in free;
export const suspend = <A>(f: FreeTrampolineFlatMap<A>): FreeTrampoline<A> => ({
  f,
});
export const done = <A>(value: A): FreeTrampoline<A> => ({value});

class Trampoline<T> implements Compiler<FreeTrampolineFlatMap<T>, T> {
  constructor(readonly context: unknown) {}

  prepare(f: FreeTrampolineFlatMap<T>): FreeTrampolineFlatMap<T> {
    return this.context ? f.bind(this.context) : f;
  }

  compile(f: FreeTrampolineFlatMap<T>): (...args: unknown[]) => T {
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
 * 사용자의 입력을 받으면 주입된 컴파일러를 생성하고 실행해준다.
 * @param supplier  컴파일러를 생성하는 함수
 */
export const compiler = <FLATMAP, A>(
  supplier: (context?: unknown) => Compiler<FLATMAP, A>
) => (program: FLATMAP, context?: unknown) => (...args: unknown[]) =>
  supplier(context).compile(program)(...args);

/**
 *
 * @param program 스택을 소비하는 재귀함수를 사용하는 함수
 * @param context 함수에 사용할 컨텍스트
 */
export const trampoline = <A>(
  program: FreeTrampolineFlatMap<A>,
  context?: unknown
) =>
  compiler((context?: unknown) => new Trampoline<A>(context))(program, context);
