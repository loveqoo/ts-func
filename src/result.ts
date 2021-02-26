import {isValid, Monad, MonadOp} from './index';
import {frozen, sealed} from './decorators';

export interface Result<A> extends Monad<A>, MonadOp<A> {
  pure(a: A): Result<A>;

  ap<B>(fab: Result<(a: A) => B>): Result<B>;

  ap<B, C>(fab1: Result<(a: A) => B>, fab2: Result<(b: B) => C>): Result<C>;

  ap<B, C, D>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>
  ): Result<D>;

  ap<B, C, D, E>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>,
    fab4: Result<(d: D) => E>
  ): Result<E>;

  ap<B, C, D, E, F>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>,
    fab4: Result<(d: D) => E>,
    fab5: Result<(e: E) => F>
  ): Result<F>;

  ap<B, C, D, E, F, G>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>,
    fab4: Result<(d: D) => E>,
    fab5: Result<(e: E) => F>,
    fab6: Result<(f: F) => G>
  ): Result<G>;

  ap<B, C, D, E, F, G, H>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>,
    fab4: Result<(d: D) => E>,
    fab5: Result<(e: E) => F>,
    fab6: Result<(f: F) => G>,
    fab7: Result<(g: G) => H>
  ): Result<H>;

  ap<B, C, D, E, F, G, H, I>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>,
    fab4: Result<(d: D) => E>,
    fab5: Result<(e: E) => F>,
    fab6: Result<(f: F) => G>,
    fab7: Result<(g: G) => H>,
    fab8: Result<(h: H) => I>
  ): Result<I>;

  ap<B, C, D, E, F, G, H, I, J>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>,
    fab4: Result<(d: D) => E>,
    fab5: Result<(e: E) => F>,
    fab6: Result<(f: F) => G>,
    fab7: Result<(g: G) => H>,
    fab8: Result<(h: H) => I>,
    fab9: Result<(i: I) => J>
  ): Result<J>;

  ap<B, C, D, E, F, G, H, I, J, K>(
    fab1: Result<(a: A) => B>,
    fab2: Result<(b: B) => C>,
    fab3: Result<(c: C) => D>,
    fab4: Result<(d: D) => E>,
    fab5: Result<(e: E) => F>,
    fab6: Result<(f: F) => G>,
    fab7: Result<(g: G) => H>,
    fab8: Result<(h: H) => I>,
    fab9: Result<(i: I) => J>,
    fab10: Result<(j: J) => K>
  ): Result<K>;

  map<B>(transform: (a: A) => B): Result<B>;

  map<B, C>(transform1: (a: A) => B, transform2: (a: B) => C): Result<C>;

  map<B, C, D>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D
  ): Result<D>;

  map<B, C, D, E>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E
  ): Result<E>;

  map<B, C, D, E, F>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F
  ): Result<F>;

  map<B, C, D, E, F, G>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G
  ): Result<G>;

  map<B, C, D, E, F, G, H>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H
  ): Result<H>;

  map<B, C, D, E, F, G, H, I>(
    transform1: (a: A) => B,
    transform2: (b: B) => C,
    transform3: (c: C) => D,
    transform4: (d: D) => E,
    transform5: (e: E) => F,
    transform6: (f: F) => G,
    transform7: (g: G) => H,
    transform8: (h: H) => I
  ): Result<I>;

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
  ): Result<J>;

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
  ): Result<K>;

  flatMap<B>(transform: (a: A) => Result<B>): Result<B>;

  flatMap<B, C>(
    transform1: (a: A) => Result<B>,
    transform2: (a: B) => Result<C>
  ): Result<C>;

  flatMap<B, C, D>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>
  ): Result<D>;

  flatMap<B, C, D, E>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>,
    transform4: (d: D) => Result<E>
  ): Result<E>;

  flatMap<B, C, D, E, F>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>,
    transform4: (d: D) => Result<E>,
    transform5: (e: E) => Result<F>
  ): Result<F>;

  flatMap<B, C, D, E, F, G>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>,
    transform4: (d: D) => Result<E>,
    transform5: (e: E) => Result<F>,
    transform6: (f: F) => Result<G>
  ): Result<G>;

  flatMap<B, C, D, E, F, G, H>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>,
    transform4: (d: D) => Result<E>,
    transform5: (e: E) => Result<F>,
    transform6: (f: F) => Result<G>,
    transform7: (g: G) => Result<H>
  ): Result<H>;

  flatMap<B, C, D, E, F, G, H, I>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>,
    transform4: (d: D) => Result<E>,
    transform5: (e: E) => Result<F>,
    transform6: (f: F) => Result<G>,
    transform7: (g: G) => Result<H>,
    transform8: (h: H) => Result<I>
  ): Result<I>;

  flatMap<B, C, D, E, F, G, H, I, J>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>,
    transform4: (d: D) => Result<E>,
    transform5: (e: E) => Result<F>,
    transform6: (f: F) => Result<G>,
    transform7: (g: G) => Result<H>,
    transform8: (h: H) => Result<I>,
    transform9: (i: I) => Result<J>
  ): Result<J>;

  flatMap<B, C, D, E, F, G, H, I, J, K>(
    transform1: (a: A) => Result<B>,
    transform2: (b: B) => Result<C>,
    transform3: (c: C) => Result<D>,
    transform4: (d: D) => Result<E>,
    transform5: (e: E) => Result<F>,
    transform6: (f: F) => Result<G>,
    transform7: (g: G) => Result<H>,
    transform8: (h: H) => Result<I>,
    transform9: (i: I) => Result<J>,
    transform10: (j: J) => Result<K>
  ): Result<K>;

  getOrElse(defaultValue: A): A;

  filter(predicate: (a: A) => boolean): Result<A>;

  orElse(supplier: () => Result<A>): Result<A>;

  lift<B>(f: (a: A) => B): (a: Result<A>) => Result<B>;
}

