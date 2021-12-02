export const pipe = <T, S>(f: (t: T) => S) => <R>(g: (s: S) => R) => (x: T) => g(f(x))
export const combine = <S, R>(f: (s: S) => R) => <T>(g: (t: T) => S) => (x: T) => f(g(x))

const semigroup = <T>(f: (t1: T, t2: T) => T) => (t1: T, t2: T) => f(t1, t2)
const arraySemigroup = <T>(t1: Array<T>, t2: Array<T>) => t1.concat(t2)
const arrayValueSemigroup = <T>(f: (t1: T, t2: T) => T) => (array: Array<T>) => array.reduce((pr, cu) => f(pr, cu))

const numberSemigroup = semigroup<number>((t1, t2) => t1 + t2)
const stringSemigroup = semigroup<string>((t1, t2) => t1 + t2)
const booleanAndSemigroup = semigroup<boolean>((a, b) => a && b)
const booleanOrSemigroup = semigroup<boolean>((a, b) => a || b)

export const Semigroup = {
    of: semigroup,
    number: numberSemigroup,
    string: stringSemigroup,
    boolean: {
        and: booleanAndSemigroup,
        or: booleanOrSemigroup
    },
    array: arraySemigroup,
    arrayValueOf: arrayValueSemigroup,
    arrayNumber: arrayValueSemigroup<number>(numberSemigroup),
    arrayString: arrayValueSemigroup<string>(stringSemigroup),
}

const monoid = <T>(f: (t1: T, t2: T) => T, empty: T) => (t1: T, t2: T) => combine((t: T) => f(t, t1))((t: T) => f(t, t2))(empty)
const monoidCombine = <T>(f: (t1: T, t2: T) => T) => (empty: T) => monoid(f, empty)
const arrayMonoid = <T>(empty: Array<T> = []) => (t1: Array<T>, t2: Array<T>) => combine((t: Array<T>) => t.concat(t1))((t: Array<T>) => t.concat(t2))(empty)
const arrayValueMonoid = <T>(f: (t1: T, t2: T) => T, empty: T) => (array: Array<T>) => array.reduce((pr, cu) => f(pr, cu), empty)
const arrayValueMonoidCombine = <T>(f: (t1: T, t2: T) => T) => (empty: T) => arrayValueMonoid(f, empty)

const Monoid = {
    of: monoid,
    number: monoidCombine(numberSemigroup)(0),
    string: monoidCombine(stringSemigroup)(""),
    boolean: {
        and: monoidCombine(booleanAndSemigroup),
        or: monoidCombine(booleanOrSemigroup),
    },
    arrayOf: arrayMonoid,
    arrayValueOf: arrayValueMonoid,
    arrayNumber: arrayValueMonoidCombine<number>(numberSemigroup)(0),
    arrayString: arrayValueMonoidCombine<string>(stringSemigroup)("")
}

const Monad = (() => {

    // function pipe<T extends unknown[], A>(
    //     fnA: (...x: T) => A,
    // ): (...x: T) => A;
    // function pipe<T extends unknown[], A, B>(
    //     fnA: (...x: T) => A,
    //     fnB: (x: A) => B,
    // ): (...x: T) => B;
    // function pipe<T extends unknown[], A, B, C>(
    //     fnA: (...x: T) => A,
    //     fnB: (x: A) => B,
    //     fnC: (x: B) => C,
    // ): (...x: T) => C;
    // function pipe<T extends unknown[], A, B, C, D>(
    //     fnA: (...x: T) => A,
    //     fnB: (x: A) => B,
    //     fnC: (x: B) => C,
    //     fnD: (x: C) => D,
    // ): (...x: T) => D;
    // function pipe<T extends unknown[], A, B, C, D, E>(
    //     fnA: (...x: T) => A,
    //     fnB: (x: A) => B,
    //     fnC: (x: B) => C,
    //     fnD: (x: C) => D,
    //     fnE: (x: D) => E,
    // ): (...x: T) => E;
    // function pipe<T extends unknown[], A, B, C, D, E, F>(
    //     fnA: (...x: T) => A,
    //     fnB: (x: A) => B,
    //     fnC: (x: B) => C,
    //     fnD: (x: C) => D,
    //     fnE: (x: D) => E,
    //     fnF: (x: E) => F,
    // ): (...x: T) => F;
    // function pipe(...fns: Array<(...x: unknown[]) => unknown>) {
    //     return (...x: unknown[]) => {
    //         const [first, ...others] = fns;
    //         return others.reduce((val, fn) => fn(val), first(...x));
    //     };
    // }

    interface Success<T> {
        success: true;
        value: T;
    }

    interface Failure {
        success: false;
        err: string;
    }

    type Result<T> = Success<T> | Failure;

    // const success = <T>(value: T | (() => T)): Result<T> => {
    //     if (typeof value === "function") {
    //         try {
    //             return {success: true, value: (value as (() => T))()}
    //         } catch (e) {
    //             return failure(e.value)
    //         }
    //     } else {
    //         return success(value as T)
    //     }
    // }
    // const failure = <T>(err: string): Result<T> => ({success: false, err});
    //
    // const bind = <A, B>(f: (t: A) => Result<B>) => (result: Result<A>): Result<B> => {
    //     return result.success ? f(result.value) : result
    // }

    class Pipe<A, B> {
        constructor(readonly f: (a: A) => B) {
        }
        pipe<C>(f: (b: B) => C): Pipe<B, C> {
           return new Pipe((b: B) => f(b))
        }
        run(a: A): B {
            return this.f(a)
        }
        static of = <T, S>(f: (t: T) => S) => new Pipe<T, S>(f)
    }

    class Ref {
        _success = <T>(value: T): Result<T> => {
            return {success: true, value: value}
        }
        success = <T>(value: T | (() => T)): Result<T> => {
            if (typeof value === "function") {
                try {
                    return {success: true, value: (value as (() => T))()}
                } catch (e) {
                    return this.failure(e.value)
                }
            } else {
                return this._success(value as T)
            }
        }
        failure = <T>(err: string): Result<T> => ({success: false, err});
        bind = <A, B>(f: (t: A) => Result<B>) => (result: Result<A>): Result<B> => {
            return result.success ? f(result.value) : result
        }
        static of<T>(f: (ref: Ref) => T): T {
            return f(new Ref())
        }
        //static of = <T, S>(f: function(T): S) => Pipe.of(f)
    }

    const bb = Ref.of(($) => {
        return Pipe.of((t: number) => t.toString())
            .pipe(t => parseInt(t))
            .pipe(t => t * 2)
            .pipe(t => $.success(t))
            .pipe($.bind(t => $.success(t + 3)))
            .run($.success(3))
    })

    return {};
})()


