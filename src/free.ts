import {frozen, sealed} from './decorators';

type GenericFunction<R> = (...args: unknown[]) => R;

abstract class Free<F extends GenericFunction<I>, I, A> {
  map<B>(transform: (a: A) => B): Free<GenericFunction<A>, A, B> {
    return this.flatMap<B>((a: A) => new Return<A, B>(transform(a)));
  }
  flatMap<B>(
    transform: (a: A) => Free<GenericFunction<A>, A, B>
  ): Free<GenericFunction<A>, A, B> {
    if (this instanceof Return) {
      return transform(this.value);
    } else if (this instanceof Continue) {
      return new Continue<A, B>(this.sub, (a: A) => transform(a));
    } else {
      throw new Error('Free 타입의 인스턴스가 아님');
    }
  }

  static pure<F extends GenericFunction<A>, A>(f: F): Free<F, A, A> {
    return new Continue<A, A>(f, a => new Return<A, A>(a));
  }

  static lift<F extends GenericFunction<A>, A>(f: F): Free<F, A, A> {
    return new Continue<A, A>(f, a => new Return<A, A>(a));
  }
}

@sealed
@frozen
class Return<I, A> extends Free<GenericFunction<I>, I, A> {
  constructor(readonly value: A) {
    super();
  }
}

@sealed
@frozen
class Continue<I, A> extends Free<GenericFunction<I>, I, A> {
  constructor(
    readonly sub: GenericFunction<I>,
    readonly transform: (a: I) => Free<GenericFunction<I>, I, A>
  ) {
    super();
  }
}
