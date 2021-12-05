// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FreeFlatMap<R> = (...args: any[]) => Free<R>;
export type Suspend<A> = {f: FreeFlatMap<A>};
export type Done<A> = {value: A};
export type Free<A> = Suspend<A> | Done<A>;

const isDone = <A>(free: Free<A>): free is Done<A> => 'value' in free;
export const suspend = <A>(f: FreeFlatMap<A>): Free<A> => ({f});
export const done = <A>(value: A): Free<A> => ({value});

export interface Compiler<T> {
  context?: unknown;

  onSuspend(f: FreeFlatMap<T>): FreeFlatMap<T>;

  compile(f: FreeFlatMap<T>): (...args: unknown[]) => T;
}

class Trampoline<T> implements Compiler<T> {
  constructor(readonly context: unknown) {}

  onSuspend(f: FreeFlatMap<T>): FreeFlatMap<T> {
    return this.context ? f.bind(this.context) : f;
  }

  compile(f: FreeFlatMap<T>): (...args: unknown[]) => T {
    return (...args: unknown[]) => {
      let r = this.onSuspend(f)(...args);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (isDone(r)) {
          return r.value;
        } else {
          r = this.onSuspend(r.f)();
        }
      }
    };
  }
}

const compiler = <A>(supplier: (context?: unknown) => Compiler<A>) => (
  program: FreeFlatMap<A>,
  context?: unknown
) => (...args: unknown[]) => supplier(context).compile(program)(...args);

export const trampoline = <A>(program: FreeFlatMap<A>, context?: unknown) =>
  compiler((context?: unknown) => new Trampoline<A>(context))(program, context);
