import {frozen, sealed} from './decorators';
import {isValid, Monad, MonadOp} from './index';

export interface Option<A> extends Monad<A>, MonadOp<A> {
  pure(a: A): Option<A>;

  ap<B>(fab: Option<(a: A) => B>): Option<B>;

  ap<B, C>(fab1: Option<(a: A) => B>, fab2: Option<(b: B) => C>): Option<C>;

  ap<B, C, D>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>
  ): Option<D>;

  ap<B, C, D, E>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>,
    fab4: Option<(d: D) => E>
  ): Option<E>;

  ap<B, C, D, E, F>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>,
    fab4: Option<(d: D) => E>,
    fab5: Option<(e: E) => F>
  ): Option<F>;

  ap<B, C, D, E, F, G>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>,
    fab4: Option<(d: D) => E>,
    fab5: Option<(e: E) => F>,
    fab6: Option<(f: F) => G>
  ): Option<G>;

  ap<B, C, D, E, F, G, H>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>,
    fab4: Option<(d: D) => E>,
    fab5: Option<(e: E) => F>,
    fab6: Option<(f: F) => G>,
    fab7: Option<(g: G) => H>
  ): Option<H>;

  ap<B, C, D, E, F, G, H, I>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>,
    fab4: Option<(d: D) => E>,
    fab5: Option<(e: E) => F>,
    fab6: Option<(f: F) => G>,
    fab7: Option<(g: G) => H>,
    fab8: Option<(h: H) => I>
  ): Option<I>;

  ap<B, C, D, E, F, G, H, I, J>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>,
    fab4: Option<(d: D) => E>,
    fab5: Option<(e: E) => F>,
    fab6: Option<(f: F) => G>,
    fab7: Option<(g: G) => H>,
    fab8: Option<(h: H) => I>,
    fab9: Option<(i: I) => J>
  ): Option<J>;

  ap<B, C, D, E, F, G, H, I, J, K>(
    fab1: Option<(a: A) => B>,
    fab2: Option<(b: B) => C>,
    fab3: Option<(c: C) => D>,
    fab4: Option<(d: D) => E>,
    fab5: Option<(e: E) => F>,
    fab6: Option<(f: F) => G>,
    fab7: Option<(g: G) => H>,
    fab8: Option<(h: H) => I>,
    fab9: Option<(i: I) => J>,
    fab10: Option<(j: J) => K>
  ): Option<K>;

  map<B>(transform: (a: A) => B): Option<B>;

  combine(other: Option<A>, sga: (a1: A, a2: A) => A): Option<A>;

  map<B, C>(transform1: (a: A) => B, transform2: (a: B) => C): Option<C>;

  map<B, C, D>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D
  ): Option<D>;

  map<B, C, D, E>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E
  ): Option<E>;

  map<B, C, D, E, F>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F
  ): Option<F>;

  map<B, C, D, E, F, G>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G
  ): Option<G>;

  map<B, C, D, E, F, G, H>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H
  ): Option<H>;

  map<B, C, D, E, F, G, H, I>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H,
    transform8: (h: H) => I
  ): Option<I>;

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
  ): Option<J>;

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
  ): Option<K>;

  flatMap<B>(transform: (a: A) => Option<B>): Option<B>;

  flatMap<B, C>(
    transform1: (a: A) => Option<B>,
    transform2: (a: B) => Option<C>
  ): Option<C>;

  flatMap<B, C, D>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>
  ): Option<D>;

  flatMap<B, C, D, E>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>,
    transform4: (d: D) => Option<E>
  ): Option<E>;

  flatMap<B, C, D, E, F>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>,
    transform4: (d: D) => Option<E>,
    transform5: (e: E) => Option<F>
  ): Option<F>;

  flatMap<B, C, D, E, F, G>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>,
    transform4: (d: D) => Option<E>,
    transform5: (e: E) => Option<F>,
    transform6: (f: F) => Option<G>
  ): Option<G>;

  flatMap<B, C, D, E, F, G, H>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>,
    transform4: (d: D) => Option<E>,
    transform5: (e: E) => Option<F>,
    transform6: (f: F) => Option<G>,
    transform7: (g: G) => Option<H>
  ): Option<H>;

  flatMap<B, C, D, E, F, G, H, I>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>,
    transform4: (d: D) => Option<E>,
    transform5: (e: E) => Option<F>,
    transform6: (f: F) => Option<G>,
    transform7: (g: G) => Option<H>,
    transform8: (h: H) => Option<I>
  ): Option<I>;

  flatMap<B, C, D, E, F, G, H, I, J>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>,
    transform4: (d: D) => Option<E>,
    transform5: (e: E) => Option<F>,
    transform6: (f: F) => Option<G>,
    transform7: (g: G) => Option<H>,
    transform8: (h: H) => Option<I>,
    transform9: (i: I) => Option<J>
  ): Option<J>;

  flatMap<B, C, D, E, F, G, H, I, J, K>(
    transform1: (a: A) => Option<B>,
    transform2: (b: B) => Option<C>,
    transform3: (c: C) => Option<D>,
    transform4: (d: D) => Option<E>,
    transform5: (e: E) => Option<F>,
    transform6: (f: F) => Option<G>,
    transform7: (g: G) => Option<H>,
    transform8: (h: H) => Option<I>,
    transform9: (i: I) => Option<J>,
    transform10: (j: J) => Option<K>
  ): Option<K>;

  getOrElse(defaultValue: A): A;

  filter(predicate: (a: A) => boolean): Option<A>;

  orElse(supplier: () => Option<A>): Option<A>;
}

