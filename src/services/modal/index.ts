import Vue from "vue";

interface ModalComponent {
  add<T>({
    props,
    callback,
    component
  }: {
    props: any;
    callback: (result: T | null) => void;
    component: typeof Vue;
  }): void;
}

class ModalService {
  modalComponent: ModalComponent | null = null;
  openModal<T>({ props, component }: { props: any; component: typeof Vue }) {
    return new Promise<T | null>(resolve => {
      this.modalComponent?.add({ props, component, callback: resolve });
    });
  }

  registerComponent(modalComponent: ModalComponent) {
    this.modalComponent = modalComponent;
  }
}

export default new ModalService();
