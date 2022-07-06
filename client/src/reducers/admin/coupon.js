import {
  COUPON_ADDED,
  COUPON_ERROR,
  DELETE_COUPON,
  COUPON_LIST_UPDATED,
  COUPON_SEARCH_PARAMATERS_UPDATE,
  COUPON_UPDATED,
  GET_COUPON_BY_ID,
  CHANGE_COUPON_STATUS,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT
} from "actions/types";
import * as Constants from "constants/index";

const initalState = {
  couponList: {
    page: 1,
    data: [],
    count: 0
  },
  currentCoupon: {},
  loading: true,
  errors: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    orderBy: "expiry_date",
    ascending: "desc",
    query: ""
  }
};

export default function(state = initalState, action) {
  const { type, payload } = action;
  switch (type) {
    case COUPON_ADDED:
      return {
        ...state,
        loading: false
      };
    case COUPON_UPDATED:
      return {
        ...state,
        currentCoupon: payload,
        sortingParams: initalState.sortingParams,
        loading: false
      };
    case COUPON_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case DELETE_COUPON:
      return {
        ...state,
        couponList: {
          data: state.couponList.data.filter(coupon => coupon._id !== payload)
        },
        sortingParams: initalState.sortingParams,
        loading: false
      };
    case GET_COUPON_BY_ID:
      return {
        ...state,
        currentCoupon: payload,
        loading: false
      };
    case COUPON_LIST_UPDATED:
      return {
        ...state,
        couponList: {
          data: payload.data,
          page: payload.metadata[0].current_page,
          count: payload.metadata[0].totalRecord
        },
        loading: false
      };
    case COUPON_SEARCH_PARAMATERS_UPDATE:
      return {
        ...state,
        sortingParams: { ...payload }
      };
    case CHANGE_COUPON_STATUS:
      return {
        ...state,
        couponList: {
          ...state.couponList,
          data: state.couponList.data.map(coupon =>
            coupon._id === payload._id
              ? { ...coupon, status: payload.status }
              : coupon
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
