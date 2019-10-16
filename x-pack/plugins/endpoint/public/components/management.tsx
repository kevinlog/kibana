/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Component } from 'react';

import {
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiBasicTable,
} from '@elastic/eui';

import { SearchBar } from './search_bar';

interface Props {
  endpointMetadata: any;
}

interface State {
  queriedEndpointMetadata: {};
}

export class EndpointList extends Component<Props, State> {
  public state = {
    queriedEndpointMetadata: null,
  };

  public updateOnChange = ({ updatedResult }: { updatedResult: {} }) => {
    this.setState({ queriedEndpointMetadata: updatedResult });
  };

  public render() {
    const { endpointMetadata } = this.props;
    const { queriedEndpointMetadata } = this.state;

    const items: [] = queriedEndpointMetadata
      ? queriedEndpointMetadata
      : endpointMetadata.hits.hits;

    const columns = [
      {
        field: '_source',
        name: 'Hostname',
        sortable: true,
        render: source => {
          return <span>{source.host.hostname}</span>;
        },
        truncateText: false,
      },
      {
        field: '_source',
        name: 'IP',
        sortable: true,
        render: source => {
          return <span>{source.host.ip}</span>;
        },
        truncateText: false,
      },
      {
        field: '_source',
        name: 'Operating System',
        sortable: true,
        render: source => {
          return <span>{source.host.os.name + ' ' + source.host.os.version}</span>;
        },
        truncateText: false,
      },
      {
        field: '_source',
        name: 'Sensor Version',
        sortable: true,
        render: source => {
          return <span>{source.agent.version}</span>;
        },
        truncateText: false,
      },
    ];

    return (
      <>
        <SearchBar
          searchItems={endpointMetadata.hits.hits}
          defaultFields={[`_source`]}
          updateOnChange={this.updateOnChange}
        />
        <EuiBasicTable items={items} columns={columns} />
      </>
    );
  }
}

export const Management = ({ endpointMetadata }: { endpointMetadata: any }) => {
  return (
    <EuiPageBody data-test-subj="fooAppPageA">
      <EuiPageHeader>
        <EuiPageHeaderSection>
          <EuiTitle size="l">
            <h1>Endpoint Management</h1>
          </EuiTitle>
        </EuiPageHeaderSection>
      </EuiPageHeader>
      <EuiPageContent>
        <EuiPageContentHeader>
          <EuiPageContentHeaderSection>
            <EuiTitle>
              <h2>Manage your Endpoints</h2>
            </EuiTitle>
          </EuiPageContentHeaderSection>
        </EuiPageContentHeader>
        <EuiPageContentBody>
          Here's your Endpoints
          <EndpointList endpointMetadata={endpointMetadata} />
        </EuiPageContentBody>
      </EuiPageContent>
    </EuiPageBody>
  );
};
