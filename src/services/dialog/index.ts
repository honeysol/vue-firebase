import Dialog from "./Dialog.vue";

export interface ButtonParams<V> {
  title: string;
  class: string;
  value: V;
  url?: string;
  filename?: string;
}
interface DialogProps<V> {
  title: string;
  text: string;
  buttons: ButtonParams<V>[];
}

import modalService from "@/services/modal";

const openDialog = <V>({
  title,
  text,
  buttons
}: {
  title: string;
  text: string;
  buttons: ButtonParams<V>[];
}): Promise<V | null> => {
  return modalService.openModal<DialogProps<V>, V>({
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
  const response = await openDialog({
    title,
    text,
    buttons: [
      {
        title: "OK",
        class: "btn-primary",
        value: true as true
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
}) => {
  const response = await openDialog({
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

export const download = async ({
  title,
  text,
  url,
  filename
}: {
  title: string;
  text: string;
  url: string;
  filename: string;
}) => {
  const response = await openDialog({
    title,
    text,
    buttons: [
      {
        title: "download",
        class: "btn-primary",
        value: true,
        url,
        filename
      }
    ]
  });
  return response;
};
