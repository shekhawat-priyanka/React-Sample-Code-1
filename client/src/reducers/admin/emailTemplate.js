import {
  EMAIL_TEMPLATE_CREATED,
  EMAIL_TEMPLATE_ERROR,
  DELETE_EMAIL_TEMPLATE,
  EMAIL_TEMPLATE_UPDATED,
  EMAIL_TEMPLATE_LIST_UPDATED,
  GET_EMAIL_TEMPLATE_BY_ID,
  INITIAL_LOADING,
  LOADING_ON_SUBMIT,
  EMAIL_TEMPLATE_SEARCH_PARAMATERS_UPDATE,
  CHANGE_EMAIL_TEMPLATE_STATUS
} from "actions/types";
import * as Constants from "constants/index";

const initalState = {
  emailTemplateList: {
    page: 1,
    data: [],
    count: 0
  },
  currentEmailTemplate: [],
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
    case EMAIL_TEMPLATE_CREATED:
      return {
        ...state,
        loading: false
      };
    case EMAIL_TEMPLATE_UPDATED:
      return {
        ...state,
        currentEmailTemplate: payload,
        sortingParams: initalState.sortingParams,
        loading: false
      };
    case EMAIL_TEMPLATE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case DELETE_EMAIL_TEMPLATE:
      return {
        ...state,
        emailTemplateList: {
          data: state.emailTemplateList.data.filter(
            emailTemplate => emailTemplate._id !== payload
          )
        },
        sortingParams: initalState.sortingParams,
        loading: false
      };
    case GET_EMAIL_TEMPLATE_BY_ID:
      return {
        ...state,
        currentEmailTemplate: payload,
        loading: false
      };
    case EMAIL_TEMPLATE_LIST_UPDATED:
      return {
        ...state,
        emailTemplateList: {
          data: payload.data,
          page: payload.metadata[0].current_page,
          count: payload.metadata[0].totalRecord
        },
        loading: false
      };
    case EMAIL_TEMPLATE_SEARCH_PARAMATERS_UPDATE:
      return {
        ...state,
        sortingParams: { ...payload }
      };

    case CHANGE_EMAIL_TEMPLATE_STATUS:
      return {
        ...state,
        emailTemplateList: {
          ...state.emailTemplateList,
          data: state.emailTemplateList.data.map(emailTemplate =>
            emailTemplate._id === payload._id
              ? { ...emailTemplate, status: payload.status }
              : emailTemplate
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
