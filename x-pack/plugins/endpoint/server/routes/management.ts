/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { schema } from '@kbn/config-schema';
import { IRouter } from 'kibana/server';
import { SearchResponse } from 'elasticsearch';

export function routes(router: IRouter) {
  router.get(
    {
      path: '/endpoint/process-lineage',
      validate: {
        query: schema.object({
          uniqueProcessID: schema.string(),
          endpointID: schema.string(),
        }),
      },
    },
    async function(context, request, response) {
      return response.ok({
        body: JSON.stringify({ ok: true }),
      });
    }
  );
  router.get(
    {
      path: '/endpoint/hosts',
      validate: {
        query: schema.object({}),
      },
    },
    async function(context, request, response) {
      try {
        const results = (await context.core.elasticsearch.dataClient.callAsCurrentUser('search', {
          index: 'endgame-hosts-full',
          body: {
            query: {
              match_all: {},
            },
            size: 100,
          },
        })) as SearchResponse<Document>;

        return response.ok({
          body: JSON.stringify(results),
        });
      } catch (e) {
        return response.internalError(e);
      }
    }
  );
}
