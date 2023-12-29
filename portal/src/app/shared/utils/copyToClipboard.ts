export function copyFromNonInputElement(element: HTMLElement) {
  const range = document.createRange();
  range.selectNode(element);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

export function copyFromInput(inputElement: HTMLInputElement) {
  inputElement.select();
  document.execCommand("copy");
}
