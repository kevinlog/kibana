/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  DATE_NOW,
  DESCRIPTION,
  ELASTIC_USER,
  ENDPOINT_TYPE,
  IMMUTABLE,
  LIST_ID,
  META,
  NAME,
  TIE_BREAKER,
  USER,
  VERSION,
  _VERSION,
} from '../../constants.mock';
import { ENDPOINT_LIST_ID } from '../..';
import {
  ENDPOINT_TRUSTED_APPS_LIST_DESCRIPTION,
  ENDPOINT_TRUSTED_APPS_LIST_ID,
  ENDPOINT_TRUSTED_APPS_LIST_NAME,
} from '../../constants';

import { ExceptionListSchema } from './exception_list_schema';

export const getExceptionListSchemaMock = (): ExceptionListSchema => ({
  _tags: ['endpoint', 'process', 'malware', 'os:linux'],
  _version: _VERSION,
  created_at: DATE_NOW,
  created_by: USER,
  description: DESCRIPTION,
  id: '1',
  immutable: IMMUTABLE,
  list_id: ENDPOINT_LIST_ID,
  meta: META,
  name: 'Sample Endpoint Exception List',
  namespace_type: 'agnostic',
  tags: ['user added string for a tag', 'malware'],
  tie_breaker_id: TIE_BREAKER,
  type: ENDPOINT_TYPE,
  updated_at: DATE_NOW,
  updated_by: 'user_name',
  version: VERSION,
});

export const getTrustedAppsListSchemaMock = (): ExceptionListSchema => {
  return {
    ...getExceptionListSchemaMock(),
    description: ENDPOINT_TRUSTED_APPS_LIST_DESCRIPTION,
    list_id: ENDPOINT_TRUSTED_APPS_LIST_ID,
    name: ENDPOINT_TRUSTED_APPS_LIST_NAME,
  };
};

/**
 * This is useful for end to end tests where we remove the auto generated parts for comparisons
 * such as created_at, updated_at, and id.
 */
export const getExceptionResponseMockWithoutAutoGeneratedValues = (): Partial<
  ExceptionListSchema
> => ({
  _tags: [],
  created_by: ELASTIC_USER,
  description: DESCRIPTION,
  immutable: IMMUTABLE,
  list_id: LIST_ID,
  name: NAME,
  namespace_type: 'single',
  tags: [],
  type: ENDPOINT_TYPE,
  updated_by: ELASTIC_USER,
  version: VERSION,
});
