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
