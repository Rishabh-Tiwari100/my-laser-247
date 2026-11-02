import { isSameCmsRouteShape, normalizeCmsPath } from './cmsRouteMatcher';

describe('cmsRouteMatcher', () => {
  it('normalizes trailing slashes', () => {
    expect(normalizeCmsPath('/sports/cricket/')).toBe('/sports/cricket');
  });

  it('matches CMS placeholder routes against actual route params', () => {
    expect(
      isSameCmsRouteShape(
        '/sports/cricket/123/market-details/456',
        '/sports/:sportName/:competitionId/market-details/:eventId'
      )
    ).toBe(true);
  });

  it('matches route shapes when CMS uses matching actual dynamic ids', () => {
    expect(
      isSameCmsRouteShape(
        '/sports/cricket/123/market-details/456',
        '/sports/cricket/123/market-details/456'
      )
    ).toBe(true);
  });

  it('does not match different literal route segments', () => {
    expect(
      isSameCmsRouteShape(
        '/sports/cricket/123/market-details/456',
        '/sports/football/123/market-details/456'
      )
    ).toBe(false);
  });

  it('does not match different route shapes', () => {
    expect(
      isSameCmsRouteShape(
        '/sports/cricket/123/market-details/456',
        '/sports/:sportName/:competitionId'
      )
    ).toBe(false);
  });
});
