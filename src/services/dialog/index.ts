import Dialog from "./Dialog.vue";

export interface ButtonParams {
  title: string;
  class: string;
  value: any;
}

import modalService from "@/services/modal";

const openDialog = ({
  title,
  text,
  buttons
}: {
  title: string;
  text: string;
  buttons: Array<ButtonParams>;
}) => {
  return modalService.openModal({
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
}): Promise<true | null> => {
  const response = await openDialog({
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
  return response as true | null;
};

export const confirm = async ({
  title,
  text
}: {
  title: string;
  text: string;
}): Promise<boolean | null> => {
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
  return response as boolean | null;
};