abstract class AbstractResult<A> implements Result<A> {
  abstract isEmpty(): boolean;

  pure(a: A): Result<A> {
    return resultOf(a);
  }

  ap<A, B>(fab: Result<(a: A) => B>): Result<B>;

  ap(...fab: Array<Result<(a: unknown) => unknown>>): Result<unknown> {
    const [first, ...others] = fab;
    return others.reduce(
      (result1, result2) =>
        result2.flatMap((f: (a: unknown) => unknown) => result1.map(f)),
      first.flatMap((f: (a: unknown) => unknown) => this.map(f))
    );
  }

  map<A, B>(transform: (a: A) => B): Result<B>;

  map(...transforms: Array<(a: unknown) => unknown>): Result<unknown> {
    const [first, ...others] = transforms;
    const inner = (
      result: Result<unknown>,
      transform: (a: unknown) => unknown
    ): Result<unknown> => {
      return match<unknown>(result)<Result<unknown>>(
        success => execute<unknown, unknown>(transform, success.value),
        failure => failure,
        empty => empty
      );
    };
    return others.reduce(
      (result, transform) => inner(result, transform),
      inner(this as Result<unknown>, first)
    );
  }

  flatMap<A, B>(transform: (a: A) => Result<B>): Result<B>;

  flatMap(
    ...transforms: Array<(a: unknown) => Result<unknown>>
  ): Result<unknown> {
    const [first, ...others] = transforms;
    return others.reduce(
      (result, transform) =>
        result.map(transform).getOrElse(emptyOf<unknown>()),
      this.map(first).getOrElse(emptyOf<unknown>())
    );
  }

  getOrElse(defaultValue: A): A {
    return match<A>(this)<A>(
      success => success.value,
      () => defaultValue,
      () => defaultValue
    );
  }

  filter(predicate: (a: A) => boolean): Result<A> {
    operations.filter<A>(this, predicate);
    return this.flatMap<A, A>(a => (predicate(a) ? this : emptyOf<A>()));
  }

