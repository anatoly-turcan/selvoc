export type NonNullableObject<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type PropertiesOf<T> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
  }[keyof T]
>;
