import {ImmutableList, immutableListFrom} from './list';

export interface Functor<A> {
  map<B>(transform: (a: A) => B): Functor<B>;
}

export interface Applicative<A> extends Functor<A> {
  pure(a: A): Applicative<A>;

  ap<B>(fab: Applicative<(a: A) => B>): Applicative<B>;
}

export interface Monad<A> extends Applicative<A> {
  flatMap<B>(f: (a: A) => Monad<B>): Monad<B>;
}

export interface MonadOp<A> {
  filter(p: (a: A) => boolean): Monad<A>;

  getOrElse(supplier: () => A): A;

  orElse(supplier: () => Monad<A>): Monad<A>;
}

export const pipe = <T, S>(f: (t: T) => S) => <R>(g: (s: S) => R) => (x: T) =>
  g(f(x));
export const combine = <S, R>(f: (s: S) => R) => <T>(g: (t: T) => S) => (
  x: T
) => f(g(x));

export type SemigroupOperation<T> = (t1: T) => (t2: T) => T;

const arraySemigroupBuilder = <T>(): SemigroupOperation<Array<T>> => (
  t1: Array<T>
) => (t2: Array<T>) => t1.concat(t2);

export const Semigroup = {
  number: (t1 => t2 => t1 + t2) as SemigroupOperation<number>,
  string: (t1 => t2 => t1 + t2) as SemigroupOperation<string>,
  booleanAnd: (t1 => t2 => t1 && t2) as SemigroupOperation<boolean>,
  booleanOr: (t1 => t2 => t1 || t2) as SemigroupOperation<boolean>,
  array: arraySemigroupBuilder,
  arrayNumber: arraySemigroupBuilder<number>(),
  arrayString: arraySemigroupBuilder<string>(),
  immutableList: <T>(): SemigroupOperation<ImmutableList<T>> => (
    t1: ImmutableList<T>
  ) => (t2: ImmutableList<T>) => t1.concat(t2),
};

/**
 * 알고 있는 두 타입의 항등원을 포함하여 결합하는 방법을 정의한다.
 */
export type MonoidOperation<T> = {
  zero: T;
  op: SemigroupOperation<T>;
};

export const Zero = {
  string: '',
  number: 0,
  booleanAnd: true,
  booleanOr: false,
  array: <T>() => [] as Array<T>,
  immutableList: <T>() => immutableListFrom([] as Array<T>),
};

const monoidBuilder = <T>(
  semigroup: SemigroupOperation<T>,
  zero: T
): MonoidOperation<T> => ({
  zero: zero,
  op: semigroup,
});

export const Monoid = {
  number: monoidBuilder(Semigroup.number, Zero.number),
  string: monoidBuilder(Semigroup.string, Zero.string),
  booleanAnd: monoidBuilder(Semigroup.booleanAnd, Zero.booleanAnd),
  booleanOr: monoidBuilder(Semigroup.booleanOr, Zero.booleanOr),
  array: <T>(): MonoidOperation<Array<T>> => ({
    zero: Zero.array<T>(),
    op: Semigroup.array<T>(),
  }),
  immutableList: <T>(): MonoidOperation<ImmutableList<T>> => ({
    zero: Zero.immutableList<T>(),
    op: Semigroup.immutableList<T>(),
  }),
};

const combineArray = <T>(monoid: MonoidOperation<T>) => (array: Array<T>): T =>
  array.reduce(
    (previousValue, currentValue) => monoid.op(previousValue)(currentValue),
    monoid.zero
  );
const combineImmutableList = <T>(monoid: MonoidOperation<T>) => (
  list: ImmutableList<T>
): T => list.foldLeft(monoid.zero, monoid.op);
const combineArgs = <T>(monoid: MonoidOperation<T>) => (...arg: Array<T>): T =>
  combineArray(monoid)(arg);

export const Combine = {
  array: combineArray,
  immutableList: combineImmutableList,
  args: combineArgs,
  arrayNumber: combineArray(Monoid.number),
  arrayString: combineArray(Monoid.string),
  immutableNumber: combineImmutableList(Monoid.number),
  immutableString: combineImmutableList(Monoid.string),
  argsNumber: combineArgs(Monoid.number),
  argsString: combineArgs(Monoid.string),
};

export const isValid = (value: unknown) =>
  value === null ? false : typeof value !== 'undefined';

export type Type =
  | 'undefined'
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'bigint'
  | 'function'
  | 'null'
  | 'array'
  | 'object';

export const typeOf = (a: unknown): Type => {
  switch (typeof a) {
    case 'undefined':
      return 'undefined';
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'symbol':
      return 'symbol';
    case 'bigint':
      return 'bigint';
    case 'function':
      return 'function';
    default: {
      if (a === null) {
        return 'null';
      }
      if (Array.isArray(a)) {
        return 'array';
      }
      return 'object';
    }
  }
};
