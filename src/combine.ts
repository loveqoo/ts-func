import {ImmutableList} from './list';

export const pipe = <T, S>(f: (t: T) => S) => <R>(g: (s: S) => R) => (x: T) =>
  g(f(x));
export const combine = <S, R>(f: (s: S) => R) => <T>(g: (t: T) => S) => (
  x: T
) => f(g(x));

const semigroup = <T>(f: (t1: T, t2: T) => T) => (t1: T, t2: T) => f(t1, t2);
const numberSemigroup = semigroup<number>((t1, t2) => t1 + t2);
const stringSemigroup = semigroup<string>((t1, t2) => t1 + t2);
const booleanAndSemigroup = semigroup<boolean>((a, b) => a && b);
const booleanOrSemigroup = semigroup<boolean>((a, b) => a || b);
const arraySemigroup = <T>(t1: Array<T>, t2: Array<T>) => t1.concat(t2);
const arrayValueSemigroup = <T>(f: (t1: T, t2: T) => T) => (array: Array<T>) =>
  array.reduce((pr, cu) => f(pr, cu));
const immutableListSemigroup = <T>(
  t1: ImmutableList<T>,
  t2: ImmutableList<T>
) => t1.concat(t2);

/**
 * 알고 있는 두 타입을 결합하는 방법을 정의한다.
 */
export const Semigroup = {
  /**
   * 두 타입을 결합한다.
   */
  of: semigroup,
  /**
   * 두 숫자를 결합한다.
   */
  number: numberSemigroup,
  /**
   * 두 문자열을 결합한다.
   */
  string: stringSemigroup,
  boolean: {
    /**
     * 두 불리언 값을 `&&` 연산으로 결합한다.
     */
    and: booleanAndSemigroup,
    /**
     * 두 불리언 값을 `||` 연산으로 결합한다.
     */
    or: booleanOrSemigroup,
  },
  /**
   * 두 배열을 결합한다.
   */
  array: arraySemigroup,
  /**
   * 배열의 값을 결합한다.
   */
  arrayValueOf: arrayValueSemigroup,
  /**
   * 숫자 배열의 값을 결합한다.
   */
  arrayNumber: arrayValueSemigroup<number>(numberSemigroup),
  /**
   * 문자열 배열의 값을 결합한다.
   */
  arrayString: arrayValueSemigroup<string>(stringSemigroup),
  /**
   * 두 불변 리스트를 결합한다.
   */
  immutableListOf: immutableListSemigroup,
};

const monoid = <T>(f: (t1: T, t2: T) => T, empty: T) => (t1: T, t2: T) =>
  combine((t: T) => f(t, t1))((t: T) => f(t, t2))(empty);
const monoidCombine = <T>(f: (t1: T, t2: T) => T) => (empty: T) =>
  monoid(f, empty);
const arrayMonoid = <T>(empty: Array<T> = []) => (t1: Array<T>, t2: Array<T>) =>
  combine((t: Array<T>) => t.concat(t1))((t: Array<T>) => t.concat(t2))(empty);
const arrayValueMonoid = <T>(f: (t1: T, t2: T) => T, empty: T) => (
  array: Array<T>
) => array.reduce((pr, cu) => f(pr, cu), empty);
const arrayValueMonoidCombine = <T>(f: (t1: T, t2: T) => T) => (empty: T) =>
  arrayValueMonoid(f, empty);
const immutableListValueMonoid = <T>(f: (t1: T, t2: T) => T) => (empty: T) => (
  list: ImmutableList<T>
) => list.foldLeft(empty, t1 => t2 => f(t1, t2));

/**
 * 알고 있는 두 타입의 항등원을 포함하여 결합하는 방법을 정의한다.
 */
export const Monoid = {
  of: monoid,
  number: monoidCombine(numberSemigroup)(0),
  string: monoidCombine(stringSemigroup)(''),
  boolean: {
    and: monoidCombine(booleanAndSemigroup),
    or: monoidCombine(booleanOrSemigroup),
  },
  arrayOf: arrayMonoid,
  arrayValueOf: arrayValueMonoid,
  arrayNumber: arrayValueMonoidCombine<number>(numberSemigroup)(0),
  arrayString: arrayValueMonoidCombine<string>(stringSemigroup)(''),
  immutableListOf: immutableListValueMonoid,
  immutableListNumber: immutableListValueMonoid<number>(numberSemigroup)(0),
  immutableListString: immutableListValueMonoid<string>(stringSemigroup)(''),
};
