/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import Redux from 'redux';

import globalReducer from 'app/containers/App/reducer';
import languageProviderReducer from 'app/containers/LanguageProvider/reducer';
import {reducer as form} from 'redux-form/immutable';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  locationBeforeTransitions: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      const mergeState = state.merge({
        locationBeforeTransitions: action.payload,
      });
      if (window.swUpdate) {
        window.location.reload();
      }
      return mergeState;
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers: Redux.ReducersMapObject = {}): Redux.Reducer<any> {

  const reducers = {
    route: routeReducer,
    global: globalReducer,
    language: languageProviderReducer,
    form,
    ...asyncReducers,
  };

  return combineReducers(reducers);
}
