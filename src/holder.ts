type Supplier<T> = () => T;

interface GenericFunction {
  apply(...args: Array<unknown>): unknown;
}

interface GenericFunction1<T1, S> extends GenericFunction {
  apply(t1: T1): S;
}

interface GenericFunction2<T1, T2, S> extends GenericFunction {
  apply(t1: T1, t2: T2): S;
}

interface GenericFunction3<T1, T2, T3, S> extends GenericFunction {
  apply(t1: T1, t2: T2, t3: T3): S;
}

interface Holders {
  hold<T1, S>(f: GenericFunction1<T1, S>, h1: Supplier<T1>): Supplier<S>;

  hold<T1, T2, S>(
    f: GenericFunction2<T1, T2, S>,
    h1: Supplier<T1>,
    h2: Supplier<T2>
  ): Supplier<S>;

  hold<T1, T2, T3, S>(
    f: GenericFunction3<T1, T2, T3, S>,
    h1: Supplier<T1>,
    h2: Supplier<T2>,
    h3: Supplier<T3>
  ): Supplier<S>;

  hold(...args: unknown[]): Supplier<unknown>;
}

class HoldersImpl implements Holders {
  supplyOnce<T>(supplier: Supplier<T>): Supplier<T> {
    return (() => {
      let cached: T;
      return () => {
        if (cached) {
          return cached;
        } else {
          cached = supplier();
          return cached;
        }
      };
    })();
  }

  hold<T1, S>(f: GenericFunction1<T1, S>, h1: Supplier<T1>): Supplier<S>;
  hold<T1, T2, S>(
    f: GenericFunction2<T1, T2, S>,
    h1: Supplier<T1>,
    h2: Supplier<T2>
  ): Supplier<S>;
  hold<T1, T2, T3, S>(
    f: GenericFunction3<T1, T2, T3, S>,
    h1: Supplier<T1>,
    h2: Supplier<T2>,
    h3: Supplier<T3>
  ): Supplier<S>;
  hold(...args: never[]): unknown {
    switch (args.length) {
      case 2:
        return (() => {
          const t1 = this.supplyOnce(args[1]);
          return () =>
            (args[0] as GenericFunction1<unknown, unknown>).apply(t1());
        })();
      case 3:
        return (() => {
          const t1 = this.supplyOnce(args[1]);
          const t2 = this.supplyOnce(args[2]);
          return () =>
            (args[0] as GenericFunction2<unknown, unknown, unknown>).apply(
              t1(),
              t2()
            );
        })();
      case 4:
        return (() => {
          const t1 = this.supplyOnce(args[1]);
          const t2 = this.supplyOnce(args[2]);
          const t3 = this.supplyOnce(args[3]);
          return () =>
            (args[0] as GenericFunction3<
              unknown,
              unknown,
              unknown,
              unknown
            >).apply(t1(), t2(), t3());
        })();
      default: {
        throw Error(`지원하지 않는 파라미터 개수 : ${args.length}`);
      }
    }
  }
}

export const supplyHolders = (() => {
  const holdersImpl = new HoldersImpl();
  return {
    hold: <T1>(s1: Supplier<T1>) => ({
      hold: <T2>(s2: Supplier<T2>) => ({
        hold: <T3>(s3: Supplier<T3>) => ({
          onValue: <S>(f: (t1: T1, t2: T2, t3: T3) => S) =>
            holdersImpl.hold<T1, T2, T3, S>(
              {apply: (t1, t2, t3) => f(t1, t2, t3)} as GenericFunction3<
                T1,
                T2,
                T3,
                S
              >,
              s1,
              s2,
              s3
            ),
        }),
        onValue: <S>(f: (t1: T1, t2: T2) => S) =>
          holdersImpl.hold<T1, T2, S>(
            {apply: (t1, t2) => f(t1, t2)} as GenericFunction2<T1, T2, S>,
            s1,
            s2
          ),
      }),
      onValue: <S>(f: (t1: T1) => S) =>
        holdersImpl.hold<T1, S>(
          {apply: t1 => f(t1)} as GenericFunction1<T1, S>,
          s1
        ),
    }),
  };
})();
