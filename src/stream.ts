import {Result} from './result';
import {Lazy} from './lazy';

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
    if (n > 0) {
      return this.lazyTail.getValue().dropAtMost(n - 1);
    } else {
      return emptyOf();
    }
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

const emptyOf = <A>() => new Empty<A>();

const operations = {
  cons: <A>(head: Lazy<A>, tail: Lazy<Stream<A>>): Stream<A> => {
    return new Cons(head, tail);
  },
  from: (n: number): Stream<number> => {
    return operations.cons(
      Lazy.pure(() => n),
      Lazy.pure(() => operations.from(n + 1))
    );
  },
  repeat: <A>(f: () => A): Stream<A> => {
    return operations.cons(
      Lazy.pure(() => f()),
      Lazy.pure(() => operations.repeat(f))
    );
  },
};
