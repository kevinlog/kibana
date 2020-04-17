/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { PolicyListState, ImmutableReducer } from '../../types';
import { AppAction } from '../action';
import { Immutable } from '../../../../../common/types';
import { isOnPolicyPage, wasPreviouslyOnPolicyPage } from '../../lib/location/policy';

const initialPolicyListState = (): PolicyListState => {
  return {
    policyItems: [],
    isLoading: false,
    apiError: undefined,
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    location: undefined,
  };
};

export const policyListReducer: ImmutableReducer<PolicyListState, AppAction> = (
  state = initialPolicyListState(),
  action
) => {
  if (action.type === 'serverReturnedPolicyListData') {
    return {
      ...state,
      ...action.payload,
      isLoading: false,
    };
  }

  if (action.type === 'serverFailedToReturnPolicyListData') {
    return {
      ...state,
      apiError: action.payload,
      isLoading: false,
    };
  }

  if (action.type === 'userChangedUrl') {
    const newState: Immutable<PolicyListState> = {
      ...state,
    };

    const isCurrentlyOnListPage = isOnPolicyPage();
    const wasPreviouslyOnListPage = wasPreviouslyOnPolicyPage();

    // If on the current page, then return new state with location information
    // Also adjust some state if user is just entering the policy list view
    if (isCurrentlyOnListPage) {
      if (!wasPreviouslyOnListPage) {
        return {
          ...newState,
          apiError: undefined,
          isLoading: true,
        };
      }
      return newState;
    }
    return initialPolicyListState();
  }

  return state;
};
