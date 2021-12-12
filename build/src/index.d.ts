import { ImmutableList } from "./list";
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
export declare const pipe: <T, S>(f: (t: T) => S) => <R>(g: (s: S) => R) => (x: T) => R;
export declare const combine: <S, R>(f: (s: S) => R) => <T>(g: (t: T) => S) => (x: T) => R;
export declare type SemigroupOperation<T> = (t1: T) => (t2: T) => T;
export declare const Semigroup: {
    number: SemigroupOperation<number>;
    string: SemigroupOperation<string>;
    booleanAnd: SemigroupOperation<boolean>;
    booleanOr: SemigroupOperation<boolean>;
    array: <T>() => SemigroupOperation<T[]>;
    arrayNumber: SemigroupOperation<number[]>;
    arrayString: SemigroupOperation<string[]>;
    immutableList: <T_1>() => SemigroupOperation<ImmutableList<T_1>>;
};
/**
 * 알고 있는 두 타입의 항등원을 포함하여 결합하는 방법을 정의한다.
 */
export declare type MonoidOperation<T> = {
    zero: T;
    op: SemigroupOperation<T>;
};
export declare const Zero: {
    string: string;
    number: number;
    booleanAnd: boolean;
    booleanOr: boolean;
    array: <T>() => T[];
    immutableList: <T_1>() => ImmutableList<T_1>;
};
export declare const Monoid: {
    number: MonoidOperation<number>;
    string: MonoidOperation<string>;
    booleanAnd: MonoidOperation<boolean>;
    booleanOr: MonoidOperation<boolean>;
    array: <T>() => MonoidOperation<T[]>;
    immutableList: <T_1>() => MonoidOperation<ImmutableList<T_1>>;
};
export declare const Combine: {
    array: <T>(monoid: MonoidOperation<T>) => (array: T[]) => T;
    args: <T_1>(monoid: MonoidOperation<T_1>) => (...arg: T_1[]) => T_1;
    arrayNumber: (array: number[]) => number;
    arrayString: (array: string[]) => string;
    argsNumber: (...arg: number[]) => number;
    argsString: (...arg: string[]) => string;
};
export declare const isValid: (value: unknown) => boolean;
export declare type Type = 'undefined' | 'boolean' | 'number' | 'string' | 'symbol' | 'bigint' | 'function' | 'null' | 'array' | 'object';
export declare const typeOf: (a: unknown) => Type;
