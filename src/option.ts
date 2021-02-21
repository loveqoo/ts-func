import {frozen, sealed} from './decorators';
import {isValid, Monad, MonadOp} from './index';

interface Option<A> extends Monad<A>, MonadOp<A> {
  pure(a: A): Option<A>;

  ap<B>(fab: Option<(a: A) => B>): Option<B>;

  map<B>(transform: (a: A) => B): Option<B>;

  flatMap<B>(transform: (a: A) => Option<B>): Option<B>;

  getOrElse(defaultValue: A): A;

  filter(predicate: (a: A) => boolean): Option<A>;

  orElse(supplier: () => Option<A>): Option<A>;

  lift<B>(f: (a: A) => B): (a: Option<A>) => Option<B>;
}

abstract class AbstractOption<A> implements Option<A> {
  abstract isEmpty(): boolean;

  pure(a: A): Option<A> {
    return optionOf(a);
  }

  ap<B>(fab: Option<(a: A) => B>): Option<B> {
    return fab.flatMap((f: (a: A) => B) => this.map(f));
  }

  map<B>(transform: (a: A) => B): Option<B> {
    return applyInner<A>(this)<Option<B>>(
      some => {
        const newValue = applySafety<A, B>(transform, some.value);
        return isValid(newValue) ? optionOf<B>(newValue!) : noneOf<B>();
      },
      () => noneOf<B>()
    );
  }

  flatMap<B>(transform: (a: A) => Option<B>): Option<B> {
    return this.map(transform).getOrElse(noneOf<B>());
  }

  getOrElse(defaultValue: A): A {
    return applyInner<A>(this)<A>(
      some => some.value,
      () => defaultValue
    );
  }

  filter(predicate: (a: A) => boolean): Option<A> {
    return this.flatMap(a => (predicate(a) ? this : noneOf<A>()));
  }

  orElse(supplier: () => Option<A>): Option<A> {
    return applyInner<A>(this)<Option<A>>(
      some => some,
      () => supplier()
    );
  }

  lift<B>(f: (a: A) => B): (a: Option<A>) => Option<B> {
    return (a: Option<A>) => a.map(f);
  }
}

@sealed
@frozen
class Some<A> extends AbstractOption<A> {
  constructor(readonly value: A) {
    super();
    this.value = value;
  }

  isEmpty(): boolean {
    return false;
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
}

const applyInner = <A>(option: Option<A>) => <T>(
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

const applySafety = <A, B>(f: (a: A) => B, value: A) => {
  try {
    return f(value);
  } catch (e) {
    console.error(e);
    return null;
  }
};

const optionOf = <A>(value: A): Option<A> =>
  isValid(value) ? new Some(value) : noneOf<A>();

const noneOf = <A>(): Option<A> => new None<A>();

export const Option = {
  Some: optionOf,
  None: noneOf,
  pure: <A>(a: A): Option<A> => optionOf(a),
};
