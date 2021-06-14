export function times(n: number) {
  return new Array(Math.max(n, 0)).fill(undefined).map((v, i) => i);
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

export function downloadFile(file: File) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = URL.createObjectURL(file);
  link.download = file.name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode.removeChild(link);
  }, 0);
}
