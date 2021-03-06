/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EuiSelect, EuiFormRow, EuiPanel } from '@elastic/eui';
import { getKibanaRegionList } from '../../../util';
import { i18n } from '@kbn/i18n';

export function CreateSourceEditor({ onSourceConfigChange }) {
  const onChange = ({ target }) => {
    const selectedName = target.options[target.selectedIndex].text;
    onSourceConfigChange({ name: selectedName });
  };

  const regionmapOptions = getKibanaRegionList().map(({ name, url }) => {
    return {
      value: url,
      text: name,
    };
  });

  const helpText =
    regionmapOptions.length === 0
      ? i18n.translate('xpack.maps.source.kbnRegionMap.noLayerAvailableHelptext', {
          defaultMessage: `No vector layers are available. Ask your system administrator to set "map.regionmap" in kibana.yml.`,
        })
      : null;

  return (
    <EuiPanel>
      <EuiFormRow
        label={i18n.translate('xpack.maps.source.kbnRegionMap.vectorLayerLabel', {
          defaultMessage: 'Vector layer',
        })}
        helpText={helpText}
      >
        <EuiSelect
          hasNoInitialSelection
          options={regionmapOptions}
          onChange={onChange}
          disabled={regionmapOptions.length === 0}
        />
      </EuiFormRow>
    </EuiPanel>
  );
}

CreateSourceEditor.propTypes = {
  onSourceConfigChange: PropTypes.func.isRequired,
};
