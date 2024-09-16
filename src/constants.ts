export const feeRate = 16;
export const weigthPerBlock = 1000000 / 200;

export const newgrid = Array(30).fill(Array(10).fill(0));

export const I_SHAPE = [[1, 1, 1, 1]];

export const O_SHAPE = [
  [1, 1],
  [1, 1],
];

export const T_SHAPE = [
  [0, 1, 0],
  [1, 1, 1],
];

export const S_SHAPE = [
  [0, 1, 1],
  [1, 1, 0],
];

export const Z_SHAPE = [
  [1, 1, 0],
  [0, 1, 1],
];

export const J_SHAPE = [
  [1, 0, 0],
  [1, 1, 1],
];

export const L_SHAPE = [
  [0, 0, 1],
  [1, 1, 1],
];

export const shapes = [
  { number: 8, shape: I_SHAPE },
  { number: 2, shape: O_SHAPE },
  { number: 3, shape: T_SHAPE },
  { number: 4, shape: S_SHAPE },
  { number: 5, shape: Z_SHAPE },
  { number: 6, shape: J_SHAPE },
  { number: 7, shape: L_SHAPE },
];
