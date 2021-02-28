import {Result} from './result';
import {done, suspend, Trampoline, trampolineOf} from './trampoline';
import {supplyHolders} from './holder';

export interface ImmutableList<A> {
  readonly length: number;

  isEmpty(): boolean;

  cons(a: A): ImmutableList<A>;

  setHead(a: A): ImmutableList<A>;

  getHead(): Result<A>;

  getLast(): Result<A>;

  /**
   * [1,2,3,4,5].drop(4) = [5]
   */
  drop(n: number): ImmutableList<A>;

  /**
   * [1,4,2,5,3].drop((v) => v < 5)) = [5,3]
   */
  dropWhile(p: (a: A) => boolean): ImmutableList<A>;

  concat(another: ImmutableList<A>): ImmutableList<A>;

  reverse(): ImmutableList<A>;

  init(): ImmutableList<A>;

  foldLeft<B>(identity: B, f: (b: B) => (a: A) => B): B;

  foldRight<B>(identity: B, f: (a: A) => (b: B) => B): B;

  coFoldRight<B>(identity: B, f: (a: A) => (b: B) => B): B;

  map<B>(f: (a: A) => B): ImmutableList<B>;

  filter(p: (a: A) => boolean): ImmutableList<A>;

  flatMap<B>(f: (a: A) => ImmutableList<B>): ImmutableList<B>;

  traverse<B>(f: (a: A) => Result<B>): Result<ImmutableList<B>>;

