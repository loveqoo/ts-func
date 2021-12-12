import {Result} from './result';
import {supplyHolders} from './holder';
import {Lazy} from './lazy';
import {Option} from './option';
import {done, Trampoline, suspend, trampoline} from './trampoline';

/**
 * 함수형으로 재정의한 불변 리스트 인터페이스.
 */
export interface ImmutableList<A> {
  readonly length: number;

  isEmpty(): boolean;

  /**
   * 리스트 앞에 아이템을 추가한다.
   * @param a 리스트에 추가 할 아이템
   */
  cons(a: A): ImmutableList<A>;

  /**
   * 리스트의 첫 번째 원소를 바꾼다.
   * @param a 바꾸고 싶은 첫 아이템
   */
  setHead(a: A): ImmutableList<A>;

  /**
   * 리스트의 첫 번째 원소를 반환한다.
   */
  getHead(): Result<A>;

  /**
   * 리스트의 마지막 원소를 반환한다.
   */
  getLast(): Result<A>;

  /**
   * 첫 원소부터 지정한 개수 많큼 제거한 후 리스트를 반환한다.
   *
   * ```typescript
   * immutableListOf([1,2,3,4,5]).drop(4) = [5]
   * ```
   */
  drop(n: number): ImmutableList<A>;

  /**
   * 리스트의 맨 앞부터 조건에 맞는 동안 원소를 제거 후 리스트를 반환한다.
   * ```typescript
   * immutableListOf([1,4,2,5,3].)dropWhile((v) => v < 5)) = [5,3]
   * ```
   */
  dropWhile(p: (a: A) => boolean): ImmutableList<A>;

  /**
   * 두 리스트를 결합하여 새로운 리스트를 반환한다.
   * 기존 리스트 뒤에 결합된다.
   * @param another 합칠 새로운 리스트.
   * @param useFoldLeft 두 리스트를 합칠 때 사용하는 방식, default true
   */
  concat(another: ImmutableList<A>, useFoldLeft?: boolean): ImmutableList<A>;

  /**
   * 리스트의 아이템을 역순서로 바꾼다.
   */
  reverse(): ImmutableList<A>;

  /**
   * 마지막 원소를 하나 제거한다.
   */
  dropLast(): ImmutableList<A>;

  /**
   * 마지막 원소를 하나 제거한다.
   * [Haskel-init](http://zvon.org/other/haskell/Outputprelude/init_f.html)
   */
  init(): ImmutableList<A>;

  foldLeft<B>(identity: B, f: (b: B) => (a: A) => B): B;

  foldRight<B>(identity: B, f: (a: A) => (b: B) => B): B;

  /**
   * 공재귀를 이용한 foldRight 함수.
   * @param identity  항등원
   * @param f
   */
  coFoldRight<B>(identity: B, f: (a: A) => (b: B) => B): B;

  map<B>(f: (a: A) => B): ImmutableList<B>;

  /**
   * 조건에 맞는 엘리먼트만 모아서 리스트로 리턴한다.
   * @param p
   */
  filter(p: (a: A) => boolean): ImmutableList<A>;

  flatMap<B>(f: (a: A) => ImmutableList<B>): ImmutableList<B>;

  /**
   * 리스트의 모든 아이템을 순회하여 {@link Result}를 이용해서 안전하게 계산한다.
   * @param f 아이템을 변경할 함수
   * @param useCoRecursion 공재귀를 사용 여부 - default true
   */
  traverse<B>(
    f: (a: A) => Result<B>,
    useCoRecursion?: boolean
  ): Result<ImmutableList<B>>;

