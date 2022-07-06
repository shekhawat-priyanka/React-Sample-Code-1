import axios from "axios";
import { setAlert } from "actions/alert";
import { setErrorsList } from "actions/errors";

import {
  INQUIRY_CREATED,
  INQUIRY_ERROR,
  DELETE_INQUIRY,
  INQUIRY_UPDATED,
  INQUIRY_LIST_UPDATED,
  GET_INQUIRY_BY_ID,
  INQUIRY_SEARCH_PARAMATERS_UPDATE,
  REMOVE_ERRORS,
  CHANGE_INQUIRY_STATUS,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT
} from "actions/types";

// Create inquiry
export const add = (formData, history) => async dispatch => {
  // window.alert("1");
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    //window.alert("2");
    const res = await axios.post("/api/admin/inquiry/add", formData, config);
    if (res.data.status === true) {
      dispatch({
        type: INQUIRY_CREATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      // dispatch({ type: REMOVE_ALERT });
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Inquiry Created.", "success"));
      history.push("/admin/inquiries");
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
      type: INQUIRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Edit Inquiry
export const edit = (formData, history, inquiry_id) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `/api/admin/inquiry/${inquiry_id}`,
      formData,
      config
    ); //window.alert(res.data.status)
    if (res.data.status === true) {
      dispatch({
        type: INQUIRY_UPDATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      // dispatch({ type: REMOVE_ALERT });
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Inquiry Updated.", "success"));
      history.push("/admin/inquiries");
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
      type: INQUIRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Inquiry
export const deleteInquiry = (inquiry_id, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    await axios.delete(`/api/admin/inquiry/${inquiry_id}`, config);
    // dispatch({ type: REMOVE_ALERT });
    dispatch({
      type: DELETE_INQUIRY,
      payload: inquiry_id
    });
    dispatch(setAlert("Inquiry deleted", "success"));
    // history.push('/admin/inquiries');
  } catch (err) {
    // console.log(err);
    dispatch({
      type: INQUIRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//get inquiries list

export const getInquiriesList = inquiryParams => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }; //window.alert("1");
  try {
    //window.alert("2");
    const query = inquiryParams.query ? inquiryParams.query : "";
    const res = await axios.get(
      `/api/admin/inquiry?limit=${inquiryParams.limit}&page=${inquiryParams.page}&query=${query}&orderBy=${inquiryParams.orderBy}&ascending=${inquiryParams.ascending}`,
      config
    );
    // dispatch({ type: REMOVE_ALERT });

    dispatch({
      type: INQUIRY_SEARCH_PARAMATERS_UPDATE,
      payload: inquiryParams
    });
    dispatch({
      type: INQUIRY_LIST_UPDATED,
      payload: res.data.response[0]
    });
  } catch (err) {
    // console.log(err);
    dispatch({
      type: INQUIRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Inquiry
export const getInquiryById = inquiry_id => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.get(`/api/admin/inquiry/${inquiry_id}`, config);
    // dispatch({ type: REMOVE_ALERT });

    await dispatch({
      type: GET_INQUIRY_BY_ID,
      payload: res.data.response
    });
    return res.data.response;
  } catch (err) {
    dispatch({
      type: INQUIRY_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Inquiry

export const cancelSave = history => async dispatch => {
  try {
    // dispatch({ type: REMOVE_ALERT });
    dispatch({ type: REMOVE_ERRORS });
    history.push("/admin/inquiries");
  } catch (err) {
    // console.log(err);
  }
};

//change status
export const changeStatus = (inquiry_id, status) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post(
      `/api/admin/inquiry/change-status/${inquiry_id}`,
      { status },
      config
    );
    // dispatch({ type: REMOVE_ALERT });

    await dispatch({
      type: CHANGE_INQUIRY_STATUS,
      payload: res.data.response
    });
    dispatch(setAlert(res.data.message, "success"));
  } catch (err) {
    dispatch({
      type: INQUIRY_ERROR,
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