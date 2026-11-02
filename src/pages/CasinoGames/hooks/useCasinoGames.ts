import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  useGetCasinoCategoriesQuery,
  useGetCasinoProvidersQuery,
  useLazyGetCasinoGamesQuery,
} from '@/store/api/casinoApi';
import { useAddToFavoriteMutation } from '@/store/api/casinoHomePageApi';
import { debounce } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import toast from 'react-hot-toast';
import { clearCasinoGameDetail, setIsUrlFetched } from '@/store/slices/casinoGameDetailSlice';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCasinoGameLauncher } from '@/components/casino/useCasinoGameLauncher';
import { useIsAuthenticated, useIsDemoUser } from '@/hooks/redux';

export const useCasinoGames = () => {

  const [searchParams] = useSearchParams()
  const querySearch = searchParams.get('search') || '';
  // --- State ---
  const [searchTerm, setSearchTerm] = useState(querySearch ?? '');
  const [selectedProvider, setSelectedProvider] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [allGames, setAllGames] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  // --- Refs ---
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1); // Tracks actual page to prevent stale closure bugs

  // --- Hooks & Selectors ---
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isDemoUser = useIsDemoUser();
  const isAuthenticated = useIsAuthenticated();
  const userId = useSelector((s: RootState) => s.user?.profile?.id);
  const gameId = useSelector((s: RootState) => s.casino.selectedGame?.id);

  // --- API Queries ---
  const [fetchGames, { isFetching, isLoading, error }] = useLazyGetCasinoGamesQuery();
  const { data: categoriesData } = useGetCasinoCategoriesQuery({});
  const { data: providerData } = useGetCasinoProvidersQuery();
  const [addToFavorite] = useAddToFavoriteMutation();
  const { gameUrl, setGameUrl, isIframeLoaded, setIsIframeLoaded, sessionLoading, launchGame } =
    useCasinoGameLauncher({
      onBeforeLaunch: () => dispatch(setIsUrlFetched(true)),
    });

  // --- Memoized Lists ---
  const categoryList = useMemo(
    () => ['ALL', ...(categoriesData?.games ?? [])],
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

  const initialProviderFromRoute = useMemo(() => {
    const path = location.pathname?.toLowerCase() ?? '';
    if (!path.includes('/casino/evolution')) return null;

    const matchedProvider = providerData?.providers.find((provider) =>
      provider.provider?.toLowerCase().includes('evolution')
    )?.provider;

    return matchedProvider ?? null;
  }, [location.pathname, providerData?.providers]);

  // --- Core Fetch Logic ---
  const loadGames = useCallback(
    async (page: number, isNewFilter: boolean = false) => {
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
        console.error('Failed to load games:', err);
        setHasMore(false);
      }
    },
    [selectedProvider, selectedCategory, searchTerm, userId, fetchGames]
  );

  // --- Handlers ---
  const handleProviderSelect = useCallback((id: string | number, provider: string) => {
    setSelectedProvider(provider);
  }, []);

  const handleToggleFavorite = useCallback(
    async (id: number, isFav: boolean) => {
      if (isDemoUser) {
        toast.error('This feature is not available for demo users.', { id: 'favorite' });
        return;
      }
      if (!isAuthenticated) {
        toast.error('Login required');
        navigate('/login');
        return;
      }
      try {
        const status = isFav ? 'UNFAVORITE' : 'FAVORITE';
        const result: any = await addToFavorite({ id, status }).unwrap();
        toast.success(result?.message || 'Favorite updated!', { id: 'favorite' });
        setAllGames((prev) => prev.map((g) => (g.id === id ? { ...g, isFavorite: !isFav } : g)));
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to update favourite');
      }
    },
    [addToFavorite, isAuthenticated, isDemoUser, navigate]
  );

  const handleGameClick = useCallback(
    async (id: number) => {
      await launchGame(id);
    },
    [launchGame]
  );

  // --- Effects ---

  useEffect(() => {
    if (!initialProviderFromRoute) return;
    setSelectedProvider(initialProviderFromRoute);
  }, [initialProviderFromRoute]);

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
  }, [selectedProvider, selectedCategory, searchTerm, loadGames]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    if (!hasMore || isFetching || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isFetching) {
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
  }, [hasMore, isFetching, isLoading, loadGames]);

  // Auto-open game if coming from deep links/other pages
  useEffect(() => {
    if (gameId) handleGameClick(gameId);
    return () => {
      dispatch(clearCasinoGameDetail());
    };
  }, [gameId, handleGameClick, dispatch]);

  const debouncedSearch = useRef(debounce((value: string) => setSearchTerm(value), 500)).current;

  return {
    searchTerm,
    selectedProvider,
    setSelectedProvider,
    selectedCategory,
    setSelectedCategory,
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
    isLoading,
    isFetching,
    error,
    handleProviderSelect,
    handleGameClick,
    handleToggleFavorite,
    debouncedSearch,
  };
};
