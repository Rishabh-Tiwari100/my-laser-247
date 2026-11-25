import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  useGetCasinoCategoriesQuery,
  useGetCasinoProvidersQuery,
  useLazyGetCasinoGamesQuery,
} from '@/store/api/casinoApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearCasinoGameDetail, setIsUrlFetched } from '@/store/slices/casinoGameDetailSlice';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useCasinoGameLauncher } from '@/components/casino/useCasinoGameLauncher';

export const useCasinoGames = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get('search') ?? '';
  const selectedCategory = searchParams.get('category') || 'ALL';
  // --- State ---
  const [searchTerm, setSearchTerm] = useState(searchValue.trim());
  const [allGames, setAllGames] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  // --- Refs ---
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1); // Tracks actual page to prevent stale closure bugs
  const filterVersion = useRef(0);

  // --- Hooks & Selectors ---
  const location = useLocation();
  const dispatch = useDispatch();

  const userId = useSelector((s: RootState) => s.user?.profile?.id);
  const gameId = useSelector((s: RootState) => s.casino.selectedGame?.id);

  // --- API Queries ---
  const [fetchGames, { isFetching, isUninitialized, error }] = useLazyGetCasinoGamesQuery();
  const isLoadingGames = isUninitialized || isFetching;
  const { data: categoriesData } = useGetCasinoCategoriesQuery({});
  const { data: providerData } = useGetCasinoProvidersQuery();
  const { gameUrl, setGameUrl, isIframeLoaded, setIsIframeLoaded, sessionLoading, launchGame } =
    useCasinoGameLauncher({
      onBeforeLaunch: () => dispatch(setIsUrlFetched(true)),
    });

  // --- Memoized Lists ---
  const categoryList = useMemo(
    () => [
      'ALL',
      ...(categoriesData?.games ?? []).filter(
        (label): label is string => typeof label === 'string' && label.trim().length > 0
      ),
    ],
    [categoriesData?.games]
  );

  const providerList = useMemo(() => {
    const providers =
      providerData?.providers?.reduce<{ id: number | string; name: string }[]>(
        (list, provider, idx) => {
          const name = (provider.provider || provider.name || provider.providername || '').trim();
          if (!name || provider.status?.toLowerCase() === 'inactive') return list;

          list.push({ id: provider.id ?? idx, name });
          return list;
        },
        []
      ) ?? [];

    return [{ id: 'ALL', name: 'ALL' }, ...providers];
  }, [providerData?.providers]);

  const isEvolutionRoute =
    location.pathname.toLowerCase().replace(/\/+$/, '') === '/casino/evolution';
  const routeProvider = isEvolutionRoute
    ? providerList.find(({ name }) => name.toLowerCase().includes('evolution'))?.name
    : undefined;
  const selectedProvider = searchParams.get('provider') || routeProvider || 'ALL';

  const updateFilter = useCallback(
    (key: 'category' | 'provider' | 'search', value: string) => {
      const nextParams = new URLSearchParams(searchParams);
      if (
        !value ||
        (key !== 'search' && value === 'ALL' && !(key === 'provider' && isEvolutionRoute))
      ) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
      if (nextParams.toString() !== searchParams.toString()) {
        setSearchParams(nextParams, { replace: key === 'search' });
      }
    },
    [isEvolutionRoute, searchParams, setSearchParams]
  );

  // --- Core Fetch Logic ---
  const loadGames = useCallback(
    async (page: number, isNewFilter: boolean = false) => {
      const version = filterVersion.current;
      try {
        const result = await fetchGames({
          provider: selectedProvider !== 'ALL' ? selectedProvider : undefined,
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          page,
          limit: 30,
          search: searchTerm || undefined,
          userId,
          status: 'ACTIVE',
        }).unwrap();

        if (version !== filterVersion.current) return;
        const games = result?.games ?? [];
        if (isNewFilter) {
          setAllGames(games);
        } else {
          setAllGames((prev) => {
            const existingIds = new Set(prev.map((g) => g.id));
            const uniqueNewGames = games.filter((g: any) => !existingIds.has(g.id));
            return [...prev, ...uniqueNewGames];
          });
        }

        const totalPages = result?.pagination?.totalPage || 1;
        setHasMore(page < totalPages);
      } catch (err) {
        if (version !== filterVersion.current) return;
        console.error('Failed to load games:', err);
        setHasMore(false);
      }
    },
    [selectedProvider, selectedCategory, searchTerm, userId, fetchGames]
  );

  // --- Handlers ---
  const handleProviderSelect = (_id: string | number, provider: string) =>
    updateFilter('provider', provider);

  const handleGameClick = useCallback(
    async (id: number) => {
      await launchGame(id);
    },
    [launchGame]
  );

  // --- Effects ---

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchTerm(searchValue.trim()), 500);
    return () => window.clearTimeout(timer);
  }, [searchValue]);

  // Handle Search/Filter resets
  useEffect(() => {
    pageRef.current = 1;
    setCurrentPage(1);
    setHasMore(true);
    loadGames(1, true);

    // Auto-scroll to top when filters change
    if (observerTarget.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return () => {
      filterVersion.current += 1;
    };
  }, [selectedProvider, selectedCategory, searchTerm, loadGames]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!hasMore || isLoadingGames) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          setCurrentPage(nextPage);
          loadGames(nextPage, false);
        }
      },
      { rootMargin: '300px' }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoadingGames, loadGames]);

  // Auto-open game if coming from deep links/other pages
  useEffect(() => {
    if (gameId) handleGameClick(gameId);
    return () => {
      dispatch(clearCasinoGameDetail());
    };
  }, [gameId, handleGameClick, dispatch]);

  return {
    searchValue,
    selectedProvider,
    selectedCategory,
    setSelectedCategory: (category: string) => updateFilter('category', category),
    allGames,
    currentPage,
    hasMore,
    failedImages,
    setFailedImages,
    gameUrl,
    setGameUrl,
    setIsIframeLoaded,
    isIframeLoaded,
    sessionLoading,
    observerTarget,
    dispatch,
    categoryList,
    providerList,
    isLoadingGames,
    error,
    handleProviderSelect,
    handleGameClick,
    setSearchValue: (value: string) => updateFilter('search', value),
  };
};
