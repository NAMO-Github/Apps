import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

interface Props {
  height?: number | string;
}

export default function NftSkeleton({ height = '100%' }: Props) {
  return (
    <ContentLoader
      speed={1}
      height={height}
      backgroundColor="#f3f3f3"
      foregroundColor="#ffffff"
      style={{ marginHorizontal: 16 }}
    >
      <Rect y="20" rx="6" ry="6" width="45%" height="180" />
      <Rect x="200" y="20" rx="6" ry="6" width="45%" height="180" />
      <Rect y="260" rx="6" ry="6" width="45%" height="180" />
      <Rect x="200" y="260" rx="6" ry="6" width="45%" height="180" />
      <Rect y="490" rx="6" ry="6" width="45%" height="180" />
      <Rect x="200" y="490" rx="6" ry="6" width="45%" height="180" />
    </ContentLoader>
  );
}
