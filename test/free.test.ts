import {done, FreeTrampoline, suspend, trampoline} from '../src/free';

describe('Free Test', () => {
  test('Trampoline - Sum', () => {
    const sum = (n: number): FreeTrampoline<number> => {
      const inner = (a: number, result = 0): FreeTrampoline<number> =>
        a
          ? suspend(() => {
              return inner(a - 1, result + a);
            })
          : done(result);
      return inner(n);
    };
    expect(trampoline(sum)(10)).toBe(55);
  });
  test('Trampoline - Fibonacci', () => {
    const oldFibonacciProgram = (n: number): number => {
      const f = (a: number, b: number, count: number): number => {
        return count === n ? a + b : f(b, a + b, count + 1);
      };
      return f(0, 1, 0);
    };
    expect(() => oldFibonacciProgram(10000)).toThrow(
      'Maximum call stack size exceeded'
    );
    const fibonacciProgram = (n: number): FreeTrampoline<number> => {
      const f = (
        a: number,
        b: number,
        count: number
      ): FreeTrampoline<number> => {
        return count === n
          ? done(a + b)
          : suspend(() => f(b, a + b, count + 1));
      };
      return f(0, 1, 0);
    };
    expect(trampoline(fibonacciProgram)(10000)).toBe(Infinity);
  });
});
