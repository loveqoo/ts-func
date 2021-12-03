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