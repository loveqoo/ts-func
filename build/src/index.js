"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOf = exports.isValid = void 0;
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