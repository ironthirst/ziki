import { SHOW_MODAL, HIDE_MODAL } from "../actions/modal-actions";

export type ModalReduxState = typeof initialState;

const initialState = {
  isOpen: false,
  title: "",
  message: "",
  error: null as Error,
};

export const modal = (state = initialState, action: any): ModalReduxState => {
  switch (action.type) {
    case SHOW_MODAL: {
      const error = action.error as Error;
      const message: string =
        error?.message || action.message || "預期外的錯誤";

      return {
        ...state,
        isOpen: true,
        title: action.title || "錯誤",
        message,
        error,
      };
    }
    case HIDE_MODAL:
      return {
        ...state,
        isOpen: false,
        title: null,
        message: null,
        error: null,
      };
    default:
      return state;
  }
};