  orElse(supplier: () => Result<A>): Result<A> {
    return match<A>(this)<Result<A>>(
      success => success,
      () => supplier(),
      () => supplier()
    );
  }

  lift<B>(f: (a: A) => B): (a: Result<A>) => Result<B> {
    return (a: Result<A>) => a.map(f);
  }
}

@sealed
@frozen
class Success<A> extends AbstractResult<A> {
  constructor(readonly value: A) {
    super();
  }

  isEmpty(): boolean {
    return false;
  }

  toString() {
    return `Success(${this.value})`;
  }
}

@sealed
@frozen
class Failure<A> extends AbstractResult<A> {
  constructor(readonly error: Error) {
    super();
  }

  isEmpty(): boolean {
    return true;
  }
}

class Empty<A> extends AbstractResult<A> {
  constructor() {
    super();
  }

  isEmpty(): boolean {
    return true;
  }

  toString() {
    return 'Empty';
  }
}

const operations = {
  filter: <A>(ra: Result<A>, p: (a: A) => boolean): Result<A> => {
    return ra.flatMap(a => (p(a) ? ra : emptyOf()));
  },
  map: <A, B>(ra: Result<A>, f: (a: A) => B): Result<B> => {
    return match<A>(ra)<Result<B>>(
      success => {
        try {
          return successOf<B>(f(success.value));
        } catch (e) {
          return failureOf(e);
        }
      },
      failure => failureOf<B>(failure.error),
      () => emptyOf<B>()
    );
  },
  map2: <A, B, C>(
    ra: Result<A>,
    rb: Result<B>,
    f: (a: A) => (b: B) => C
  ): Result<C> => {
    return operations.lift2(f)(ra)(rb);
  },
  flatMap: <A, B>(ra: Result<A>, f: (a: A) => Result<B>): Result<B> => {
    return match<A>(ra)<Result<B>>(
      success => {
        try {
          return f(success.value);
        } catch (e) {
          return failureOf(e);
        }
      },
      failure => failureOf(failure.error),
      () => emptyOf()
    );
  },
  lift: <A, B>(f: (a: A) => B): ((r: Result<A>) => Result<B>) => {
    return (r: Result<A>) => r.map(f);
  },
  lift2: <A, B, C>(
    f: (a: A) => (b: B) => C
  ): ((ra: Result<A>) => (rb: Result<B>) => Result<C>) => {
    return (ra: Result<A>) => (rb: Result<B>) =>
      ra.map(f).flatMap((c: (b: B) => C) => rb.map(c));
  },
};

const match = <A>(result: Result<A>) => <T>(
  successCallback: (success: Success<A>) => T,
  failureCallback: (failure: Failure<A>) => T,
  emptyCallback: (empty: Empty<A>) => T
): T => {
  if (result instanceof Success) {
    return successCallback(result as Success<A>);
  } else if (result instanceof Failure) {
    return failureCallback(result as Failure<A>);
  } else if (result instanceof Empty) {
    return emptyCallback(result as Empty<A>);
  } else {
    throw new Error('Result 타입의 인스턴스가 아님');
  }
};

const execute = <A, B>(f: (a: A) => B, value: A): Result<B> => {
  try {
    return successOf<B>(f(value));
  } catch (e) {
    return failureOf<B>(e);
  }
};

const resultOf = <A>(value: A, f: (a: A) => boolean = isValid): Result<A> => {
  if (f(value)) {
    if (Array.isArray(value)) {
      return value.length > 0 ? successOf<A>(value) : emptyOf<A>();
    } else {
      return successOf<A>(value);
    }
  } else {
    return emptyOf<A>();
  }
};

const successOf = <A>(value: A): Result<A> => new Success(value);
const failureOf = <A>(error: Error): Result<A> => new Failure<A>(error);
const emptyOf = <A>(): Result<A> => new Empty<A>();

export const Result = {
  Success: successOf,
  Failure: failureOf,
  Empty: emptyOf,
  pure: <A>(a: A): Result<A> => resultOf(a),
  match: match,
  operations: operations,
};
