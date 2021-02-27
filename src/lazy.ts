import {Monad} from './index';

export interface Lazy<A> extends Monad<A> {
  getValue(): A;

  map<B>(transform: (a: A) => B): Lazy<B>;

  pure(a: A): Lazy<A>;

  ap<B>(fab: Lazy<(a: A) => B>): Lazy<B>;

  flatMap<B>(f: (a: A) => Lazy<B>): Lazy<B>;
}

class LazyImpl<A> implements Lazy<A> {
  called = false;
  value: A | undefined;

  constructor(readonly f: () => A) {}

  getValue(): A {
    if (this.called) {
      return this.value!;
    } else {
      this.value = this.f();
      this.called = true;
      return this.value!;
    }
  }

  map<B>(transform: (a: A) => B): Lazy<B> {
    return lazyOperations.map(this, transform);
  }

  flatMap<B>(transform: (a: A) => Lazy<B>): Lazy<B> {
    return lazyOperations.flatMap(this, transform);
  }

  pure(a: A): Lazy<A> {
    return lazyOf(() => a);
  }

  ap<B>(fab: Lazy<(a: A) => B>): Lazy<B> {
    return lazyOperations.ap(this, fab);
  }
}

export const lazyOperations = {
  ap: <A, B>(lazyA: Lazy<A>, fab: Lazy<(a: A) => B>): Lazy<B> =>
    fab.flatMap((f: (a: A) => B) => lazyA.map(f)),
  map: <A, B>(lazyA: Lazy<A>, transform: (a: A) => B): Lazy<B> =>
    lazyOf<B>(() => transform(lazyA.getValue())),
  flatMap: <A, B>(lazyA: Lazy<A>, transform: (a: A) => Lazy<B>): Lazy<B> => {
    return lazyOf(() => transform(lazyA.getValue()).getValue());
  },
  lift2: <A, B, C>(
    f: (a: A) => (b: B) => C
  ): ((lazyA: Lazy<A>) => (lazyB: Lazy<B>) => Lazy<C>) => (lazyA: Lazy<A>) => (
    lazyB: Lazy<B>
  ) => lazyOf<C>(() => f(lazyA.getValue())(lazyB.getValue())),
};

export const lazyOf = <A>(f: () => A): Lazy<A> => new LazyImpl<A>(f);
