export type Spied<T> = {
  [Method in keyof T]: jasmine.Spy;
};
export const timeout = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));
