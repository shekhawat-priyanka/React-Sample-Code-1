import axios from "axios";
import { setAlert } from "actions/alert";
import { setErrorsList } from "actions/errors";

import {
  EMAIL_TEMPLATE_CREATED,
  EMAIL_TEMPLATE_ERROR,
  DELETE_EMAIL_TEMPLATE,
  EMAIL_TEMPLATE_UPDATED,
  EMAIL_TEMPLATE_LIST_UPDATED,
  GET_EMAIL_TEMPLATE_BY_ID,
  EMAIL_TEMPLATE_SEARCH_PARAMATERS_UPDATE,
  REMOVE_ERRORS,
  CHANGE_EMAIL_TEMPLATE_STATUS,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT
} from "actions/types";

// Create Email Template
export const create = (formData, history) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "/api/admin/emailTemplate/create",
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch({
        type: EMAIL_TEMPLATE_CREATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      // dispatch({ type: REMOVE_ALERT });
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Email Template Created.", "success"));
      history.push("/admin/email-templates");
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
      type: EMAIL_TEMPLATE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Edit Email Template
export const edit = (formData, history, emailTemplate_id) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `/api/admin/emailTemplate/${emailTemplate_id}`,
      formData,
      config
    );
    if (res.data.status === true) {
      dispatch({
        type: EMAIL_TEMPLATE_UPDATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      // dispatch({ type: REMOVE_ALERT });
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Email Template Updated.", "success"));
      history.push("/admin/email-templates");
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
      type: EMAIL_TEMPLATE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Email Template
export const deleteEmailTemplate = (
  emailTemplate_id,
  history
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    await axios.delete(`/api/admin/emailTemplate/${emailTemplate_id}`, config);
    // dispatch({ type: REMOVE_ALERT });

    dispatch({
      type: DELETE_EMAIL_TEMPLATE,
      payload: emailTemplate_id
    });
    dispatch(setAlert("Email Template deleted", "success"));
  } catch (err) {
    // console.log(err);
    dispatch({
      type: EMAIL_TEMPLATE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//get Email Template list

export const getEmailTemplateList = emailTemplateParams => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const query = emailTemplateParams.query ? emailTemplateParams.query : "";
    const res = await axios.get(
      `/api/admin/emailTemplate?limit=${emailTemplateParams.limit}&page=${emailTemplateParams.page}&query=${query}&orderBy=${emailTemplateParams.orderBy}&ascending=${emailTemplateParams.ascending}`,
      config
    );
    // dispatch({ type: REMOVE_ALERT });

    dispatch({
      type: EMAIL_TEMPLATE_SEARCH_PARAMATERS_UPDATE,
      payload: emailTemplateParams
    });
    dispatch({
      type: EMAIL_TEMPLATE_LIST_UPDATED,
      payload: res.data.response[0]
    });
  } catch (err) {
    // console.log(err);
    dispatch({
      type: EMAIL_TEMPLATE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get email template by id
export const getEmailTemplateById = emailTemplate_id => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.get(
      `/api/admin/emailTemplate/${emailTemplate_id}`,
      config
    );
    // dispatch({ type: REMOVE_ALERT });

    await dispatch({
      type: GET_EMAIL_TEMPLATE_BY_ID,
      payload: res.data.response
    });
    return res.data.response;
  } catch (err) {
    dispatch({
      type: EMAIL_TEMPLATE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete User
export const cancelSave = history => async dispatch => {
  // dispatch({ type: REMOVE_ALERT });
  dispatch({ type: REMOVE_ERRORS });
  history.push("/admin/email-templates");
};

//change status
export const changeStatus = (emailTemplate_id, status) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post(
      `/api/admin/emailTemplate/change-status/${emailTemplate_id}`,
      { status },
      config
    );
    // dispatch({ type: REMOVE_ALERT });
    await dispatch({
      type: CHANGE_EMAIL_TEMPLATE_STATUS,
      payload: res.data.response
    });
    dispatch(setAlert(res.data.message, "success"));
  } catch (err) {
    console.log(err);
    dispatch({
      type: EMAIL_TEMPLATE_ERROR,
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
