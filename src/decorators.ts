export const sealed = (constructor: Function) => {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
};

export const frozen = (constructor: Function) => {
  Object.freeze(constructor);
  Object.freeze(constructor.prototype);
};
