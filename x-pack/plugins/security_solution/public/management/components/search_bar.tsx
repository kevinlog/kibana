/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { encode, RisonValue } from 'rison-node';
import { Query } from 'src/plugins/data/public';
import { useKibana } from '../../../../../../src/plugins/kibana_react/public';
import { urlFromQueryParams } from '../pages/endpoint_hosts/view/url_from_query_params';
import { useHostSelector } from '../pages/endpoint_hosts/view/hooks';
import * as selectors from '../pages/endpoint_hosts/store/selectors';

export const AdminSearchBar = memo(() => {
  const history = useHistory();
  const queryParams = useHostSelector(selectors.uiQueryParams);
  const searchBarIndexPatterns = useHostSelector(selectors.patterns);
  const searchBarQuery = useHostSelector(selectors.searchBarQuery);

  const {
    services: {
      data: {
        ui: { SearchBar },
      },
    },
  } = useKibana();

  const onQuerySubmit = useCallback(
    (params: { query?: Query }) => {
      history.push(
        urlFromQueryParams({
          ...queryParams,
          admin_query: encode((params.query as unknown) as RisonValue),
        })
      );
    },
    [history, queryParams]
  );

  return (
    <div>
      {searchBarIndexPatterns && searchBarIndexPatterns.length > 0 && (
        <SearchBar
          dataTestSubj="adminSearchBar"
          appName="endpoint"
          query={searchBarQuery}
          indexPatterns={searchBarIndexPatterns}
          onQuerySubmit={onQuerySubmit}
          isLoading={false}
          showFilterBar={false}
          showDatePicker={false}
          showQueryBar={true}
          showQueryInput={true}
        />
      )}
    </div>
  );
});

AdminSearchBar.displayName = 'AdminSearchBar';
