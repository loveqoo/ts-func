import {Monad} from './index';

export interface Lazy<A> extends Monad<A> {
  getValue(): A;

  pure(a: A): Lazy<A>;

  ap<B>(fab: Lazy<(a: A) => B>): Lazy<B>;

  ap<B, C>(fab1: Lazy<(a: A) => B>, fab2: Lazy<(b: B) => C>): Lazy<C>;

  ap<B, C, D>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>
  ): Lazy<D>;

  ap<B, C, D, E>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>,
    fab4: Lazy<(d: D) => E>
  ): Lazy<E>;

  ap<B, C, D, E, F>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>,
    fab4: Lazy<(d: D) => E>,
    fab5: Lazy<(e: E) => F>
  ): Lazy<F>;

  ap<B, C, D, E, F, G>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>,
    fab4: Lazy<(d: D) => E>,
    fab5: Lazy<(e: E) => F>,
    fab6: Lazy<(f: F) => G>
  ): Lazy<G>;

  ap<B, C, D, E, F, G, H>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>,
    fab4: Lazy<(d: D) => E>,
    fab5: Lazy<(e: E) => F>,
    fab6: Lazy<(f: F) => G>,
    fab7: Lazy<(g: G) => H>
  ): Lazy<H>;

  ap<B, C, D, E, F, G, H, I>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>,
    fab4: Lazy<(d: D) => E>,
    fab5: Lazy<(e: E) => F>,
    fab6: Lazy<(f: F) => G>,
    fab7: Lazy<(g: G) => H>,
    fab8: Lazy<(h: H) => I>
  ): Lazy<I>;

  ap<B, C, D, E, F, G, H, I, J>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>,
    fab4: Lazy<(d: D) => E>,
    fab5: Lazy<(e: E) => F>,
    fab6: Lazy<(f: F) => G>,
    fab7: Lazy<(g: G) => H>,
    fab8: Lazy<(h: H) => I>,
    fab9: Lazy<(i: I) => J>
  ): Lazy<J>;

  ap<B, C, D, E, F, G, H, I, J, K>(
    fab1: Lazy<(a: A) => B>,
    fab2: Lazy<(b: B) => C>,
    fab3: Lazy<(c: C) => D>,
    fab4: Lazy<(d: D) => E>,
    fab5: Lazy<(e: E) => F>,
    fab6: Lazy<(f: F) => G>,
    fab7: Lazy<(g: G) => H>,
    fab8: Lazy<(h: H) => I>,
    fab9: Lazy<(i: I) => J>,
    fab10: Lazy<(j: J) => K>
  ): Lazy<K>;

  map<B>(transform: (a: A) => B): Lazy<B>;

  map<B, C>(transform1: (a: A) => B, transform2: (a: B) => C): Lazy<C>;

  map<B, C, D>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D
  ): Lazy<D>;

  map<B, C, D, E>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E
  ): Lazy<E>;

  map<B, C, D, E, F>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F
  ): Lazy<F>;

  map<B, C, D, E, F, G>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G
  ): Lazy<G>;

  map<B, C, D, E, F, G, H>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H
  ): Lazy<H>;

  map<B, C, D, E, F, G, H, I>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H,
    transform8: (h: H) => I
  ): Lazy<I>;

  map<B, C, D, E, F, G, H, I, J>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H,
    transform8: (h: H) => I,
    transform9: (i: I) => J
  ): Lazy<J>;

  map<B, C, D, E, F, G, H, I, J, K>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H,
    transform8: (h: H) => I,
    transform9: (i: I) => J,
    transform10: (j: J) => K
  ): Lazy<K>;

  flatMap<B>(transform: (a: A) => Lazy<B>): Lazy<B>;

  flatMap<B, C>(
    transform1: (a: A) => Lazy<B>,
    transform2: (a: B) => Lazy<C>
  ): Lazy<C>;

  flatMap<B, C, D>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>
  ): Lazy<D>;

  flatMap<B, C, D, E>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>,
    transform4: (d: D) => Lazy<E>
  ): Lazy<E>;

  flatMap<B, C, D, E, F>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>,
    transform4: (d: D) => Lazy<E>,
    transform5: (e: E) => Lazy<F>
  ): Lazy<F>;

  flatMap<B, C, D, E, F, G>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>,
    transform4: (d: D) => Lazy<E>,
    transform5: (e: E) => Lazy<F>,
    transform6: (f: F) => Lazy<G>
  ): Lazy<G>;

  flatMap<B, C, D, E, F, G, H>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>,
    transform4: (d: D) => Lazy<E>,
    transform5: (e: E) => Lazy<F>,
    transform6: (f: F) => Lazy<G>,
    transform7: (g: G) => Lazy<H>
  ): Lazy<H>;

  flatMap<B, C, D, E, F, G, H, I>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>,
    transform4: (d: D) => Lazy<E>,
    transform5: (e: E) => Lazy<F>,
    transform6: (f: F) => Lazy<G>,
    transform7: (g: G) => Lazy<H>,
    transform8: (h: H) => Lazy<I>
  ): Lazy<I>;

  flatMap<B, C, D, E, F, G, H, I, J>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>,
    transform4: (d: D) => Lazy<E>,
    transform5: (e: E) => Lazy<F>,
    transform6: (f: F) => Lazy<G>,
    transform7: (g: G) => Lazy<H>,
    transform8: (h: H) => Lazy<I>,
    transform9: (i: I) => Lazy<J>
  ): Lazy<J>;

  flatMap<B, C, D, E, F, G, H, I, J, K>(
    transform1: (a: A) => Lazy<B>,
    transform2: (b: B) => Lazy<C>,
    transform3: (c: C) => Lazy<D>,
    transform4: (d: D) => Lazy<E>,
    transform5: (e: E) => Lazy<F>,
    transform6: (f: F) => Lazy<G>,
    transform7: (g: G) => Lazy<H>,
    transform8: (h: H) => Lazy<I>,
    transform9: (i: I) => Lazy<J>,
    transform10: (j: J) => Lazy<K>
  ): Lazy<K>;
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

  pure(a: A): Lazy<A> {
    return lazyOf(() => a);
  }

  ap<A, B>(fab: Lazy<(a: A) => B>): Lazy<B>;

  ap(...fab: Array<Lazy<(a: unknown) => unknown>>): Lazy<unknown> {
    const [first, ...others] = fab;
    return others.reduce(
      (lazy1, lazy2) =>
        lazy2.flatMap((f: (a: unknown) => unknown) => lazy1.map(f)),
      first.flatMap((f: (a: unknown) => unknown) => this.map(f))
    );
  }

  map<A, B>(transform: (a: A) => B): Lazy<B>;

  map(...transforms: Array<(a: unknown) => unknown>): Lazy<unknown> {
    const [first, ...others] = transforms;
    return others.reduce(
      (lazy, transform) => lazyOf(() => transform(lazy.getValue())),
      lazyOf(() => first(this.getValue()))
    );
  }

  flatMap<A, B>(transform: (a: A) => Lazy<B>): Lazy<B>;

  flatMap(...transforms: Array<(a: unknown) => Lazy<unknown>>): Lazy<unknown> {
    const [first, ...others] = transforms;
    return others.reduce(
      (lazy, transform) => lazyOf(() => transform(lazy.getValue()).getValue()),
      lazyOf(() => first(this.getValue()).getValue())
    );
  }
}

