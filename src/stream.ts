import {Result} from './result';
import {Lazy} from './lazy';
import {ImmutableList, immutableListOf} from './list';
import {done, suspend, trampoline, Trampoline} from './trampoline';

export interface Stream<A> {
  isEmpty(): boolean;
  head(): Result<A>;
  tail(): Result<Stream<A>>;
  // 스트림 길이를 최대 n 개로 제한
  takeAtMost(n: number): Stream<A>;
  // 앞에서부터 n 개의 원소를 스트림에서 제거
  dropAtMost(n: number): Stream<A>;
}

class Cons<A> implements Stream<A> {
  constructor(readonly lazyHead: Lazy<A>, readonly lazyTail: Lazy<Stream<A>>) {}

  isEmpty(): boolean {
    return false;
  }

  head(): Result<A> {
    return Result.pure(this.lazyHead.getValue());
  }

  tail(): Result<Stream<A>> {
    return Result.pure(this.lazyTail.getValue());
  }
  takeAtMost(n: number): Stream<A> {
    return operations.cons(
      Lazy.pure(() => this.lazyHead.getValue()),
      Lazy.pure(() => this.lazyTail.getValue().takeAtMost(n - 1))
    );
  }
  dropAtMost(n: number): Stream<A> {
    return operations.dropAndMost(this, n);
  }
}

class Empty<A> implements Stream<A> {
  isEmpty(): boolean {
    return true;
  }
  head(): Result<A> {
    return Result.Empty();
  }
  tail(): Result<Stream<A>> {
    return Result.Empty();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  takeAtMost(n: number): Stream<A> {
    return this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dropAtMost(n: number): Stream<A> {
    return this;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyOf = <A>() => new Empty<A>();

const applyToStream = <A, T>(
  stream: Stream<A>,
  consCallback: (cons: Cons<A>) => T,
  emptyCallback: (empty: Empty<A>) => T
): T => {
  if (stream instanceof Cons) {
    return consCallback(stream);
  } else if (stream instanceof Empty) {
    return emptyCallback(stream);
  } else {
    throw new Error('Stream 타입의 인스턴스가 아님');
  }
};

const operations = {
  cons: <A>(head: Lazy<A>, tail: Lazy<Stream<A>>): Stream<A> => {
    return new Cons(head, tail);
  },
  from: (n: number): Stream<number> => operations.iterate(n, () => n + 1),
  repeat: <A>(f: () => A): Stream<A> => {
    return operations.cons(
      Lazy.pure(() => f()),
      Lazy.pure(() => operations.repeat(f))
    );
  },
  dropAndMost: <A>(stream: Stream<A>, n: number): Stream<A> => {
    if (n > 0) {
      return applyToStream(
        stream,
        cons => operations.dropAndMost(cons.lazyTail.getValue(), n - 1),
        () => stream
      );
    } else {
      return stream;
    }
  },
  toList: <A>(stream: Stream<A>): ImmutableList<A> => {
    const inner = (
      list: ImmutableList<A>,
      stream: Stream<A>
    ): Trampoline<ImmutableList<A>> =>
      applyToStream(
        stream,
        cons =>
          suspend(() =>
            inner(list.cons(cons.lazyHead.getValue()), cons.lazyTail.getValue())
          ),
        () => done(list)
      );
    return trampoline(inner)(immutableListOf<A>(), stream).reverse();
  },
  iterate: <A>(seed: A, f: (a: A) => A): Stream<A> =>
    operations.cons<A>(
      Lazy.pure(() => seed),
      Lazy.pure(() => operations.iterate(f(seed), f))
    ),
  iterate2: <A>(seed: Lazy<A>, f: (a: A) => A): Stream<A> =>
    operations.cons<A>(
      seed,
      Lazy.pure(() => operations.iterate(f(seed.getValue()), f))
    ),
  // TODO: takeWhile, dropWhile, exists, foldRight, takeWhileViaFoldRight, headSafe, map, filter, append, flatMap, find, unfold, filter2
};

/**
 * @ignore
 */
export const Stream = {
  repeat: operations.repeat,
  toList: operations.toList,
};
