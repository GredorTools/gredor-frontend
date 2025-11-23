import { reactive, readonly, toRefs } from "vue";

export interface ModalDefinition {
  id: number;
  title?: string;
  text: string;
}

const state = reactive({
  modalDefinitions: [] as ModalDefinition[],
});

let id = 0;

export function useModalStore() {
  const { modalDefinitions } = toRefs(state);

  function showMessageModal(text: string, title?: string) {
    state.modalDefinitions.push({ id: ++id, title, text });
  }

  function popTopModalDefinition() {
    if (state.modalDefinitions.length > 0) {
      state.modalDefinitions.pop();
    }
  }

  return {
    modalDefinitions: readonly(modalDefinitions),
    showMessageModal,
    popTopModalDefinition,
  };
}
