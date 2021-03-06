/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { isBasicAgg } from './agg_lookup';
import { Metric } from './types';

describe('aggLookup', () => {
  describe('isBasicAgg(metric)', () => {
    test('returns true for a basic metric (count)', () => {
      expect(isBasicAgg({ type: 'count' } as Metric)).toEqual(true);
    });
    test('returns false for a pipeline metric (derivative)', () => {
      expect(isBasicAgg({ type: 'derivative' } as Metric)).toEqual(false);
    });
  });
});
