export const deepCopy = (obj: any): any => JSON.parse(JSON.stringify(obj));

export const click = (button: HTMLElement) => {
  const event = new Event('click');
  button.dispatchEvent(event);
};

export const setInputValue = (input: HTMLIonInputElement, value: string) => {
  const event = new InputEvent('ionChange');
  input.value = value;
  input.dispatchEvent(event);
};