  /**
   * 리스트를 서로 묶는다.
   * 두 리스트 중에 짧은 리스트에 의해 결과가 제약된다.
   * @param bList 새로 묶을 리스트
   * @param f 리스트의 각 원소를 받아서 계산하는 함수
   */
  zipWith<B, C>(
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C>;

  /**
   * 두 리스트의 모든 경우의 수를 구해 리스트로 리턴한다.
   * @param bList 경우의 수를 계산할 리스트
   * @param f 리스트의 각 원소를 받아서 계산하는 함수
   */
  product<B, C>(
    bList: ImmutableList<B>,
    f: (a: A) => (b: B) => C
  ): ImmutableList<C>;

  /**
   * 조건을 받아 리스트를 2개의 그룹으로 분리한다.
   * @param f 아이템을 받아서 `Pair`로 변경하는 함수
   */
  unzip<B, C>(f: (a: A) => [B, C]): [ImmutableList<B>, ImmutableList<C>];

  /**
   * 리스트의 아이템을 조회한다.
   * @param index
   */
  getAt(index: number): Result<A>;

  /**
   * 리스트를 인덱스 아이디 기준으로 분리한다.
   * ```typescript
   * immutableListOf([1,2,3,4,5]).splitAt(2) = [[1,2,NIL],[3,4,5,NIL]]
   * ```
   * @param index 기준 인덱스. 해당 인덱스의 아이템은 오른쪽에 분리된다.
   */
  splitAt(index: number): [ImmutableList<A>, ImmutableList<A>];

  /**
   * 파라미터로 주어진 리스트가 부분 리스트가 되는지 검사한다.
   * @param sub 부분리스트 후보
   */
  hasSubList(sub: ImmutableList<A>): boolean;

  /**
   * 리스트를 맵으로 그룹핑한다.
   * @param f 그룹핑에 사용되는 함수. 결과는 맵의 키가 된다.
   */
  groupBy<B>(f: (a: A) => B): Map<B, ImmutableList<A>>;

  /**
   * 리스트에 해당 아이템이 존재하는지 검사한다.
   * @param p 검사할 아이템
   */
  exists(p: (a: A) => boolean): boolean;

  /**
   * 리스트에서 주어진 조건이 모두 만족하는지 검사한다.
   * @param p 조건
   */
  forAll(p: (a: A) => boolean): boolean;

  forEach(ef: (a: A) => void): void;

  /**
   *
   * ```typescript
   * immutableListOf([1,2,3,4,5]).splitListAt(2) = [[1, 2, NIL], [3, 4, 5, NIL], NIL]
   * ```
   * @param index 기준 인덱스
   */
  splitListAt(index: number): ImmutableList<ImmutableList<A>>;

  /**
   * 리스트의 사이즈.
   */
  size(): number;

  /**
   * 메모화 한 리스트 사이즈.
   */
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

  concat(another: ImmutableList<A>, useFoldLeft = true): ImmutableList<A> {
    return useFoldLeft
      ? operations.concat.viaFoldLeft(this, another)
      : operations.concat.viaFoldRight(this, another);
  }

  reverse(): ImmutableList<A> {
    return operations.reverse(this);
  }

  init(): ImmutableList<A> {
    return this.reverse().drop(1).reverse();
  }

  dropLast(): ImmutableList<A> {
    return this.init();
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

  traverse<B>(
    f: (a: A) => Result<B>,
    useCoRecursion = true
  ): Result<ImmutableList<B>> {
    return operations.traverseToResult(this, f, useCoRecursion);
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
    return `[${trampoline(this.toStringDetails, this)()}NIL]`;
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

  dropLast(): ImmutableList<A> {
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
    return trampoline(inner)(identity, targetList, f);
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
    return trampoline(inner)(identity, predicate, targetList, f);
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
    return trampoline(inner)(identity, zero, targetList, f);
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
          return done(f(cons.head)(trampoline(inner)(acc, cons.tail)));
        },
        () => done(acc)
      );
    return trampoline(inner)(identity, targetList, f);
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
    return trampoline(inner)(identity, targetList.reverse(), identity, f);
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
    return trampoline(inner)(n, targetList);
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
    return trampoline(inner)(targetList);
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
  traverseToOption: <A, B>(
    targetList: ImmutableList<A>,
    f: (a: A) => Option<B>,
    useCoRecursion = true
  ): Option<ImmutableList<B>> =>
    useCoRecursion
      ? targetList.coFoldRight<Option<ImmutableList<B>>>(
          Option.None(),
          a => acc => Option.map2(f(a), acc, b => bb => bb.cons(b))
        )
      : targetList.foldRight<Option<ImmutableList<B>>>(
          Option.None(),
          a => acc => Option.map2(f(a), acc, b => bb => bb.cons(b))
        ),
  /**
   *
   * @param targetList
   * @param f
   * @param useCoRecursion
   */
  traverseToResult: <A, B>(
    targetList: ImmutableList<A>,
    f: (a: A) => Result<B>,
    useCoRecursion = true
  ): Result<ImmutableList<B>> =>
    useCoRecursion
      ? targetList.coFoldRight<Result<ImmutableList<B>>>(
          Result.pure(immutableListOf()),
          a => acc => Result.map2(f(a), acc, b => bb => bb.cons(b))
        )
      : targetList.foldRight<Result<ImmutableList<B>>>(
          Result.pure(immutableListOf()),
          a => acc => Result.map2(f(a), acc, b => bb => bb.cons(b))
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
    return trampoline(inner)(NIL, aList, bList).reverse();
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
  sequence: {
    option: <A>(
      targetList: ImmutableList<Option<A>>
    ): Option<ImmutableList<A>> =>
      operations.traverseToOption(targetList, ra => ra),
    result: <A>(
      targetList: ImmutableList<Result<A>>
    ): Result<ImmutableList<A>> =>
      operations.traverseToResult(targetList, ra => ra),
    lazy: <A>(targetList: ImmutableList<Lazy<A>>): Lazy<ImmutableList<A>> =>
      Lazy.pure(() => targetList.map(a => a.getValue())),
    lazyOption: <A>(
      targetList: ImmutableList<A>
    ): Lazy<Option<ImmutableList<A>>> =>
      Lazy.pure(() =>
        operations.traverseToOption(targetList, a => Option.pure(a))
      ),
    lazyResult: <A>(
      targetList: ImmutableList<A>
    ): Lazy<Result<ImmutableList<A>>> =>
      Lazy.pure(() =>
        operations.traverseToResult(targetList, a => Result.pure(a))
      ),
  },
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
    return trampoline(inner)(targetList, sub);
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
    return trampoline(inner)(targetList, sub);
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
        failure => done(Result.Failure(failure.error)),
        () => done(Result.pure(acc))
      );
    };
    return trampoline(inner)(NIL as ImmutableList<A>, z).map(list =>
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
      .getOrElse(() => NIL as ImmutableList<number>),
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
    const inner = (list: ImmutableList<A>): Trampoline<boolean> =>
      applyToList(
        list,
        cons => {
          ef(cons.head);
          return suspend(() => inner(cons.tail));
        },
        () => done(true)
      );
    trampoline(inner)(targetList);
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
      return trampoline(inner)(
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
      : trampoline(inner)(builder(targetList), depth);
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

const isCons = <A>(list: ImmutableList<A>): boolean => {
  return list instanceof Cons;
};

const isNil = <A>(list: ImmutableList<A>): boolean => {
  return list instanceof Nil;
};

/**
 * 가변인자로 리스트를 생성한다.
 */
export const immutableListOf = builder;

/**
 * 배열을 받아서 리스트를 생성한다.
 * @param array
 */
export const immutableListFrom = <A>(array: Array<A>): ImmutableList<A> =>
  immutableListOf(...array);

/**
 * @ignore
 */
export const ImmutableList = {
  ...operations,
  isCons: isCons,
  isNil: isNil,
};
