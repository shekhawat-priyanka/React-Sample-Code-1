import axios from "axios";
import { setAlert } from "actions/alert";
import { setErrorsList } from "actions/errors";

import {
    BLOG_CREATED,
    BLOG_ERROR,
    DELETE_BLOG,
    BLOG_UPDATED,
    BLOG_LIST_UPDATED,
    GET_BLOG_BY_ID,
    CHANGE_BLOG_STATUS,
    INITIAL_LOADING,
    LOADING_ON_SUBMIT,
    BLOG_SEARCH_PARAMATERS_UPDATE,
    REMOVE_ERRORS
} from "actions/types";

// Create blog
export const create = (formData, history) => async dispatch => {
  const config = {
    headers: {
      "content-type": "application/json;"
    }
  };
  try {
    let param = new window.FormData();
    param.append("file", formData.selectedFile);                       //image file 
    param.append("slug", formData.slug);
    param.append("blog_title", formData.blog_title);
    param.append("blog_header", formData.blog_header);
    param.append("meta_description", formData.meta_description);
    param.append("description", formData.description);
    param.append("image", formData.image);                            //object url of image (image src)
    const res = await axios.post("/api/admin/blog/create", param, config);
    if (res.data.status === true) {
      dispatch({
        type: BLOG_CREATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      dispatch({ type: REMOVE_ERRORS });

      dispatch(setAlert("Blog Created.", "success"));
      history.push("/admin/blogs");
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
      type: BLOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Edit Blog
export const edit = (formData, history, blog_id) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    let param = new window.FormData();
    param.append("file", formData.selectedFile);                              // image file
    param.append("slug", formData.slug);
    param.append("blog_title", formData.blog_title);
    param.append("blog_header", formData.blog_header);
    param.append("meta_description", formData.meta_description);
    param.append("description", formData.description);
    param.append("image", formData.image);                               // object url of image (image src)
    param.append("oldImage", formData.oldImage);                         // old image name    
    const res = await axios.post(`/api/admin/blog/${blog_id}`, param, config);
    if (res.data.status === true) {
      dispatch({
        type: BLOG_UPDATED,
        payload: res.data.response
      });
      dispatch(loadingOnSubmit());
      dispatch({ type: REMOVE_ERRORS });
      dispatch(setAlert("Blog Updated.", "success"));
      history.push("/admin/blogs");
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
      type: BLOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Blog
export const deleteBlog = blog_id => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    await axios.delete(`/api/admin/blog/${blog_id}`, config);

    dispatch({
      type: DELETE_BLOG,
      payload: blog_id
    });
    dispatch(setAlert("Blog deleted.", "success"));
  } catch (err) {
    // console.log(err);
    dispatch({
      type: BLOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//get blog list

export const getBlogList = blogParams => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  try {
    const query = blogParams.query ? blogParams.query : "";
    const res = await axios.get(
      `/api/admin/blog?limit=${blogParams.limit}&page=${blogParams.page}&query=${query}&orderBy=${blogParams.orderBy}&ascending=${blogParams.ascending}`,
      config
    );
    dispatch({
      type: BLOG_SEARCH_PARAMATERS_UPDATE,
      payload: blogParams
    });
    dispatch({
      type: BLOG_LIST_UPDATED,
      payload: res.data.response[0]
    });
  } catch (err) {
    // console.log(err);
    dispatch({
      type: BLOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get blog by id
export const getBlogById = blog_id => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.get(`/api/admin/blog/${blog_id}`, config);

    await dispatch({
      type: GET_BLOG_BY_ID,
      payload: res.data.response
    });
    return res.data.response;
  } catch (err) {
    dispatch({
      type: BLOG_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// on Cancel 
export const cancelSave = history => async dispatch => {
  dispatch({ type: REMOVE_ERRORS });
  history.push("/admin/blogs");
};

// page not found
export const notFound = history => async dispatch => {
  history.push("/admin/page-not-found");
};

//change status
export const changeStatus = (blog_id, status) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const res = await axios.post(
      `/api/admin/blog/change-status/${blog_id}`,
      { status },
      config
    );

    await dispatch({
      type: CHANGE_BLOG_STATUS,
      payload: res.data.response
    });
    dispatch(setAlert(res.data.message, "success"));
  } catch (err) {
    dispatch({
      type: BLOG_ERROR,
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
