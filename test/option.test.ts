import {Option} from '../src/option';

describe('Option Test', () => {
  test('map x getOrElse - success', () => {
    expect(
      Option.Some(1)
        .map(v => v * 10)
        .getOrElse(0)
    ).toBe(10);
  });
  test('map x getOrElse - undefined', () => {
    expect(
      Option.Some([0])
        .map(v => v[1])
        .getOrElse(0)
    ).toBe(0);
  });
  test('filter x getOrElse', () => {
    expect(
      Option.Some(1)
        .filter(v => v === 0)
        .getOrElse(0)
    ).toBe(0);
  });
  test('filter x orElse x getOrElse', () => {
    expect(
      Option.Some(1)
        .filter(v => v > 0)
        .orElse(() => Option.Some(10))
        .getOrElse(0)
    ).toBe(1);
  });
  test('flatMap', () => {
    expect(
      Option.Some(1)
        .flatMap(a => Option.Some(a * 2))
        .getOrElse(0)
    ).toBe(2);
  });
  test('ap(map x getOrElse)', () => {
    const maybeFive = Option.pure(5);
    const maybeTwo = Option.pure(2);
    expect(maybeTwo.ap(maybeFive.map(f => t => f + t)).getOrElse(0)).toBe(7);
  });
});