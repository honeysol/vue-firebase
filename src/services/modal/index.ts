import Vue from "vue";

interface ModalComponent {
  add({
    props,
    callback,
    component
  }: {
    props: any;
    callback: (result: any) => void;
    component: typeof Vue;
  }): Promise<void>;
}

class ModalService {
  modalComponent = null as ModalComponent | null;
  openModal({ props, component }: { props: any; component: typeof Vue }) {
    return new Promise(resolve => {
      this.modalComponent?.add({ props, component, callback: resolve });
    });
  }

  registerComponent(modalComponent: ModalComponent) {
    this.modalComponent = modalComponent;
  }
}

export default new ModalService();
