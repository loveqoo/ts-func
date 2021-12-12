"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOf = exports.isValid = exports.Combine = exports.Monoid = exports.Zero = exports.Semigroup = exports.combine = exports.pipe = void 0;
const list_1 = require("./list");
const pipe = (f) => (g) => (x) => g(f(x));
exports.pipe = pipe;
const combine = (f) => (g) => (x) => f(g(x));
exports.combine = combine;
const arraySemigroupBuilder = () => (t1) => (t2) => t1.concat(t2);
exports.Semigroup = {
    number: (t1 => t2 => t1 + t2),
    string: (t1 => t2 => t1 + t2),
    booleanAnd: (t1 => t2 => t1 && t2),
    booleanOr: (t1 => t2 => t1 || t2),
    array: arraySemigroupBuilder,
    arrayNumber: arraySemigroupBuilder(),
    arrayString: arraySemigroupBuilder(),
    immutableList: () => (t1) => (t2) => t1.concat(t2),
};
exports.Zero = {
    string: '',
    number: 0,
    booleanAnd: true,
    booleanOr: false,
    array: () => [],
    immutableList: () => list_1.immutableListFrom([]),
};
const monoidBuilder = (semigroup, zero) => ({
    zero: zero,
    op: semigroup,
});
exports.Monoid = {
    number: monoidBuilder(exports.Semigroup.number, exports.Zero.number),
    string: monoidBuilder(exports.Semigroup.string, exports.Zero.string),
    booleanAnd: monoidBuilder(exports.Semigroup.booleanAnd, exports.Zero.booleanAnd),
    booleanOr: monoidBuilder(exports.Semigroup.booleanOr, exports.Zero.booleanOr),
    array: () => ({
        zero: exports.Zero.array(),
        op: exports.Semigroup.array(),
    }),
    immutableList: () => ({
        zero: exports.Zero.immutableList(),
        op: exports.Semigroup.immutableList(),
    }),
};
const combineArray = (monoid) => (array) => array.reduce((previousValue, currentValue) => monoid.op(previousValue)(currentValue), monoid.zero);
const combineArgs = (monoid) => (...arg) => combineArray(monoid)(arg);
exports.Combine = {
    array: combineArray,
    args: combineArgs,
    arrayNumber: combineArray(exports.Monoid.number),
    arrayString: combineArray(exports.Monoid.string),
    argsNumber: combineArgs(exports.Monoid.number),
    argsString: combineArgs(exports.Monoid.string)
};
const isValid = (value) => value === null ? false : typeof value !== 'undefined';
exports.isValid = isValid;
const typeOf = (a) => {
    switch (typeof a) {
        case 'undefined':
            return 'undefined';
        case 'boolean':
            return 'boolean';
        case 'number':
            return 'number';
        case 'string':
            return 'string';
        case 'symbol':
            return 'symbol';
        case 'bigint':
            return 'bigint';
        case 'function':
            return 'function';
        default: {
            if (a === null) {
                return 'null';
            }
            if (Array.isArray(a)) {
                return 'array';
            }
            return 'object';
        }
    }
};
exports.typeOf = typeOf;
//# sourceMappingURL=index.js.map