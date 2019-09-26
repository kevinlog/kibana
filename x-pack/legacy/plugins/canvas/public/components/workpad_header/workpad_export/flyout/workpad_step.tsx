/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { EuiText, EuiSpacer, EuiButton } from '@elastic/eui';

import { ComponentStrings } from '../../../../../i18n';

import { OnExportFn } from '../workpad_export';

const { ShareWebsiteWorkpadStep: strings } = ComponentStrings;

export const WorkpadStep = ({ onExport }: { onExport: OnExportFn }) => (
  <EuiText size="s">
    <p>{strings.getStepDescription()}</p>
    <EuiSpacer size="s" />
    <EuiButton
      onClick={() => {
        onExport('share');
      }}
      size="s"
    >
      {strings.getDownloadLabel()}
    </EuiButton>
  </EuiText>
);
