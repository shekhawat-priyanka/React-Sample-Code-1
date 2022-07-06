import axios from "axios";
import { setAlert } from "actions/alert";
import { setErrorsList } from "actions/errors";

import {
  COUPON_ADDED,
  COUPON_ERROR,
  DELETE_COUPON,
  REMOVE_ERRORS,
  COUPON_LIST_UPDATED,
  COUPON_SEARCH_PARAMATERS_UPDATE,
  COUPON_UPDATED,
  GET_COUPON_BY_ID,
  CHANGE_COUPON_STATUS,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT
} from "actions/types";

// #################### Add coupon ######################
export const add = (formData, history) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try { 
    const res = await axios.post("/api/admin/coupon/add", formData, config);
    if (res.data.status === true) {
      dispatch({
        type: COUPON_ADDED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Coupon added.", "success"));
      history.push("/admin/coupons");
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
      type: COUPON_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//####################### on cancel #########################
export const cancelSave = history => async dispatch => {
  try {
    dispatch({ type: REMOVE_ERRORS });
    history.push("/admin/coupons");
  } catch (err) {
    // console.log(err);
  }
};


// ##################### Delete coupon ##################
export const deleteCoupon = coupon_id => async dispatch => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      await axios.delete(`/api/admin/coupon/${coupon_id}`, config);
  
      dispatch({
        type: DELETE_COUPON,
        payload: coupon_id
      });
      dispatch(setAlert("Coupon deleted.", "success"));
    } catch (err) {
      // console.log(err);
      dispatch({
        type: COUPON_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  //################# get coupon list ######################
  
  export const getCouponList = couponParams => async dispatch => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {
      const query = couponParams.query ? couponParams.query : "";
      const res = await axios.get(
        `/api/admin/coupon?limit=${couponParams.limit}&page=${couponParams.page}&query=${query}&orderBy=${couponParams.orderBy}&ascending=${couponParams.ascending}`,
        config
      );
      dispatch({
        type: COUPON_SEARCH_PARAMATERS_UPDATE,
        payload: couponParams
      });
      dispatch({
        type: COUPON_LIST_UPDATED,
        payload: res.data.response[0]
      });
    } catch (err) {
      // console.log(err);
      dispatch({
        type: COUPON_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  //######################### Get coupon by id #######################
  export const getCouponById = coupon_id => async dispatch => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const res = await axios.get(`/api/admin/coupon/${coupon_id}`, config);
  
      await dispatch({
        type: GET_COUPON_BY_ID,
        payload: res.data.response
      });
      return res.data.response;
    } catch (err) {
      dispatch({
        type: COUPON_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

// #################### Edit Coupon ###################
export const edit = (formData, history, coupon_id) => async dispatch => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    try {                    
      const res = await axios.post(`/api/admin/coupon/${coupon_id}`, formData, config);
      if (res.data.status === true) {
        dispatch({
          type: COUPON_UPDATED,
          payload: res.data.response
        });
        dispatch(loadingOnSubmit());
        dispatch({ type: REMOVE_ERRORS });
        dispatch(setAlert("Coupon Updated.", "success"));
        history.push("/admin/coupons");
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
        type: COUPON_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
  // page not found
  export const notFound = history => async dispatch => {
    history.push("/admin/page-not-found");
  };
  
  //change status
  export const changeStatus = (coupon_id, status) => async dispatch => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const res = await axios.post(
        `/api/admin/coupon/change-status/${coupon_id}`,
        { status },
        config
      );
  
      await dispatch({
        type: CHANGE_COUPON_STATUS,
        payload: res.data.response
      });
      dispatch(setAlert(res.data.message, "success"));
    } catch (err) {
      dispatch({
        type: COUPON_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };
  
// Dispatch initial loading
export const initialLoading = () => async dispatch => {
  await dispatch({ type: INITIAL_LOADING });
 };
 
 // Dispatch Loading on submit
 export const loadingOnSubmit = () => async dispatch => {
  await dispatch({ type: LOADING_ON_SUBMIT });
 };
