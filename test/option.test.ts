import {Option} from '../src/option';
import {Semigroup} from '../src/combine';

describe('Option Test', () => {
  test('map x getOrElse - success', () => {
    expect(
      Option.Some(1)
        .map(v => v * 10)
        .getOrElse(() => 0)
    ).toBe(10);
  });
  test('map x getOrElse - undefined', () => {
    expect(
      Option.Some([0])
        .map(v => v[1])
        .getOrElse(() => 0)
    ).toBe(0);
  });
  test('filter x getOrElse', () => {
    expect(
      Option.Some(1)
        .filter(v => v === 0)
        .getOrElse(() => 0)
    ).toBe(0);
  });
  test('filter x orElse x getOrElse', () => {
    expect(
      Option.Some(1)
        .filter(v => v > 0)
        .orElse(() => Option.Some(10))
        .getOrElse(() => 0)
    ).toBe(1);
  });
  test('flatMap', () => {
    expect(
      Option.Some(1)
        .flatMap(a => Option.Some(a * 2))
        .getOrElse(() => 0)
    ).toBe(2);
  });
  test('ap(map x getOrElse)', () => {
    const maybeFive = Option.pure(5);
    const maybeThree = Option.pure(3);
    const maybeTwo = Option.pure(2);
    expect(maybeTwo.ap(maybeFive.map(f => t => f + t)).getOrElse(() => 0)).toBe(
      7
    );

    const sum = (a: number) => (b: number) => a + b;
    expect(
      maybeFive
        .ap(maybeThree.map(sum))
        .ap(maybeTwo.map(sum))
        .getOrElse(() => 0)
    ).toBe(10);
    expect(
      maybeFive.ap(maybeThree.map(sum), maybeTwo.map(sum)).getOrElse(() => 0)
    ).toBe(10);
  });
  test('map x map x map', () => {
    const f1 = (a: number) => a.toString();
    const f2 = (a: string) => parseInt(a, 10);
    const f3 = (a: number) => a * 4;
    expect(
      Option.Some(1)
        .map(f1, f2, f3)
        .getOrElse(() => 0)
    ).toBe(4);
  });
  test('flatMap x flatMap x flatMap', () => {
    const f1 = (a: number) => Option.Some(a.toString());
    const f2 = (a: string) => Option.Some(parseInt(a, 10));
    const f3 = (a: number) => Option.Some(a * 4);
    expect(
      Option.Some(1)
        .flatMap(f1, f2, f3)
        .getOrElse(() => 0)
    ).toBe(4);
  });
  test('combine test', () => {
    expect(
      Option.pure(3)
        .combine(Semigroup.number, Option.pure(6))
        .getOrElse(() => 0)
    ).toBe(9);
    expect(
      Option.pure(3)
        .combine2(Semigroup.number)(Option.pure(6))
        .getOrElse(() => 0)
    ).toBe(9);
    expect(
      Option.pure([1])
        .combine(Semigroup.array, Option.pure([2]), Option.pure([3]))
        .map(Semigroup.arrayNumber)
        .getOrElse(() => 0)
    ).toBe(6);
    expect(
      Option.pure([1])
        .combine2(Semigroup.array)(Option.pure([2]), Option.pure([3]))
        .map(Semigroup.arrayNumber)
        .getOrElse(() => 0)
    ).toBe(6);
    expect(
      Option.pure(['a'])
        .combine(Semigroup.array, Option.pure(['b']), Option.pure(['c']))
        .map(Semigroup.arrayString)
        .getOrElse(() => '')
    ).toBe('abc');
    expect(
      Option.pure(['a'])
        .combine2(Semigroup.array)(Option.pure(['b']), Option.pure(['c']))
        .map(Semigroup.arrayString)
        .getOrElse(() => '')
    ).toBe('abc');
    expect(
      Option.pure(['a'])
        .combine(Semigroup.array, Option.pure(['b']), Option.None())
        .map(Semigroup.arrayString)
        .getOrElse(() => '')
    ).toBe('');
    expect(
      Option.pure(['a'])
        .combine2(Semigroup.array)(Option.pure(['b']), Option.None())
        .map(Semigroup.arrayString)
        .getOrElse(() => '')
    ).toBe('');
  });
});
