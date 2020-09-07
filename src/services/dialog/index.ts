import Dialog from "./Dialog.vue";

export interface ButtonParams<T> {
  title: string;
  class: string;
  value: T;
}

import modalService from "@/services/modal";

const openDialog = <T>({
  title,
  text,
  buttons
}: {
  title: string;
  text: string;
  buttons: Array<ButtonParams<T>>;
}): Promise<T | null> => {
  return modalService.openModal<T>({
    props: {
      title,
      text,
      buttons
    },
    component: Dialog
  });
};

export const alert = async ({
  title,
  text
}: {
  title: string;
  text: string;
}) => {
  const response = await openDialog<true>({
    title,
    text,
    buttons: [
      {
        title: "OK",
        class: "btn-primary",
        value: true
      }
    ]
  });
  return response;
};

export const confirm = async ({
  title,
  text
}: {
  title: string;
  text: string;
}): Promise<boolean | null> => {
  const response = await openDialog<boolean>({
    title,
    text,
    buttons: [
      {
        title: "OK",
        class: "btn-primary",
        value: true
      },
      {
        title: "Cancel",
        class: "btn-secondary",
        value: false
      }
    ]
  });
  return response;
};