  zipWith<B, C>(
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C>;

  product<B, C>(
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C>;

  unzip<B, C>(f: (a: A) => [B, C]): [ImmutableList<B>, ImmutableList<C>];

  getAt(index: number): Result<A>;

  splitAt(index: number): [ImmutableList<A>, ImmutableList<A>];

  hasSubList(sub: ImmutableList<A>): boolean;

  groupBy<B>(f: (a: A) => B): Map<B, ImmutableList<A>>;

  exists(p: (a: A) => boolean): boolean;

  forAll(p: (a: A) => boolean): boolean;

  forEach(ef: (a: A) => void): void;

  splitListAt(index: number): ImmutableList<ImmutableList<A>>;

  size(): number;

  lengthMemoized(): number;
}

abstract class AbstractCons<A> implements ImmutableList<A> {
  readonly head: A;
  readonly tail: ImmutableList<A>;
  readonly length: number;

  protected constructor(head: A, tail: ImmutableList<A>) {
    this.head = head;
    this.tail = tail;
    this.length = tail.lengthMemoized() + 1;
  }

  isEmpty(): boolean {
    return false;
  }

  setHead(a: A): ImmutableList<A> {
    return applyToList<A, ImmutableList<A>>(
      this,
      cons => cons.tail.cons(a),
      () => {
        throw new Error('빈 배열에 setHead 연산을 할 수 없음');
      }
    );
  }

  getHead(): Result<A> {
    return Result.pure(this.head);
  }

  getLast(): Result<A> {
    return operations.getLast(this);
  }

  cons(a: A): ImmutableList<A> {
    return new Cons<A>(a, this);
  }

  drop(n: number): ImmutableList<A> {
    return operations.drop(this, n);
  }

  dropWhile(p: (a: A) => boolean): ImmutableList<A> {
    return operations.dropWhile(this, p);
  }

  concat(another: ImmutableList<A>): ImmutableList<A> {
    return operations.concat.viaFoldLeft(this, another);
  }

  reverse(): ImmutableList<A> {
    return operations.reverse(this);
  }

  init(): ImmutableList<A> {
    return this.reverse().drop(1).reverse();
  }

  foldLeft<B>(identity: B, f: (b: B) => (a: A) => B): B {
    return operations.foldLeft<A, B>(this, identity, f);
  }

  foldRight<B>(identity: B, f: (a: A) => (b: B) => B): B {
    return operations.foldRight<A, B>(this, identity, f);
  }

  coFoldRight<B>(identity: B, f: (a: A) => (b: B) => B): B {
    return operations.coFoldRight<A, B>(this, identity, f);
  }

  size(): number {
    return this.foldLeft<number>(0, acc => () => acc + 1);
  }

  lengthMemoized(): number {
    return this.length;
  }

  map<B>(f: (a: A) => B): ImmutableList<B> {
    return operations.map(this, f);
  }

  filter(p: (a: A) => boolean): ImmutableList<A> {
    return operations.filter(this, p);
  }

  flatMap<B>(f: (a: A) => ImmutableList<B>): ImmutableList<B> {
    return operations.flatMap(this, f);
  }

  traverse<B>(f: (a: A) => Result<B>): Result<ImmutableList<B>> {
    return operations.traverse(this, f);
  }

  zipWith<B, C>(
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C> {
    return operations.zipWith(this, bList, f);
  }

  product<B, C>(
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C> {
    return operations.product(this, bList, f);
  }

  unzip<B, C>(f: (a: A) => [B, C]): [ImmutableList<B>, ImmutableList<C>] {
    return operations.unzip<A, B, C>(this, f);
  }

  getAt(index: number): Result<A> {
    return operations.getAt(this, index);
  }

  splitAt(index: number): [ImmutableList<A>, ImmutableList<A>] {
    return operations.splitAt(this, index);
  }

  hasSubList(sub: ImmutableList<A>): boolean {
    return operations.hasSubList(this, sub);
  }

  groupBy<B>(f: (a: A) => B): Map<B, ImmutableList<A>> {
    return operations.groupBy(this, f);
  }

  exists(p: (a: A) => boolean): boolean {
    return operations.exists(this, p);
  }

  forAll(p: (a: A) => boolean): boolean {
    return operations.forAll(this, p);
  }

  forEach(ef: (a: A) => void): void {
    operations.forEach(this, ef);
  }

  splitListAt(index: number): ImmutableList<ImmutableList<A>> {
    return operations.splitListAt(this, index);
  }

  toString() {
    return `[${trampolineOf(this.toStringDetails, this)()}NIL]`;
  }

  private toStringDetails(): Trampoline<string> {
    const inner = (acc: string, list: ImmutableList<A>): Trampoline<string> =>
      applyToList<A, Trampoline<string>>(
        list,
        cons => suspend(() => inner(`${acc}${cons.head}, `, cons.tail)),
        () => done(acc)
      );
    return inner('', this);
  }
}

class Cons<A> extends AbstractCons<A> {
  constructor(head: A, tail: ImmutableList<A>) {
    super(head, tail);
  }
}

class Nil<A> implements ImmutableList<A> {
  readonly length: number = 0;

  cons(a: A): ImmutableList<A> {
    return new Cons<A>(a, this as ImmutableList<A>);
  }

  isEmpty(): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setHead(a: unknown): ImmutableList<A> {
    throw new Error('빈 배열에 setHead 연산을 할 수 없음');
  }

  getHead(): Result<A> {
    return Result.Empty();
  }

  getLast(): Result<A> {
    return Result.Empty();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drop(n: number): ImmutableList<A> {
    return this as ImmutableList<A>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dropWhile(p: (a: A) => boolean): ImmutableList<A> {
    return this as ImmutableList<A>;
  }

  concat(another: ImmutableList<A>): ImmutableList<A> {
    return another;
  }

  reverse(): ImmutableList<A> {
    return this as ImmutableList<A>;
  }

  init(): ImmutableList<A> {
    return this as ImmutableList<A>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  foldLeft<B>(identity: B, f: (b: B) => (a: unknown) => B): B {
    return identity;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  foldRight<B>(identity: B, f: (a: A) => (b: B) => B): B {
    return identity;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  coFoldRight<B>(identity: B, f: (a: A) => (b: B) => B): B {
    return identity;
  }

  size(): number {
    return 0;
  }

  lengthMemoized(): number {
    return 0;
  }

  map<B>(f: (a: A) => B): ImmutableList<B> {
    return operations.map(this as ImmutableList<A>, f);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filter(p: (a: A) => boolean): ImmutableList<A> {
    return this as ImmutableList<A>;
  }

  flatMap<B>(f: (a: A) => ImmutableList<B>): ImmutableList<B> {
    return operations.flatMap(this as ImmutableList<A>, f);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  traverse<B>(f: (a: A) => Result<B>): Result<ImmutableList<B>> {
    return Result.Empty();
  }

  zipWith<B, C>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bList: ImmutableList<B>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    f: (a: A) => (b: B) => C
  ): ImmutableList<C> {
    return NIL as ImmutableList<C>;
  }

  product<B, C>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bList: ImmutableList<B>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    f: (a: A) => (b: B) => C
  ): ImmutableList<C> {
    return NIL as ImmutableList<C>;
  }

  unzip<B, C>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    f: (a: A) => [B, C]
  ): [ImmutableList<B>, ImmutableList<C>] {
    return [NIL as ImmutableList<B>, NIL as ImmutableList<C>];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAt(index: number): Result<A> {
    return Result.Failure(Error('Index out ouf bound'));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  splitAt(index: number): [ImmutableList<A>, ImmutableList<A>] {
    return [NIL as ImmutableList<A>, NIL as ImmutableList<A>];
  }

  hasSubList(sub: ImmutableList<A>): boolean {
    return sub.isEmpty();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  groupBy<B>(f: (a: A) => B): Map<B, ImmutableList<A>> {
    return new Map<B, ImmutableList<A>>();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exists(p: (a: A) => boolean): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forAll(p: (a: A) => boolean): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forEach(ef: (a: A) => void): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  splitListAt(index: number): ImmutableList<ImmutableList<A>> {
    return NIL as ImmutableList<ImmutableList<A>>;
  }

  toString() {
    return '[NIL]';
  }
}

const applyToList = <A, T>(
  list: ImmutableList<A>,
  consCallback: (cons: Cons<A>) => T,
  nilCallback: (nil: Nil<A>) => T
): T => {
  if (list instanceof Cons) {
    return consCallback(list);
  } else if (list instanceof Nil) {
    return nilCallback(list);
  } else {
    throw new Error('ImmutableList 타입의 인스턴스가 아님');
  }
};

const operations = {
  foldLeft: <A, B>(
    targetList: ImmutableList<A>,
    identity: B,
    f: (b: B) => (a: A) => B
  ): B => {
    const inner = (acc: B, list: ImmutableList<A>): Trampoline<B> =>
      applyToList<A, Trampoline<B>>(
        list,
        cons => suspend(() => inner(f(acc)(cons.head), cons.tail)),
        () => done(acc)
      );
    return trampolineOf(inner)(identity, targetList, f);
  },
  foldLeftWithPredicate: <A, B>(
    targetList: ImmutableList<A>,
    identity: B,
    predicate: (b: B) => boolean,
    f: (b: B) => (a: A) => B
  ): B => {
    const inner = (
      acc: B,
      p: (b: B) => boolean,
      list: ImmutableList<A>
    ): Trampoline<B> =>
      applyToList<A, Trampoline<B>>(
        list,
        cons =>
          p(acc)
            ? done(acc)
            : suspend(() => inner(f(acc)(cons.head), p, cons.tail)),
        () => done(acc)
      );
    return trampolineOf(inner)(identity, predicate, targetList, f);
  },
  foldLeftToPair: <A, B>(
    targetList: ImmutableList<A>,
    identity: B,
    zero: B,
    equals: (b1: B, b2: B) => boolean,
    f: (b: B) => (a: A) => B
  ): [B, ImmutableList<A>] => {
    if (targetList instanceof Nil) {
      return [identity, NIL as ImmutableList<A>];
    }
    const inner = (
      acc: B,
      zero: B,
      list: ImmutableList<A>,
      f: (b: B) => (a: A) => B
    ): Trampoline<[B, ImmutableList<A>]> =>
      applyToList<A, Trampoline<[B, ImmutableList<A>]>>(
        list,
        cons =>
          equals(acc, zero)
            ? done([acc, list])
            : suspend(() => inner(f(acc)(cons.head), zero, cons.tail, f)),
        () => done([acc, list])
      );
    return trampolineOf(inner)(identity, zero, targetList, f);
  },
  foldRight: <A, B>(
    targetList: ImmutableList<A>,
    identity: B,
    f: (a: A) => (b: B) => B
  ): B => {
    const inner = (acc: B, list: ImmutableList<A>): Trampoline<B> =>
      applyToList<A, Trampoline<B>>(
        list,
        cons => {
          return done(f(cons.head)(trampolineOf(inner)(acc, cons.tail)));
        },
        () => done(acc)
      );
    return trampolineOf(inner)(identity, targetList, f);
  },
  coFoldRight: <A, B>(
    targetList: ImmutableList<A>,
    identity: B,
    f: (a: A) => (b: B) => B
  ): B => {
    const inner = (
      acc: B,
      reversedList: ImmutableList<A>,
      identity: B,
      f: (a: A) => (b: B) => B
    ): Trampoline<B> =>
      applyToList<A, Trampoline<B>>(
        reversedList,
        cons => suspend(() => inner(f(cons.head)(acc), cons.tail, identity, f)),
        () => done(acc)
      );
    return trampolineOf(inner)(identity, targetList.reverse(), identity, f);
  },
  drop: <A>(targetList: ImmutableList<A>, n: number): ImmutableList<A> => {
    const inner = (
      n: number,
      list: ImmutableList<A>
    ): Trampoline<ImmutableList<A>> =>
      n
        ? applyToList<A, Trampoline<ImmutableList<A>>>(
            list,
            cons => suspend(() => inner(n - 1, cons.tail)),
            nil => done(nil as ImmutableList<A>)
          )
        : done(list);
    return trampolineOf(inner)(n, targetList);
  },
  dropWhile: <A>(
    targetList: ImmutableList<A>,
    predicate: (a: A) => boolean
  ): ImmutableList<A> => {
    const inner = (list: ImmutableList<A>): Trampoline<ImmutableList<A>> =>
      applyToList<A, Trampoline<ImmutableList<A>>>(
        list,
        cons =>
          predicate(cons.head) ? suspend(() => inner(cons.tail)) : done(list),
        nil => done(nil as ImmutableList<A>)
      );
    return trampolineOf(inner)(targetList);
  },
  concat: {
    viaFoldLeft: <A>(
      leftList: ImmutableList<A>,
      rightList: ImmutableList<A>
    ): ImmutableList<A> =>
      leftList.reverse().foldLeft(rightList, acc => v => acc.cons(v)),
    viaFoldRight: <A>(
      leftList: ImmutableList<A>,
      rightList: ImmutableList<A>
    ): ImmutableList<A> =>
      operations.foldRight<A, ImmutableList<A>>(leftList, rightList, a => acc =>
        new Cons(a, acc)
      ),
  },
  reverse: <A>(targetList: ImmutableList<A>): ImmutableList<A> =>
    operations.foldLeft<A, ImmutableList<A>>(
      targetList,
      NIL as ImmutableList<A>,
      acc => v => acc.cons(v)
    ),
  flatten: <A>(targetList: ImmutableList<ImmutableList<A>>): ImmutableList<A> =>
    operations.coFoldRight(targetList, NIL as ImmutableList<A>, a => acc =>
      a.concat(acc)
    ),
  map: <A, B>(targetList: ImmutableList<A>, f: (a: A) => B): ImmutableList<B> =>
    operations
      .foldLeft(targetList, NIL as ImmutableList<B>, acc => v =>
        new Cons<B>(f(v), acc)
      )
      .reverse(),
  filter: <A>(
    targetList: ImmutableList<A>,
    p: (a: A) => boolean
  ): ImmutableList<A> =>
    operations.flatMap<A, A>(targetList, a =>
      p(a) ? builder<A>(a) : (NIL as ImmutableList<A>)
    ),
  flatMap: <A, B>(
    targetList: ImmutableList<A>,
    f: (a: A) => ImmutableList<B>
  ): ImmutableList<B> => operations.flatten(operations.map(targetList, f)),
  getLast: <A>(targetList: ImmutableList<A>): Result<A> =>
    operations.foldLeft(targetList, Result.Empty() as Result<A>, () => a =>
      Result.pure(a)
    ),
  traverse: <A, B>(
    targetList: ImmutableList<A>,
    f: (a: A) => Result<B>
  ): Result<ImmutableList<B>> =>
    targetList.coFoldRight<Result<ImmutableList<B>>>(Result.Empty(), a => acc =>
      Result.map2(f(a), acc, b => bb => bb.cons(b))
    ),
  zipWith: <A, B, C>(
    aList: ImmutableList<A>,
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C> => {
    const inner = (
      acc: ImmutableList<C>,
      list1: ImmutableList<A>,
      list2: ImmutableList<B>
    ): Trampoline<ImmutableList<C>> =>
      applyToList(
        list1,
        list1Cons => {
          return applyToList(
            list2,
            list2Cons =>
              suspend(() =>
                inner(
                  acc.cons(f(list1Cons.head)(list2Cons.head)),
                  list1Cons.tail,
                  list2Cons.tail
                )
              ),
            () => done(acc)
          );
        },
        () => done(acc)
      );
    return trampolineOf(inner)(NIL, aList, bList).reverse();
  },
  product: <A, B, C>(
    aList: ImmutableList<A>,
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C> => aList.flatMap(a => bList.map(b => f(a)(b))),
  unzip: <A, B, C>(
    list: ImmutableList<A>,
    f: (a: A) => [B, C]
  ): [ImmutableList<B>, ImmutableList<C>] =>
    list.coFoldRight(
      [NIL as ImmutableList<B>, NIL as ImmutableList<C>],
      a => listPair =>
        supplyHolders
          .hold(() => f(a))
          .onValue(
            pair =>
              [listPair[0].cons(pair[0]), listPair[1].cons(pair[1])] as [
                ImmutableList<B>,
                ImmutableList<C>
              ]
          )()
    ),
  sequence: <A>(
    targetList: ImmutableList<Result<A>>
  ): Result<ImmutableList<A>> => operations.traverse(targetList, ra => ra),
  getAt: <A>(targetList: ImmutableList<A>, index: number): Result<A> => {
    return supplyHolders
      .hold(
        () =>
          [Result.Failure(Error('Index out ouf bound')), index] as [
            Result<A>,
            number
          ]
      )
      .hold(() => (p: [Result<A>, number]) => p[1] < 0)
      .onValue((identity, predicate) =>
        index < 0 || index >= targetList.length
          ? identity[0]
          : operations.foldLeftWithPredicate<A, [Result<A>, number]>(
              targetList,
              identity,
              predicate,
              pair => a =>
                predicate(pair) ? pair : [Result.pure(a), pair[1] - 1]
            )[0]
      )();
  },
  splitAt: <A>(
    targetList: ImmutableList<A>,
    index: number
  ): [ImmutableList<A>, ImmutableList<A>] => {
    if (index <= 0) {
      return [NIL as ImmutableList<A>, targetList];
    } else if (index >= targetList.length) {
      return [targetList, NIL as ImmutableList<A>];
    } else {
      const identity = [NIL as ImmutableList<A>, 0] as [
        ImmutableList<A>,
        number
      ];
      const zero = [targetList, index] as [ImmutableList<A>, number];
      const [pair, list] = operations.foldLeftToPair<
        A,
        [ImmutableList<A>, number]
      >(
        targetList,
        identity,
        zero,
        (b1, b2) => (b1 && b2 ? b1[1] === b2[1] : false),
        acc => e => [acc[0].cons(e), acc[1] + 1]
      );
      return [pair[0].reverse(), list];
    }
  },
  startsWith: <A>(
    targetList: ImmutableList<A>,
    sub: ImmutableList<A>
  ): boolean => {
    const inner = (
      list: ImmutableList<A>,
      sub: ImmutableList<A>
    ): Trampoline<boolean> =>
      applyToList(
        sub,
        subCons =>
          applyToList(
            list,
            listCons =>
              listCons.head === subCons.head
                ? suspend(() => inner(listCons.tail, subCons.tail))
                : done(false),
            () => done(false)
          ),
        () => done(true)
      );
    return trampolineOf(inner)(targetList, sub);
  },
  hasSubList: <A>(
    targetList: ImmutableList<A>,
    sub: ImmutableList<A>
  ): boolean => {
    const inner = (
      list: ImmutableList<A>,
      sub: ImmutableList<A>
    ): Trampoline<boolean> =>
      applyToList(
        list,
        listCons =>
          operations.startsWith(listCons, sub)
            ? done(true)
            : suspend(() => inner(listCons.tail, sub)),
        () => done(sub.isEmpty())
      );
    return trampolineOf(inner)(targetList, sub);
  },
  groupBy: <A, B>(
    targetList: ImmutableList<A>,
    f: (a: A) => B
  ): Map<B, ImmutableList<A>> => {
    return targetList
      .reverse()
      .foldLeft(new Map<B, ImmutableList<A>>(), map => a => {
        const key = f(a);
        if (key) {
          map.has(key)
            ? map.set(key, map.get(key)!.cons(a))
            : map.set(key, (NIL as ImmutableList<A>).cons(a));
        }
        return map;
      });
  },
  unfold: <A, S>(
    z: S,
    getNext: (s: S) => Result<[A, S]>
  ): Result<ImmutableList<A>> => {
    const inner = (
      acc: ImmutableList<A>,
      z: S
    ): Trampoline<Result<ImmutableList<A>>> => {
      const next = getNext(z);
      return Result.match<[A, S]>(next)(
        success =>
          suspend(() => inner(acc.cons(success.value[0]), success.value[1])),
        failure => done(failure.error),
        () => done(Result.pure(acc))
      );
    };
    return trampolineOf(inner)(NIL as ImmutableList<A>, z).map(list =>
      list.reverse()
    );
  },
  range: (start: number, end: number): ImmutableList<number> =>
    operations
      .unfold<number, number>(start, i =>
        i < end
          ? Result.pure<[number, number]>([i, i + 1])
          : Result.Empty<[number, number]>()
      )
      .getOrElse(NIL as ImmutableList<number>),
  exists: <A>(targetList: ImmutableList<A>, p: (a: A) => boolean): boolean =>
    operations.foldLeftToPair(
      targetList,
      false,
      true,
      (a, b) => a === b,
      acc => a => acc || p(a)
    )[0],
  forAll: <A>(targetList: ImmutableList<A>, p: (a: A) => boolean): boolean =>
    operations.foldLeftToPair(
      targetList,
      true,
      false,
      (a, b) => a === b,
      acc => a => acc && p(a)
    )[0],
  forEach: <A>(targetList: ImmutableList<A>, ef: (a: A) => void): void => {
    const inner = (list: ImmutableList<A>): Trampoline<never> =>
      applyToList(
        list,
        cons => {
          ef(cons.head);
          return suspend(() => inner(cons.tail));
        },
        () => done(null)
      );
    trampolineOf(inner)(targetList);
  },
  splitListAt: <A>(
    targetList: ImmutableList<A>,
    index: number
  ): ImmutableList<ImmutableList<A>> => {
    const inner = (
      acc: ImmutableList<A>,
      list: ImmutableList<A>,
      i: number
    ): Trampoline<ImmutableList<ImmutableList<A>>> =>
      applyToList(
        list,
        cons =>
          i === 0
            ? done(builder(list.reverse(), acc))
            : suspend(() => inner(acc.cons(cons.head), cons.tail, i - 1)),
        () => done(builder(list.reverse(), acc))
      );
    if (index < 0) {
      return operations.splitListAt(targetList, 0);
    } else if (index > targetList.length) {
      return operations.splitListAt(targetList, targetList.length);
    } else {
      return trampolineOf(inner)(
        NIL as ImmutableList<A>,
        targetList.reverse(),
        targetList.length - index
      );
    }
  },
  divide: <A>(
    targetList: ImmutableList<A>,
    depth: number
  ): ImmutableList<ImmutableList<A>> => {
    const inner = (
      list: ImmutableList<ImmutableList<A>>,
      innerDepth: number
    ): Trampoline<ImmutableList<ImmutableList<A>>> => {
      return applyToList(
        list,
        cons => {
          if (cons.head.length < 2 || innerDepth < 1) {
            return done(list);
          } else {
            return suspend(() =>
              inner(
                list.flatMap(x =>
                  operations.splitListAt(x, Math.floor(x.length / 2))
                ),
                innerDepth - 1
              )
            );
          }
        },
        () => done(list)
      );
    };
    return targetList.isEmpty()
      ? builder(targetList)
      : trampolineOf(inner)(builder(targetList), depth);
  },
};

const NIL = new Nil();

const builder = <A>(...items: Array<A>): ImmutableList<A> => {
  return items.reduceRight<ImmutableList<A>>(
    (previousValue: ImmutableList<A>, currentValue: A) =>
      new Cons(currentValue, previousValue) as ImmutableList<A>,
    NIL as ImmutableList<A>
  );
};

export const isCons = <A>(list: ImmutableList<A>): boolean => {
  return list instanceof Cons;
};

export const isNil = <A>(list: ImmutableList<A>): boolean => {
  return list instanceof Nil;
};

export const immutableListOf = builder;
export const immutableListFrom = <A>(array: Array<A>): ImmutableList<A> =>
  immutableListOf(...array);

export const ImmutableList = {
  ...operations,
  isCons: isCons,
  isNil: isNil,
};
