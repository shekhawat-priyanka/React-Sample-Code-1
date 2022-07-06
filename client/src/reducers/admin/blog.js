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
    BLOG_SEARCH_PARAMATERS_UPDATE
  } from "actions/types";
  import * as Constants from "constants/index";
  
  const initalState = {
    blogList: {
      page: 1,
      data: [],
      count: 0
    },
    currentBlog: {},
    loading: true,
    error: {},
    sortingParams: {
      limit: Constants.DEFAULT_PAGE_SIZE,
      page: 1,
      orderBy: "created_at",
      ascending: "desc",
      query: ""
    }
  };
  
  export default function(state = initalState, action) {
    const { type, payload } = action;
    switch (type) {
      case BLOG_CREATED:
        return {
          ...state,
          loading: false
        };
      case BLOG_UPDATED:
        return {
          ...state,
          currentBlog: payload,
          sortingParams: initalState.sortingParams,
          loading: false
        };
      case BLOG_ERROR:
        return {
          ...state,
          error: payload,
          loading: false
        };
      case DELETE_BLOG:
        return {
          ...state,
          blogList: {
            data: state.blogList.data.filter(blog => blog._id !== payload)
          },
          sortingParams: initalState.sortingParams,
          loading: false
        };
      case GET_BLOG_BY_ID:
        return {
          ...state,
          currentBlog: payload,
          loading: false
        };
      case BLOG_LIST_UPDATED:
        return {
          ...state,
          blogList: {
            data: payload.data,
            page: payload.metadata[0].current_page,
            count: payload.metadata[0].totalRecord
          },
          loading: false
        };
      case BLOG_SEARCH_PARAMATERS_UPDATE:
        return {
          ...state,
          sortingParams: { ...payload }
        };
      case CHANGE_BLOG_STATUS:
        return {
          ...state,
          blogList: {
            ...state.blogList,
            data: state.blogList.data.map(blog =>
              blog._id === payload._id ? { ...blog, status: payload.status } : blog
            )
          }
        };
      case INITIAL_LOADING:
        return {
          ...state,
          loading: false
        };
      case LOADING_ON_SUBMIT:
        return {
          ...state,
          loading: true
        };
  
      default:
        return state;
    }
  }
  