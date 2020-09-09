type milisecond = number;

export const wait = (time: milisecond): Promise<void> =>
  new Promise(resolve => {
    setTimeout(() => resolve(), time);
  });
