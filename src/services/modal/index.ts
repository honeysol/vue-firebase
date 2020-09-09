import Vue from "vue";

interface ModalComponent {
  add<P, V>({
    props,
    callback,
    component
  }: {
    props: P;
    callback: (result: V | null) => void;
    component: typeof Vue;
  }): void;
}

class ModalService {
  modalComponent: ModalComponent | null = null;
  openModal<P, V>({ props, component }: { props: P; component: typeof Vue }) {
    return new Promise<V | null>(resolve => {
      this.modalComponent?.add({ props, component, callback: resolve });
    });
  }

  registerComponent(modalComponent: ModalComponent) {
    this.modalComponent = modalComponent;
  }
}

export default new ModalService();
