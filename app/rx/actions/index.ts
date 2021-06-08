import { ModalActions as modal } from "./modal-actions";
import { SiteActions as site } from "./site-actions";

// import { actions as CoreActions } from "../../modules/Core/actions";
// import { actions as CorporationActions } from "../../modules/Corporation/actions";

type AsyncCallback<T = any> = () => Promise<T>;

export const actions = {
  modal,
  site,
  // ...CoreActions,
  // ...CorporationActions,
  wait<T = any>(
    dispatch: any,
    cb: AsyncCallback<T>,
    opt?: { silent?: boolean }
  ) {
    return dispatch(async (dispatch: any) => {
      const { silent = false } = opt || {};
      let res: T | null = null; // the potentially return obj
      if (!silent) dispatch(site.startPageLoading());
      try {
        res = await cb(); // capture the callback result
      } catch (error) {
        dispatch(modal.showAlertModal({ error }));
      }
      if (!silent) dispatch(site.stopPageLoading());
      return res; // and return the result
    });
  },
};
