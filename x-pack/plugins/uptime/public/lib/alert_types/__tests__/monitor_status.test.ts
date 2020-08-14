/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { initMonitorStatusAlertType } from '../monitor_status';
import { validateMonitorStatusParams as validate } from '../lazy_wrapper/validate_monitor_status';

describe('monitor status alert type', () => {
  describe('validate', () => {
    let params: any;

    beforeEach(() => {
      params = {
        numTimes: 5,
        shouldCheckStatus: true,
        timerangeCount: 15,
        timerangeUnit: 'm',
      };
    });

    it(`doesn't throw on empty set`, () => {
      expect(validate({})).toMatchInlineSnapshot(`
        Object {
          "errors": Object {
            "typeCheckFailure": "Provided parameters do not conform to the expected type.",
            "typeCheckParsingMessage": Array [
              "Invalid value undefined supplied to : ({ numTimes: number, timerangeCount: number, timerangeUnit: string } & Partial<{ search: string, filters: { monitor.type: Array<string>, observer.geo.name: Array<string>, tags: Array<string>, url.port: Array<string> }, shouldCheckStatus: boolean }>)/0: { numTimes: number, timerangeCount: number, timerangeUnit: string }/numTimes: number",
              "Invalid value undefined supplied to : ({ numTimes: number, timerangeCount: number, timerangeUnit: string } & Partial<{ search: string, filters: { monitor.type: Array<string>, observer.geo.name: Array<string>, tags: Array<string>, url.port: Array<string> }, shouldCheckStatus: boolean }>)/0: { numTimes: number, timerangeCount: number, timerangeUnit: string }/timerangeCount: number",
              "Invalid value undefined supplied to : ({ numTimes: number, timerangeCount: number, timerangeUnit: string } & Partial<{ search: string, filters: { monitor.type: Array<string>, observer.geo.name: Array<string>, tags: Array<string>, url.port: Array<string> }, shouldCheckStatus: boolean }>)/0: { numTimes: number, timerangeCount: number, timerangeUnit: string }/timerangeUnit: string",
            ],
          },
        }
      `);
    });

    it('accepts original alert params', () => {
      expect(
        validate({
          locations: ['fairbanks'],
          numTimes: 3,
          timerange: {
            from: 'now-15m',
            to: 'now',
          },
          filters: '{foo: "bar"}',
          shouldCheckStatus: true,
        })
      ).toMatchInlineSnapshot(`
        Object {
          "errors": Object {},
        }
      `);
    });

    describe('should check flags', () => {
      it('does not pass without one or more should check flags', () => {
        params.shouldCheckStatus = false;
        expect(validate(params)).toMatchInlineSnapshot(`
          Object {
            "errors": Object {
              "noAlertSelected": "Alert must check for monitor status or monitor availability.",
            },
          }
        `);
      });

      it('does not pass when availability is defined, but both check flags are false', () => {
        params.shouldCheckStatus = false;
        params.shouldCheckAvailability = false;
        params.availability = {
          range: 3,
          rangeUnit: 'w',
          threshold: 98.3,
        };
        expect(validate(params)).toMatchInlineSnapshot(`
          Object {
            "errors": Object {
              "noAlertSelected": "Alert must check for monitor status or monitor availability.",
            },
          }
        `);
      });

      it('passes when status check is defined and flag is set to true', () => {
        params.shouldCheckStatus = false;
        params.shouldCheckAvailability = true;
        params.availability = {
          range: 3,
          rangeUnit: 'w',
          threshold: 98.3,
        };
        expect(validate(params)).toMatchInlineSnapshot(`
          Object {
            "errors": Object {},
          }
        `);
      });

      it('passes when status check and availability check flags are both true', () => {
        params.shouldCheckAvailability = true;
        params.availability = {
          range: 3,
          rangeUnit: 'w',
          threshold: 98.3,
        };
        expect(validate(params)).toMatchInlineSnapshot(`
          Object {
            "errors": Object {},
          }
        `);
      });

      it('passes when availability check is defined and flag is set to true', () => {
        expect(validate(params)).toMatchInlineSnapshot(`
          Object {
            "errors": Object {},
          }
        `);
      });
    });

    describe('timerange', () => {
      it('has invalid timerangeCount value', () => {
        expect(validate({ ...params, timerangeCount: 0 })).toMatchInlineSnapshot(`
          Object {
            "errors": Object {
              "invalidTimeRangeValue": "Time range value must be greater than 0",
            },
          }
        `);
      });

      it('has NaN timerangeCount value', () => {
        expect(validate({ ...params, timerangeCount: NaN })).toMatchInlineSnapshot(`
          Object {
            "errors": Object {
              "timeRangeStartValueNaN": "Specified time range value must be a number",
            },
          }
        `);
      });
    });

    describe('numTimes', () => {
      it('is missing', () => {
        delete params.numTimes;
        expect(validate(params)).toMatchInlineSnapshot(`
          Object {
            "errors": Object {
              "typeCheckFailure": "Provided parameters do not conform to the expected type.",
              "typeCheckParsingMessage": Array [
                "Invalid value undefined supplied to : ({ numTimes: number, timerangeCount: number, timerangeUnit: string } & Partial<{ search: string, filters: { monitor.type: Array<string>, observer.geo.name: Array<string>, tags: Array<string>, url.port: Array<string> }, shouldCheckStatus: boolean }>)/0: { numTimes: number, timerangeCount: number, timerangeUnit: string }/numTimes: number",
              ],
            },
          }
        `);
      });

      it('is NaN', () => {
        expect(validate({ ...params, numTimes: `this isn't a number` })).toMatchInlineSnapshot(`
          Object {
            "errors": Object {
              "typeCheckFailure": "Provided parameters do not conform to the expected type.",
              "typeCheckParsingMessage": Array [
                "Invalid value \\"this isn't a number\\" supplied to : ({ numTimes: number, timerangeCount: number, timerangeUnit: string } & Partial<{ search: string, filters: { monitor.type: Array<string>, observer.geo.name: Array<string>, tags: Array<string>, url.port: Array<string> }, shouldCheckStatus: boolean }>)/0: { numTimes: number, timerangeCount: number, timerangeUnit: string }/numTimes: number",
              ],
            },
          }
        `);
      });

      it('is less than 1', () => {
        expect(validate({ ...params, numTimes: 0 })).toMatchInlineSnapshot(`
          Object {
            "errors": Object {
              "invalidNumTimes": "Number of alert check down times must be an integer greater than 0",
            },
          }
        `);
      });
    });
  });

  describe('initMonitorStatusAlertType', () => {
    expect(
      initMonitorStatusAlertType({
        store: {
          dispatch: jest.fn(),
          getState: jest.fn(),
          replaceReducer: jest.fn(),
          subscribe: jest.fn(),
          [Symbol.observable]: jest.fn(),
        },
        // @ts-ignore we don't need to test this functionality here because
        // it's not used by the code this file tests
        core: {},
        // @ts-ignore
        plugins: {},
      })
    ).toMatchInlineSnapshot(`
      Object {
        "alertParamsExpression": [Function],
        "defaultActionMessage": "Monitor {{state.monitorName}} with url {{{state.monitorUrl}}} is {{state.statusMessage}} from {{state.observerLocation}}. The latest error message is {{{state.latestErrorMessage}}}",
        "iconClass": "uptimeApp",
        "id": "xpack.uptime.alerts.monitorStatus",
        "name": <FormattedMessage
          defaultMessage="Uptime monitor status"
          id="xpack.uptime.alerts.monitorStatus.title.label"
          values={Object {}}
        />,
        "requiresAppContext": false,
        "validate": [Function],
      }
    `);
  });
});
