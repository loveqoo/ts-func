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
export declare const isValid: (value: unknown) => boolean;
export declare type Type = 'undefined' | 'boolean' | 'number' | 'string' | 'symbol' | 'bigint' | 'function' | 'null' | 'array' | 'object';
export declare const typeOf: (a: unknown) => Type;
