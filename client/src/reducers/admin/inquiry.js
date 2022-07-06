import {
  INQUIRY_CREATED,
  INQUIRY_ERROR,
  DELETE_INQUIRY,
  INQUIRY_UPDATED,
  INQUIRY_LIST_UPDATED,
  GET_INQUIRY_BY_ID,
  INQUIRY_SEARCH_PARAMATERS_UPDATE,
  CHANGE_INQUIRY_STATUS,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT
} from "actions/types";
import * as Constants from "constants/index";

const initalState = {
  inquiriesList: {
    page: 1,
    data: [],
    count: 0
  },
  currentInquiry: [],
  loading: true,
  error: {},
  sortingParams: {
    limit: Constants.DEFAULT_PAGE_SIZE,
    page: 1,
    // orderBy: 'created_at',
    orderBy: "status",
    ascending: "desc",
    query: ""
  }
};

export default function(state = initalState, action) {
  const { type, payload } = action;
  switch (type) {
    case INQUIRY_CREATED:
      return {
        ...state,
        loading: false
      };
    case INQUIRY_UPDATED:
      return {
        ...state,
        currentInquiry: payload,
        // users: state.user.users.map(user =>
        //   user._id === payload._id ? { payload } : user
        // ),
        sortingParams: initalState.sortingParams,
        loading: false
      };
    case INQUIRY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case DELETE_INQUIRY:
      return {
        ...state,
        inquiriesList: {
          data: state.inquiriesList.data.filter(
            inquiry => inquiry._id !== payload
          )
        },
        sortingParams: initalState.sortingParams,
        loading: false
      };
    case GET_INQUIRY_BY_ID:
      return {
        ...state,
        currentInquiry: payload,
        loading: false
      };
    case INQUIRY_LIST_UPDATED:
      return {
        ...state,
        inquiriesList: {
          data: payload.data,
          page: payload.metadata[0].current_page,
          count: payload.metadata[0].totalRecord
        },
        loading: false
      };
    case INQUIRY_SEARCH_PARAMATERS_UPDATE:
      return {
        ...state,
        sortingParams: { ...payload }
      };
    case CHANGE_INQUIRY_STATUS:
      return {
        ...state,
        inquiriesList: {
          ...state.inquiriesList,
          data: state.inquiriesList.data.map(inquiry =>
            inquiry._id === payload._id
              ? { ...inquiry, status: payload.status }
              : inquiry
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
