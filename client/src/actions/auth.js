import axios from "axios";
import { setAlert, removeAlert } from "./alert";

import {
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REMOVE_ERRORS,
  REMOVE_ALERT,
} from "./types";

import setAuthToken from "../utils/setAuthToken";

//Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    if (res.data.status === true) {
      dispatch({
        type: USER_LOADED,
        payload: res.data.response,
      });
    } else {
      const errors = res.data.errors;
      if (errors) {
        dispatch(setAlert(res.data.message, "danger"));
      }
    }
  } catch (err) {
    // console.log(err);
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch(removeAlert());
  dispatch({ type: REMOVE_ERRORS });
  dispatch({ type: LOGOUT });
};

//Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    dispatch(removeAlert());
    dispatch({ type: REMOVE_ERRORS });

    const res = await axios.post("/api/auth", body, config);
    if (res.data.status === true) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.response,
      });

      dispatch(loadUser());
    } else {
      dispatch(setAlert(res.data.message, "danger"));
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Redirect to Login screen
export const loginRedirect = (history) => async (dispatch) => {
  dispatch({ type: REMOVE_ALERT });
  dispatch({ type: REMOVE_ERRORS });
  history.push("/login");
};

// // page not found
// export const notFound = history => async dispatch => {
//   history.push("/page-not-found");
// };
