import axios from "axios";
import { setAlert } from "actions/alert";
import { setErrorsList } from "actions/errors";

import {
  SETTING_ERROR,
  SETTING_UPDATED,
  GET_SETTING,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT,
  REMOVE_ERRORS,
} from "actions/types";

// Edit Setting
export const edit = (formData, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(`/api/admin/socialSetting`, formData, config);
    if (res.data.status === true) {
      dispatch({
        type: SETTING_UPDATED,
        payload: res.data.response,
      });
      dispatch(loadingOnSubmit());
      dispatch(setAlert("Setting Updated.", "success"));
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach((error) => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
  } catch (err) {
    dispatch({
      type: SETTING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get Setting
export const getSetting = (history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get(`/api/admin/socialSetting/`, config);

    await dispatch({
      type: GET_SETTING,
      payload: res.data.response,
    });
    return res.data.response;
  } catch (err) {
    dispatch({
      type: SETTING_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Dispatch Loading
export const initialLoading = () => async (dispatch) => {
  await dispatch({ type: INITIAL_LOADING });
};

// Dispatch Loading
export const loadingOnSubmit = () => async (dispatch) => {
  await dispatch({ type: LOADING_ON_SUBMIT });
};

//Dispatch checkbox error
export const setCheckboxError = (msg, param) => async (dispatch) => {
  dispatch(setErrorsList(msg, param));
  dispatch(
    setAlert(
      "Errors! Please correct the following errors and submit again.",
      "danger"
    )
  );
};

// cancel
export const cancelSave = (history) => async (dispatch) => {
  // dispatch({ type: REMOVE_ALERT });
  dispatch({ type: REMOVE_ERRORS });
  history.push("/admin");
};
