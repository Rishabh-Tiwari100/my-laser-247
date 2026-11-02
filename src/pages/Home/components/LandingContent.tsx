import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetCmsContentQuery } from '@/store/api/cmsApi';
import { sanitizeCmsContent } from '@/utils/sanitizeCmsContent';
import { cn } from '@/utils';
import { isSameCmsRouteShape, normalizeCmsPath } from '@/utils/cmsRouteMatcher';

const collapsedHeight = 200;

interface LandingContentProps {
  page?: string;
  className?: string;
}

function LandingContent({ page = '/', className }: LandingContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(collapsedHeight);
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: cmsContentResponse } = useGetCmsContentQuery({
    type: 'footer',
  });
  const cmsFooterContent = useMemo(() => {
    const normalizedPage = normalizeCmsPath(page);
    const activeFooterContent =
      cmsContentResponse?.data
        ?.filter(({ isActive, type }) => isActive && type === 'footer')
        .sort(
          (first, second) =>
            new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
        ) ?? [];

    const exactMatch = activeFooterContent.find(
      (content) => normalizeCmsPath(content.page) === normalizedPage
    );
    const routeShapeMatch = activeFooterContent.find((content) =>
      isSameCmsRouteShape(normalizedPage, content.page)
    );

    return (exactMatch ?? routeShapeMatch)?.content;
  }, [cmsContentResponse?.data, page]);
  const sanitizedCmsFooterContent = useMemo(
    () => sanitizeCmsContent(cmsFooterContent),
    [cmsFooterContent]
  );

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (contentRef.current) observer.observe(contentRef.current);

    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [sanitizedCmsFooterContent]);

  if (!sanitizedCmsFooterContent) return null;

  return (
    <section className={cn('mt-4 bg-primary-theme px-4 py-5 sm:px-8 sm:py-7', className)}>
      <div
        className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: isExpanded ? contentHeight : collapsedHeight }}
      >
        <div
          ref={contentRef}
          className="cms-api-content home-cms-content"
          dangerouslySetInnerHTML={{ __html: sanitizedCmsFooterContent }}
        />

        {!isExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-white/0 to-primary-theme" />
        )}
      </div>

      {contentHeight > collapsedHeight && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
            className="text-sm font-bold capitalize text-[#0cddff] transition-colors hover:text-[#0cddff]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0cddff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef3f9]"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        </div>
      )}
    </section>
  );
}

export default LandingContent;
