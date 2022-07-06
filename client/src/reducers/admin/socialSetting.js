
import {
    SETTING_ERROR,
    SETTING_UPDATED,
    GET_SETTING,
    INITIAL_LOADING,
    LOADING_ON_SUBMIT
    } from 'actions/types';
    
    
    const initalState = {
      currentSetting: [],
      loading: true,
      errors: {},
    };
    
    export default function(state = initalState, action) {
      const { type, payload } = action;
      switch (type) {
        case SETTING_UPDATED:
          return {
            ...state,
            currentSetting: payload,
            loading: false
          };
        case SETTING_ERROR:
          return {
            ...state,
            errors: payload,
            loading: false
          };
        case GET_SETTING:
          return {
            ...state,
            currentSetting: payload,
            loading: false
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
    