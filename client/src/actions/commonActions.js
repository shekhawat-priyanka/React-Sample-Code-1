import {
  INITIAL_LOADING,
  LOADING_ON_SUBMIT,
  INITIAL_MODAL_STATE,
} from "./types";

// Dispatch Loading
export const initialLoading = () => async (dispatch) => {
  await dispatch({ type: INITIAL_LOADING });
};

// Dispatch Loading
export const loadingOnSubmit = () => async (dispatch) => {
  await dispatch({ type: LOADING_ON_SUBMIT });
};

// Dispatch Modal state
export const initialModalState = () => async (dispatch) => {
  await dispatch({ type: INITIAL_MODAL_STATE });
};
