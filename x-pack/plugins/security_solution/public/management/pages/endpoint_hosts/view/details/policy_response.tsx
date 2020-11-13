/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import {
  EuiAccordion,
  EuiNotificationBadge,
  EuiHealth,
  EuiText,
  EuiSpacer,
  htmlIdGenerator,
} from '@elastic/eui';

import { FormattedMessage } from '@kbn/i18n/react';
import { formatResponse } from './policy_response_friendly_names';
import { POLICY_STATUS_TO_HEALTH_COLOR } from '../host_constants';
import {
  Immutable,
  HostPolicyResponseAppliedAction,
  HostPolicyResponseConfiguration,
  HostPolicyResponseArtifacts,
  HostPolicyResponseAppliedArtifact,
} from '../../../../../../common/endpoint/types';

/**
 * Nested accordion in the policy response detailing any concerned
 * actions the endpoint took to apply the policy configuration.
 */
const PolicyResponseConfigAccordion = styled(EuiAccordion)`
  .euiAccordion__triggerWrapper {
    padding: ${(props) => props.theme.eui.paddingSizes.s};
  }

  &.euiAccordion-isOpen {
    background-color: ${(props) => props.theme.eui.euiFocusBackgroundColor};
  }

  .euiAccordion__childWrapper {
    background-color: ${(props) => props.theme.eui.euiColorLightestShade};
  }

  .policyResponseAttentionBadge {
    background-color: ${(props) => props.theme.eui.euiColorDanger};
    color: ${(props) => props.theme.eui.euiColorEmptyShade};
  }

  .euiAccordion__button {
    :hover,
    :focus {
      text-decoration: none;
    }
  }

  :hover:not(.euiAccordion-isOpen) {
    background-color: ${(props) => props.theme.eui.euiColorLightestShade};
  }

  .policyResponseActionsAccordion {
    .euiAccordion__iconWrapper,
    svg {
      height: ${(props) => props.theme.eui.euiIconSizes.small};
      width: ${(props) => props.theme.eui.euiIconSizes.small};
    }
  }

  .policyResponseStatusHealth {
    width: 100px;
  }

  .policyResponseMessage {
    padding-left: ${(props) => props.theme.eui.paddingSizes.l};
  }

  .policyArtifactName {
    margin-bottom: ${(props) => props.theme.eui.paddingSizes.s};
  }
`;

const ResponseActions = memo(
  ({
    actions,
    responseActions,
  }: {
    actions: Immutable<string[]>;
    responseActions: Immutable<HostPolicyResponseAppliedAction[]>;
  }) => {
    return (
      <>
        {actions.map((action, index) => {
          const statuses = responseActions.find((responseAction) => responseAction.name === action);
          if (statuses === undefined) {
            return undefined;
          }
          return (
            <EuiAccordion
              id={action + index}
              key={action + index}
              data-test-subj="endpointDetailsPolicyResponseActionsAccordion"
              className="policyResponseActionsAccordion"
              buttonContent={
                <EuiText
                  size="xs"
                  className="eui-textTruncate"
                  data-test-subj="policyResponseAction"
                >
                  <h4>{formatResponse(action)}</h4>
                </EuiText>
              }
              paddingSize="s"
              extraAction={
                <EuiHealth
                  color={POLICY_STATUS_TO_HEALTH_COLOR[statuses.status]}
                  data-test-subj="policyResponseStatusHealth"
                  className="policyResponseStatusHealth"
                >
                  <EuiText size="xs">
                    <p>{formatResponse(statuses.status)}</p>
                  </EuiText>
                </EuiHealth>
              }
            >
              <EuiText size="xs" data-test-subj="policyResponseMessage">
                <p className="policyResponseMessage">{statuses.message}</p>
              </EuiText>
            </EuiAccordion>
          );
        })}
      </>
    );
  }
);

ResponseActions.displayName = 'ResponseActions';

const ArtifactDetails = memo(
  ({
    artrifactGroup,
    artifactVersion,
    artifactDetails,
  }: {
    artrifactGroup: string;
    artifactVersion: string;
    artifactDetails: Immutable<HostPolicyResponseAppliedArtifact[]>;
  }) => {
    return (
      <EuiAccordion
        data-test-subj="endpointDetailsPolicyResponseActionsAccordion"
        className="policyResponseActionsAccordion"
        buttonContent={
          <EuiText
            size="xs"
            className="eui-textTruncate"
            data-test-subj="policyResponseArtifactGroup"
          >
            <h4>{formatResponse(artrifactGroup)}</h4>
          </EuiText>
        }
        paddingSize="s"
        extraAction={
          <EuiText
            size="xs"
            className="eui-textTruncate"
            data-test-subj="policyResponseArtifactGroupVersion"
          >
            <p>{`v${artifactVersion}`}</p>
          </EuiText>
        }
      >
        {artifactDetails.map((artifact, index) => {
          return (
            <EuiText
              size="xs"
              data-test-subj="policyArtifactName"
              id={artifact.name + index}
              key={artifact.name + index}
              className="policyArtifactName"
            >
              <p className="policyResponseMessage">{artifact.name}</p>
            </EuiText>
          );
        })}
      </EuiAccordion>
    );
  }
);

