import {ImmutableList, immutableListFrom, immutableListOf} from '../src/list';
import {Result} from '../src/result';

const bigSource: Array<number> = [];
for (let i = 1, j = 10000; i <= j; i++) {
  bigSource.push(i);
}
const smallSource = [1, 2, 3, 4, 5];

const unitList: ImmutableList<number> = immutableListOf(1);
let nestedSmallList: ImmutableList<ImmutableList<number>> = immutableListOf(
  unitList
);
for (let i = 1, j = 5; i < j; i++) {
  nestedSmallList = nestedSmallList.cons(unitList);
}
let nestedBigList: ImmutableList<ImmutableList<number>> = immutableListOf(
  unitList
);
for (let i = 1, j = 10000; i < j; i++) {
  nestedBigList = nestedBigList.cons(unitList);
}

describe('ImmutableList 생성 Test', () => {
  test('ImmutableList - 생성', () => {
    expect(immutableListOf(1, 2, 3, 4, 5)).not.toBeNull();
    expect(immutableListFrom(smallSource)).not.toBeNull();
    const elapsed = stopWatch(() => {
      expect(immutableListFrom(bigSource)).not.toBeNull();
    });
    console.log(`create (${bigSource.length} items) : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(5);
  });
});

describe('ImmutableList Test', () => {
  const smallList = immutableListFrom(smallSource);
  const bigList = immutableListFrom(bigSource);

  test('ImmutableList - toString', () => {
    const result = '[' + bigSource.join(', ') + ', NIL]';
    const elapsed = stopWatch(() => {
      expect(bigList.toString()).toBe(result);
    });
    console.log(`toString() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(15);
  });
  test('ImmutableList - setHead', () => {
    expect(smallList.setHead(0).toString()).toBe('[0, 2, 3, 4, 5, NIL]');
    expect(() => immutableListOf().setHead(0)).toThrow(
      '빈 배열에 setHead 연산을 할 수 없음'
    );
  });
  test('ImmutableList - reverse', () => {
    expect(smallList.reverse().toString()).toBe('[5, 4, 3, 2, 1, NIL]');
    let result: ImmutableList<number>;
    const elapsed = stopWatch(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = bigList.reverse();
    });
    console.log(`reverse() : ${elapsed} ms`);
  });
  test('ImmutableList - drop', () => {
    expect(smallList.drop(4).toString()).toBe('[5, NIL]');
    let result: ImmutableList<number>;
    const elapsed = stopWatch(() => {
      result = bigList.drop(9999);
    });
    console.log(`drop() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(10);
    expect(result!.toString()).toBe('[10000, NIL]');
    expect(immutableListOf().drop(9999).toString()).toBe('[NIL]');
  });
  test('ImmutableList - dropWhile', () => {
    let result: ImmutableList<number>;
    const elapsed = stopWatch(() => {
      result = bigList.dropWhile(v => v < 10000);
    });
    console.log(`dropWhile() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(13);
    expect(result!.toString()).toBe('[10000, NIL]');
    expect(
      immutableListOf<number>()
        .dropWhile(v => v < 10000)
        .toString()
    ).toBe('[NIL]');
  });
  test('ImmutableList - foldLeft', () => {
    expect(smallList.foldLeft(0, acc => v => acc + v)).toBe(((1 + 5) * 5) / 2);
    const elapsed = stopWatch(() => {
      expect(bigList.foldLeft(0, acc => v => acc + v)).toBe(
        ((1 + 10000) * 10000) / 2
      );
    });
    console.log(`foldLeft() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(13);
  });
  test('ImmutableList - foldRight', () => {
    expect(smallList.foldRight(0, acc => v => acc + v)).toBe(((1 + 5) * 5) / 2);
    expect(() => {
      bigList.foldRight(0, acc => v => acc + v);
    }).toThrow('Maximum call stack size exceeded'); // foldRight 는 꼬리 호출 최적화를 할 수 없기 때문에 (연산을 뒤로 미룸) 스택 최적화를 할 수 없다.
  });
  test('ImmutableList - coFoldRight', () => {
    expect(smallList.coFoldRight(0, acc => v => acc + v)).toBe(
      ((1 + 5) * 5) / 2
    );
    const elapsed = stopWatch(() => {
      expect(bigList.coFoldRight(0, acc => v => acc + v)).toBe(
        ((1 + 10000) * 10000) / 2
      );
    });
    console.log(`coFoldRight() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(13);
  });
  test('ImmutableList - dropLast', () => {
    expect(smallList.dropLast().toString()).toBe('[1, 2, 3, 4, NIL]');
    let result: ImmutableList<number> | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.dropLast();
    });
    expect(!!result).toBe(true);
    console.log(`dropLast() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(16);
  });
  test('ImmutableList - traverse', () => {
    expect(smallList.traverse(Result.pure).toString()).toBe(
      'Success([1, 2, 3, 4, 5, NIL])'
    );
    let result: Result<ImmutableList<number>> | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.traverse(Result.pure);
    });
    expect(!!result).toBe(true);
    console.log(`traverse() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(45);
  });
  test('ImmutableList - zipWith', () => {
    const otherList = immutableListFrom(["a", "b", "c"])
    expect(smallList.zipWith(otherList, n => s => `${n}:${s}`).toString()).toBe(
        '[1:a, 2:b, 3:c, NIL]'
    );
    let result: ImmutableList<string> | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.zipWith(bigList, n => s => `${n}:${s}`);
    });
    expect(!!result).toBe(true);
    console.log(`zipWith() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(15);
  });
  test('ImmutableList - product', () => {
    const otherList = immutableListFrom(["a", "b", "c"])
    expect(smallList.product(otherList, n => s => `${n}:${s}`).toString()).toBe(
        '[1:a, 1:b, 1:c, 2:a, 2:b, 2:c, 3:a, 3:b, 3:c, 4:a, 4:b, 4:c, 5:a, 5:b, 5:c, NIL]'
    );
    let result: ImmutableList<string> | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.product(smallList, n => s => `${n}:${s}`);
    });
    expect(!!result).toBe(true);
    console.log(`product() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(72);
  });

  test('ImmutableList - unzip', () => {
    expect(smallList.unzip(n => [n, n * 2]).toString()).toBe(
        '[1, 2, 3, 4, 5, NIL],[2, 4, 6, 8, 10, NIL]'
    );
    let result: [ImmutableList<number>, ImmutableList<number>] | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.unzip(n => [n, n * 2]);
    });
    expect(!!result).toBe(true);
    console.log(`unzip() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(23);
  });

  test('ImmutableList - concat', () => {
    expect(
      smallList.concat(immutableListFrom([6, 7, 8, 9, 10])).toString()
    ).toBe('[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, NIL]');
    const fromList = immutableListOf(0);
    let result: ImmutableList<number> | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.concat(fromList);
    });
    expect(!!result).toBe(true);
    console.log(`concat() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(14);
  });
  test('ImmutableList - flatten', () => {
    expect(ImmutableList.flatten(nestedSmallList).toString()).toBe(
      '[1, 1, 1, 1, 1, NIL]'
    );

    let result: ImmutableList<number> | undefined;
    const elapsed = stopWatch(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = ImmutableList.flatten(nestedBigList);
    });
    console.log(`flatten() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(50);
  });
  // map, filter, flatMap
  test('ImmutableList - map', () => {
    expect(smallList.map(v => `{${v}}`).toString()).toBe(
      '[{1}, {2}, {3}, {4}, {5}, NIL]'
    );

    let result: ImmutableList<string> | undefined;
    const elapsed = stopWatch(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = bigList.map(v => `{${v}}`);
    });
    console.log(`map() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(20);
  });
  test('ImmutableList - filter', () => {
    expect(smallList.filter(v => v > 4).toString()).toBe('[5, NIL]');

    let result: ImmutableList<number> | undefined;
    const elapsed = stopWatch(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = bigList.filter(v => v % 2 === 0);
    });
    console.log(`filter() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(35);
  });
  test('ImmutableList - flatMap', () => {
    expect(smallList.flatMap(v => immutableListOf(`{${v}}`)).toString()).toBe(
      '[{1}, {2}, {3}, {4}, {5}, NIL]'
    );

    let result: ImmutableList<string> | undefined;
    const elapsed = stopWatch(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      result = bigList.flatMap(v => immutableListOf(`{${v}}`));
    });
    console.log(`flatMap() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(50);
  });
  test('ImmutableList - size', () => {
    expect(smallList.size()).toBe(5);

    let result: number | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.size();
    });
    console.log(`size() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(12);
    expect(result!).toBe(10000);
  });
  test('ImmutableList - length', () => {
    expect(smallList.length).toBe(5);

    let result: number | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.length;
    });
    console.log(`length : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(1);
    expect(result!).toBe(10000);
  });
  test('ImmutableList - getAt', () => {
    expect(smallList.getAt(4).getOrElse(() => -1)).toBe(5);

    let result: number | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.getAt(9999).getOrElse(() => -1);
    });
    console.log(`getAt() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(12);
    expect(result!).toBe(10000);
  });
  test('ImmutableList - splitAt', () => {
    const [smallLeft, smallRight] = smallList.splitAt(2);
    expect(smallLeft.toString()).toBe('[1, 2, NIL]');
    expect(smallRight.toString()).toBe('[3, 4, 5, NIL]');

    let result: [ImmutableList<number>, ImmutableList<number>] | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.splitAt(5000);
    });
    console.log(`splitAt() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(10);
    expect(result![0].length).toBe(5000);
    expect(result![1].length).toBe(5000);
  });
  test('ImmutableList - hasSubList', () => {
    expect(smallList.hasSubList(immutableListFrom([1, 2]))).toEqual(true);
    expect(smallList.hasSubList(immutableListFrom([2, 3]))).toEqual(true);
    expect(smallList.hasSubList(immutableListFrom([3, 2]))).toEqual(false);
    let result: boolean | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.hasSubList(immutableListFrom([7777, 7778, 7779, 7780]));
    });
    console.log(`hasSubList() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(16);
    expect(result!).toBe(true);
  });
  test('ImmutableList - groupBy', () => {
    expect(
      smallList
        .groupBy(x => (x % 2 === 0 ? 'even' : 'odd'))
        .get('even')
        ?.toString() || 'fail'
    ).toBe('[2, 4, NIL]');
    let result: Map<string, ImmutableList<number>> | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.groupBy(x => (x % 2 === 0 ? 'even' : 'odd'));
    });
    console.log(`groupBy() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(18);
    expect(result!.size).toBe(2);
  });
  test('ImmutableList - unfold', () => {
    expect(
      ImmutableList.unfold(0, i =>
        i < 10 ? Result.Success([i, i + 1]) : Result.Empty<[number, number]>()
      ).toString()
    ).toBe('Success([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, NIL])');
  });
  test('ImmutableList - range', () => {
    expect(ImmutableList.range(1, 10).toString()).toBe(
      '[1, 2, 3, 4, 5, 6, 7, 8, 9, NIL]'
    );
  });
  test('ImmutableList - exists', () => {
    expect(smallList.exists(v => v === 4)).toBe(true);
    let result: boolean | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.exists(v => v === 9898);
    });
    console.log(`exists() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(10);
    expect(result!).toBe(true);
  });
  test('ImmutableList - forAll', () => {
    expect(smallList.forAll(v => v < 6)).toBe(true);
    let result: boolean | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.forAll(v => v < 10001);
    });
    console.log(`forAll() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(9);
    expect(result!).toBe(true);
  });
  test('ImmutableList - splitListAt', () => {
    const splitResult = smallList.splitListAt(2);
    expect(splitResult.length).toBe(2);
    expect(
      splitResult
        .getAt(0)
        .map(list => list.length)
        .getOrElse(() => 0)
    ).toBe(2);
    expect(
      splitResult
        .getAt(1)
        .map(list => list.length)
        .getOrElse(() => 0)
    ).toBe(3);
    let result: ImmutableList<ImmutableList<number>> | undefined;
    const elapsed = stopWatch(() => {
      result = bigList.splitListAt(5000);
    });
    console.log(`splitListAt() : ${elapsed} ms`);
    expect(elapsed).toBeLessThan(12);
    expect(
      result!
        .getAt(0)
        .map(list => list.length)
        .getOrElse(() => 0)
    ).toBe(5000);
  });
  test('ImmutableList - divide', () => {
    ImmutableList.divide(bigList, 5).forEach(_ => console.log(_.toString()));
  });
});

export const stopWatch = (f: () => void) => {
  const startAt = Date.now();
  f();
  const endAt = Date.now();
  return endAt - startAt; // ms
};
