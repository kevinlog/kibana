/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { encode, decode } from 'rison-node';
import { Query, TimeRange, Filter } from 'src/plugins/data/public';
import { HostResultList } from '../../../../../common/endpoint/types';
import { ImmutableMiddlewareFactory } from '../../../../common/store';
import { isOnHostPage, hasSelectedHost, uiQueryParams, listData } from './selectors';
import { HostState } from '../types';
import { metadataIndexPattern } from '../../../../../common/endpoint/constants';
import { IIndexPattern } from '../../../../../../../../src/plugins/data/public';
import { cloneHttpFetchQuery } from '../../../../common/utils/clone_http_fetch_query';

export const hostMiddlewareFactory: ImmutableMiddlewareFactory<HostState> = (
  coreStart,
  depsStart
) => {
  async function fetchIndexPatterns(): Promise<IIndexPattern[]> {
    const { indexPatterns } = depsStart.data;
    const fields = await indexPatterns.getFieldsForWildcard({
      pattern: metadataIndexPattern,
    });
    const indexPattern: IIndexPattern = {
      title: metadataIndexPattern,
      fields,
    };

    return [indexPattern];
  }

  return ({ getState, dispatch }) => (next) => async (action) => {
    next(action);
    const state = getState();
    if (
      action.type === 'userChangedUrl' &&
      isOnHostPage(state) &&
      hasSelectedHost(state) !== true
    ) {
      const {
        page_index: pageIndex,
        page_size: pageSize,
        management_query: managementQuery,
      } = uiQueryParams(state);
      try {
        const patterns = await fetchIndexPatterns();

        dispatch({
          type: 'serverReturnedMetadataPatterns',
          payload: patterns,
        });

        dispatch({
          type: 'userUpdatedSearchBarQuery',
          payload: managementQuery,
        });

        // TODO: get logic out of middleware
        let decodedQuery;
        if (managementQuery !== undefined) {
          decodedQuery = (decode(managementQuery) as unknown) as Query;
        } else {
          decodedQuery = { query: '', language: 'kuery' };
        }

        const response = await coreStart.http.post<HostResultList>('/api/endpoint/metadata', {
          body: JSON.stringify({
            paging_properties: [{ page_index: pageIndex }, { page_size: pageSize }],
            filter: decodedQuery.query,
          }),
        });
        response.request_page_index = Number(pageIndex);
        dispatch({
          type: 'serverReturnedHostList',
          payload: response,
        });
      } catch (error) {
        dispatch({
          type: 'serverFailedToReturnHostList',
          payload: error,
        });
      }
    }
    if (action.type === 'userChangedUrl' && hasSelectedHost(state) === true) {
      // If user navigated directly to a host details page, load the host list
      if (listData(state).length === 0) {
        const { page_index: pageIndex, page_size: pageSize } = uiQueryParams(state);
        try {
          const response = await coreStart.http.post('/api/endpoint/metadata', {
            body: JSON.stringify({
              paging_properties: [{ page_index: pageIndex }, { page_size: pageSize }],
            }),
          });
          response.request_page_index = Number(pageIndex);
          dispatch({
            type: 'serverReturnedHostList',
            payload: response,
          });
        } catch (error) {
          dispatch({
            type: 'serverFailedToReturnHostList',
            payload: error,
          });
          return;
        }
      }

      // call the host details api
      const { selected_host: selectedHost } = uiQueryParams(state);
      try {
        const response = await coreStart.http.get(`/api/endpoint/metadata/${selectedHost}`);
        dispatch({
          type: 'serverReturnedHostDetails',
          payload: response,
        });
      } catch (error) {
        dispatch({
          type: 'serverFailedToReturnHostDetails',
          payload: error,
        });
      }

      // call the policy response api
      try {
        const policyResponse = await coreStart.http.get(`/api/endpoint/policy_response`, {
          query: { hostId: selectedHost },
        });
        dispatch({
          type: 'serverReturnedHostPolicyResponse',
          payload: policyResponse,
        });
      } catch (error) {
        dispatch({
          type: 'serverFailedToReturnHostPolicyResponse',
          payload: error,
        });
      }
    }
  };
};
