export const SHOW_MODAL = "SHOW_MODAL";
export const HIDE_MODAL = "HIDE_MODAL";

// get basic information
export const ModalActions = {
  showAlertModal(opt: { error?: Error; message?: string; title?: string }) {
    const { error, message, title } = opt;
    return { type: SHOW_MODAL, error, message, title };
  },
  error(message: string) {
    return { type: SHOW_MODAL, message, title: "錯誤" };
  },
  info(message: string) {
    return { type: SHOW_MODAL, message, title: "訊息" };
  },
  hideAlertModal() {
    return { type: HIDE_MODAL };
  },
};
