const dynamicSegmentPattern = /^(?:\d+|[0-9a-f-]{8,}|[a-z0-9_-]*\d[a-z0-9_-]*)$/i;

const cmsParamSegmentPattern = /^:[A-Za-z][A-Za-z0-9_]*$/;

export const normalizeCmsPath = (path: string) => {
  if (path === '/') return path;
  return path.replace(/\/+$/, '');
};

const splitPath = (path: string) => normalizeCmsPath(path).split('/').filter(Boolean);

const isCmsParamSegment = (segment: string) => cmsParamSegmentPattern.test(segment);

const isDynamicSegment = (segment: string) => dynamicSegmentPattern.test(segment);

export const isSameCmsRouteShape = (currentPage: string, cmsPage: string) => {
  const currentSegments = splitPath(currentPage);
  const cmsSegments = splitPath(cmsPage);

  if (currentSegments.length !== cmsSegments.length) return false;

  return currentSegments.every((segment, index) => {
    const cmsSegment = cmsSegments[index];
    if (!cmsSegment) return false;

    return (
      segment === cmsSegment ||
      isCmsParamSegment(cmsSegment) ||
      (isDynamicSegment(segment) && isDynamicSegment(cmsSegment))
    );
  });
};
