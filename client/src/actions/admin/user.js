import axios from "axios";
import { setAlert } from "actions/alert";
import { setErrorsList } from "actions/errors";

import {
  USER_CREATED,
  USER_ERROR,
  DELETE_USER,
  USER_UPDATED,
  USER_LIST_UPDATED,
  GET_USER_BY_ID,
  USER_SEARCH_PARAMATERS_UPDATE,
  CHANGE_USER_STATUS,
  REMOVE_ERRORS,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT,
  INITIAL_MODAL_STATE,
  CHANGE_USER_STATUS_BULK
} from "actions/types";

// Create User
export const create = (formData, history) => async dispatch => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const res = await axios.post("/api/admin/user/create", formData, config);
    if (res.data.status === true) {
      dispatch({
        type: USER_CREATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Customer created.", "success"));
      history.push("/admin/customers");
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach(error => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Edit Password
export const editPassword = (formData, history, user_id) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `/api/admin/user/edit/password/${user_id}`,
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch({
        type: USER_UPDATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      // dispatch({ type: REMOVE_ALERT });
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Password Updated.", "success"));
      // history.push("/admin/customers");
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));

        errors.forEach(error => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Edit User
export const edit = (formData, history, user_id) => async dispatch => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const res = await axios.post(
      `/api/admin/user/${user_id}`,
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch({
        type: USER_UPDATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Customer updated.", "success"));
      history.push("/admin/customers");
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
        errors.forEach(error => {
          dispatch(setErrorsList(error.msg, error.param));
        });
      }
    }
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete User
export const deleteUser = (user_id, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    await axios.delete(`/api/admin/user/${user_id}`, config);
    dispatch({
      type: DELETE_USER,
      payload: user_id
    });
    dispatch(setAlert("Customer deleted", "success"));
  } catch (err) {
    // console.log(err);
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//get users list

export const getUsersList = userParams => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const query = userParams.query
      ? userParams.query
      : "&query=&approved_status=";
    const res = await axios.get(
      `/api/admin/user?limit=${userParams.limit}&page=${userParams.page}&orderBy=${userParams.orderBy}&ascending=${userParams.ascending}${query}`,
      config
    );
    dispatch({
      type: USER_SEARCH_PARAMATERS_UPDATE,
      payload: userParams
    });
    dispatch({
      type: USER_LIST_UPDATED,
      payload: res.data.response[0]
    });
  } catch (err) {
    // console.log(err);
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// get User by id
export const getUserById = user_id => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.get(`/api/admin/user/${user_id}`, config);
    // dispatch({ type: REMOVE_ALERT });

    await dispatch({
      type: GET_USER_BY_ID,
      payload: res.data.response
    });
    return res.data.response;
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete User
export const cancelSave = history => async dispatch => {
  // dispatch({ type: REMOVE_ALERT });
  dispatch({ type: REMOVE_ERRORS });
  history.push("/admin/customers");
};

//change status
export const changeStatus = (user_id, status) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post(
      `/api/admin/user/change-status/${user_id}`,
      { status },
      config
    );
    // dispatch({ type: REMOVE_ALERT });

    await dispatch({
      type: CHANGE_USER_STATUS,
      payload: res.data.response
    });
    dispatch(setAlert(res.data.message, "success"));
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//change Bulk user status
export const userChangeStatusInBulk = statusFormData => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post(
      `/api/admin/user/bulk-change-status`,
      { ...statusFormData },
      config
    );

    await dispatch({
      type: CHANGE_USER_STATUS_BULK,
      payload: res.data.response
    });
    dispatch(setAlert(res.data.message, "success"));
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Dispatch Loading
export const initialLoading = () => async dispatch => {
  await dispatch({ type: INITIAL_LOADING });
};

// Dispatch Loading
export const loadingOnSubmit = () => async dispatch => {
  await dispatch({ type: LOADING_ON_SUBMIT });
};

// page not found
export const notFound = history => async dispatch => {
  history.push("/admin/page-not-found");
};

// Dispatch Modal state
export const initialModalState = () => async dispatch => {
  await dispatch({ type: INITIAL_MODAL_STATE });
};
