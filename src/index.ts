import {Option} from "./option";

interface Functor<A> {
  map<B>(transform: (a: A) => B): Functor<B>;
}

interface Applicative<A> extends Functor<A> {
  pure(a: A): Applicative<A>;
  ap<B>(fab: Applicative<(a: A) => B>): Applicative<B>;
}

export interface Monad<A> extends Applicative<A> {
  flatMap<B>(f: (a: A) => Monad<B>): Monad<B>;
}

export interface MonadOp<A> {
  filter(p: (a: A) => boolean): Monad<A>;

  getOrElse(defaultValue: A): A;

  orElse(supplier: () => Monad<A>): Monad<A>;
}

export const isValid = (value: unknown) =>
  value === null ? false : typeof value !== 'undefined';