abstract class AbstractOption<A> implements Option<A> {
  abstract isEmpty(): boolean;

  pure(a: A): Option<A> {
    return optionOf(a);
  }

  ap<A, B>(fab: Option<(a: A) => B>): Option<B>;

  ap(...fab: Array<Option<(a: unknown) => unknown>>): Option<unknown> {
    const [first, ...others] = fab;
    return others.reduce(
      (option1, option2) =>
        option2.flatMap((f: (a: unknown) => unknown) => option1.map(f)),
      first.flatMap((f: (a: unknown) => unknown) => this.map(f))
    );
  }

  map<A, B>(transform: (a: A) => B): Option<B>;

  map(...transforms: Array<(a: unknown) => unknown>): Option<unknown> {
    const [first, ...others] = transforms;
    const inner = (
      option: Option<unknown>,
      transform: (a: unknown) => unknown
    ): Option<unknown> => {
      return match<unknown>(option)<Option<unknown>>(
        some => {
          const newValue = execute<unknown, unknown>(transform, some.value);
          return optionOf<unknown>(newValue!);
        },
        () => noneOf<unknown>()
      );
    };
    return others.reduce(
      (option, transform) => inner(option, transform),
      inner(this as Option<unknown>, first)
    );
  }

  abstract combine(other: Option<A>, sg: (a1: A, a2: A) => A): Option<A>;

  flatMap<A, B>(transform: (a: A) => Option<B>): Option<B>;

  flatMap(
    ...transforms: Array<(a: unknown) => Option<unknown>>
  ): Option<unknown> {
    const [first, ...others] = transforms;
    return others.reduce(
      (option, transform) => option.map(transform).getOrElse(noneOf()),
      this.map(first).getOrElse(noneOf())
    );
  }

  getOrElse(defaultValue: A): A {
    return match<A>(this)<A>(
      some => some.value,
      () => defaultValue
    );
  }

  filter(predicate: (a: A) => boolean): Option<A> {
    return this.flatMap<A, A>(a => (predicate(a) ? this : noneOf<A>()));
  }

  orElse(supplier: () => Option<A>): Option<A> {
    return match<A>(this)<Option<A>>(
      some => some,
      () => supplier()
    );
  }
}

@sealed
@frozen
class Some<A> extends AbstractOption<A> {
  constructor(readonly value: A) {
    super();
  }

  isEmpty(): boolean {
    return false;
  }

  combine(other: Option<A>, sg: (a1: A, a2: A) => A): Option<A> {
    if (other instanceof Some) {
      return someOf(sg(this.value, (other as Some<A>).value));
    } else {
      return other;
    }
  }
}

@sealed
@frozen
class None<A> extends AbstractOption<A> {
  constructor() {
    super();
  }

  isEmpty(): boolean {
    return true;
  }

  combine(other: Option<A>, sg: (a1: A, a2: A) => A): Option<A> {
    return this;
  }
}

const match = <A>(option: Option<A>) => <T>(
  someCallback: (some: Some<A>) => T,
  noneCallback: (none: None<A>) => T
): T => {
  if (option instanceof Some) {
    return someCallback(option as Some<A>);
  } else if (option instanceof None) {
    return noneCallback(option as None<A>);
  } else {
    throw new Error('Option 타입의 인스턴스가 아님');
  }
};

const execute = <A, B>(f: (a: A) => B, value: A) => {
  try {
    return f(value);
  } catch (e) {
    console.error(e);
    return null;
  }
};

const operations = {
  lift: <A, B>(f: (a: A) => B): ((a: Option<A>) => Option<B>) => (
    a: Option<A>
  ) => a.map(f),
};

const optionOf = <A>(value: A, f: (a: A) => boolean = isValid): Option<A> =>
  f(value) ? someOf<A>(value) : noneOf<A>();

const someOf = <A>(value: A): Option<A> => new Some<A>(value);
const noneOf = <A>(): Option<A> => new None<A>();

export const Option = {
  Some: optionOf,
  None: noneOf,
  pure: optionOf,
  lift: operations.lift,
};
