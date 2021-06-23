/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const isVersionSupported = ({
  currentVersion,
  minVersionRequired,
}: {
  currentVersion: string;
  minVersionRequired: string;
}) => {
  const parsedCurrentVersion = currentVersion.includes('-SNAPSHOT')
    ? currentVersion.substring(0, currentVersion.length - 9)
    : currentVersion;
  const tokenizedCurrent = parsedCurrentVersion
    .split('.')
    .map((token: string) => parseInt(token, 10));
  const tokenizedMin = minVersionRequired.split('.').map((token: string) => parseInt(token, 10));

  const versionNotSupported = tokenizedCurrent.some((token: number, index: number) => {
    return token < tokenizedMin[index];
  });

  return !versionNotSupported;
};

export const isOsSupported = ({
  currentOs,
  supportedOss,
}: {
  currentOs: string;
  supportedOss: string[];
}) => {
  return supportedOss.some((os) => currentOs === os);
};

export const isIsolationSupported = ({ osName, version }: { osName: string; version: string }) => {
  const normalizedOs = osName.toLowerCase();
  return (
    isOsSupported({ currentOs: normalizedOs, supportedOss: ['macos', 'windows'] }) &&
    isVersionSupported({ currentVersion: version, minVersionRequired: '7.14.0' })
  );
};
