import {immutableListOf} from '../src/list';
import {Monoid} from '../src';

describe('Monoid', () => {
  test('foldRight - string', () => {
    const word = immutableListOf('H', 'E', 'L', 'L', 'O');
    const result = 'HELLO';
    expect(word.foldRight(Monoid.string.zero, Monoid.string.op)).toEqual(
      result
    );
    expect(word.foldLeft(Monoid.string.zero, Monoid.string.op)).toEqual(result);
  });
  test('foldRight - Array<string>', () => {
    const word = immutableListOf(['H'], ['E'], ['L'], ['L'], ['O']);
    const arrayStringMonoid = Monoid.array<string>();
    const result = ['H', 'E', 'L', 'L', 'O'];
    expect(
      word.foldRight(arrayStringMonoid.zero, arrayStringMonoid.op)
    ).toEqual(result);
    expect(word.foldLeft(arrayStringMonoid.zero, arrayStringMonoid.op)).toEqual(
      result
    );
  });
});
