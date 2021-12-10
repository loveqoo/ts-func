import {immutableListOf} from "../src/list";
import {Monoids, Semigroups, Zero} from "../src/combine";


describe('Monoid', () => {
    test('foldRight - string', () => {
        const word = immutableListOf("H", "E", "L", "L", "O");
        console.log(word.foldRight(Monoids.string.zero, Monoids.string.op))
        console.log(word.foldLeft(Monoids.string.zero, Monoids.string.op))
    })
});