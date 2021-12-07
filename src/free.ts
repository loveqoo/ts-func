export interface Compiler<P, T> {
  compile(f: P): (...args: unknown[]) => T;
}

/**
 * 사용자의 입력을 받으면 주입된 컴파일러를 생성하고 실행해준다.
 * @param supplier  컴파일러를 생성하는 함수
 */
export const compiler = <P, A>(
  supplier: (context?: unknown) => Compiler<P, A>
) => (program: P, context?: unknown) => (...args: unknown[]) =>
  supplier(context).compile(program)(...args);
