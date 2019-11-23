function htmlDecode(input) {
  const e = document.createElement('textarea');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
}

function shuffle(arr = []) {
  const array = arr;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export { htmlDecode, shuffle };