ArtifactDetails.displayName = 'ArtifactDetails';

const ArtifactDetailsV2 = memo(
  ({
    artrifactGroup,
    artifactVersion,
    artifactDetails,
  }: {
    artrifactGroup: string;
    artifactVersion: string;
    artifactDetails: Immutable<HostPolicyResponseAppliedArtifact[]>;
  }) => {
    return (
      <EuiAccordion
        data-test-subj="endpointDetailsPolicyResponseActionsAccordion"
        className="policyResponseActionsAccordion"
        buttonContent={
          <EuiText size="xs" className="eui-textTruncate" data-test-subj="policyResponseAction">
            <h4>{`${formatResponse(artrifactGroup)}`}</h4>
          </EuiText>
        }
        paddingSize="s"
      >
        {artifactDetails.map((artifact, index) => {
          return (
            <EuiText
              size="xs"
              data-test-subj="policyResponseMessage"
              id={artifact.name + index}
              key={artifact.name + index}
            >
              <p className="policyResponseMessage">{artifact.name}</p>
            </EuiText>
          );
        })}
      </EuiAccordion>
    );
  }
);

ArtifactDetailsV2.displayName = 'ArtifactDetailsV2';

const PolicyArtifacts = memo(
  ({ responseArtifacts }: { responseArtifacts: Immutable<HostPolicyResponseArtifacts> }) => {
    const generateId = useMemo(() => htmlIdGenerator(), []);

    return (
      <PolicyResponseConfigAccordion
        data-test-subj="endpointDetailsPolicyArtifactsAccordian"
        buttonContent={
          <EuiText size="s">
            <p>
              <FormattedMessage
                id="xpack.securitySolution.endpoint.details.artifactsGlobal"
                defaultMessage="Artifacts"
              />
            </p>
          </EuiText>
        }
        paddingSize="m"
      >
        <div>
          {Object.entries(responseArtifacts).map(([key, val]) => {
            return (
              <ArtifactDetails
                id={generateId(`id_${key}`)}
                key={generateId(`key_${key}`)}
                artrifactGroup={key}
                artifactVersion={val.version}
                artifactDetails={val.identifiers}
              />
            );
          })}
        </div>
      </PolicyResponseConfigAccordion>
    );
  }
);

PolicyArtifacts.displayName = 'PolicyArtificats';

/**
 * A policy response is returned by the endpoint and shown in the host details after a user modifies a policy
 */
export const PolicyResponse = memo(
  ({
    responseConfig,
    responseActions,
    responseAttentionCount,
    responseArtifacts,
  }: {
    responseConfig: Immutable<HostPolicyResponseConfiguration>;
    responseActions: Immutable<HostPolicyResponseAppliedAction[]>;
    responseAttentionCount: Map<string, number>;
    responseArtifacts: Immutable<HostPolicyResponseArtifacts>;
  }) => {
    const generateId = useMemo(() => htmlIdGenerator(), []);

    return (
      <>
        <EuiText size="xs" className="eui-textTruncate" style={{ paddingLeft: '12px' }}>
          <h4>
            <FormattedMessage
              id="xpack.securitySolution.endpoint.details.artifactsGlobal"
              defaultMessage="Configurations"
            />
          </h4>
        </EuiText>
        <EuiSpacer size="s" />
        {Object.entries(responseConfig).map(([key, val]) => {
          const attentionCount = responseAttentionCount.get(key);
          return (
            <PolicyResponseConfigAccordion
              id={generateId(`id_${key}`)}
              key={generateId(`key_${key}`)}
              data-test-subj="endpointDetailsPolicyResponseConfigAccordion"
              buttonContent={
                <EuiText size="s">
                  <p>{formatResponse(key)}</p>
                </EuiText>
              }
              paddingSize="m"
              extraAction={
                attentionCount &&
                attentionCount > 0 && (
                  <EuiNotificationBadge
                    className="policyResponseAttentionBadge"
                    data-test-subj="endpointDetailsPolicyResponseAttentionBadge"
                  >
                    {attentionCount}
                  </EuiNotificationBadge>
                )
              }
            >
              <ResponseActions actions={val.concerned_actions} responseActions={responseActions} />
            </PolicyResponseConfigAccordion>
          );
        })}
        <EuiSpacer size="s" />
        <EuiText style={{ paddingLeft: '12px' }} size="xs" className="eui-textTruncate">
          <h4>
            <FormattedMessage
              id="xpack.securitySolution.endpoint.details.artifactsGlobal"
              defaultMessage="Downloads"
            />
          </h4>
        </EuiText>
        <EuiSpacer size="s" />
        <PolicyArtifacts responseArtifacts={responseArtifacts} />
      </>
    );
  }
);

PolicyResponse.displayName = 'PolicyResponse';
