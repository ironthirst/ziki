export function times(n: number) {
  return new Array(n).fill(undefined).map((v, i) => i);
}

export function chunk<T>(arr: T[], n: number) {
  // assuming n > 0;
  const chunked = [] as T[][];
  for (let i = 0; i < arr.length; i += n) {
    chunked.push(arr.slice(i, i + n));
  }
  return chunked;
}

const debounceCache: { [key: string]: () => void } = {};

export function debounce(func: () => void, delay: number, key: string) {
  if (!debounceCache[key]) {
    setTimeout(() => {
      debounceCache[key]();
      debounceCache[key] = null;
    }, delay);
  }
  debounceCache[key] = func;
}