export const operations = {
  ap: <A, B>(lazyA: Lazy<A>, fab: Lazy<(a: A) => B>): Lazy<B> =>
    fab.flatMap((f: (a: A) => B) => lazyA.map(f)),
  map: <A, B>(lazyA: Lazy<A>, transform: (a: A) => B): Lazy<B> =>
    lazyOf<B>(() => transform(lazyA.getValue())),
  flatMap: <A, B>(lazyA: Lazy<A>, transform: (a: A) => Lazy<B>): Lazy<B> => {
    return lazyOf(() => transform(lazyA.getValue()).getValue());
  },
  lift: <A, B>(f: (a: A) => B): ((lazyA: Lazy<A>) => Lazy<B>) => (
    lazyA: Lazy<A>
  ) => lazyOf<B>(() => f(lazyA.getValue())),
  lift2: <A, B, C>(
    f: (a: A) => (b: B) => C
  ): ((lazyA: Lazy<A>) => (lazyB: Lazy<B>) => Lazy<C>) => (lazyA: Lazy<A>) => (
    lazyB: Lazy<B>
  ) => lazyOf<C>(() => f(lazyA.getValue())(lazyB.getValue())),
};

const lazyOf = <A>(f: () => A): Lazy<A> => new LazyImpl<A>(f);

export const Lazy = {
  pure: lazyOf,
  lift: operations.lift,
  lift2: operations.lift2,
};
