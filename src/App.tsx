import { Routes, Route, Navigate } from 'react-router-dom';
import HomeLayout from '@/layouts/HomeLayout';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { GuestRoute } from '@/components/common/GuestRoute';
import UserEligibilityRoute from '@/components/common/UserEligibilityRoute';
import DemoProtectedRoute from '@/components/common/DemoProtectedRoute';
import AffiliateUserRoute from '@/components/common/AffiliateUserRoute';
import NotOutLoader from '@/components/common/NotOutLoader';
import loadable from '@/utils/loadable';
import MaintenancePage from './pages/MaintenancePage';
import './index.css';
import { RootState } from './store';
import { useAppSelector } from './hooks';
import { useEffect } from 'react';

const MainLayout = loadable(() => import('@/layouts/MainLayout'), {
  fallback: <NotOutLoader />,
});

const AuthLayout = loadable(() => import('@/layouts/AuthLayout'), {
  fallback: <NotOutLoader />,
});
const Login = loadable(() => import('@/pages/Auth/Login'), {
  fallback: <NotOutLoader />,
});
const ForgotPassword = loadable(() => import('@/pages/Auth/ForgotPassword'), {
  fallback: <NotOutLoader />,
});
const ChangePassword = loadable(() => import('@/pages/Auth/ChangePassword'), {
  fallback: <NotOutLoader />,
});
const HomePage = loadable(() => import('@/pages/Home'), {
  fallback: <NotOutLoader />,
});
const MarketDetails = loadable(() => import('@/pages/MarketDetails'), {
  fallback: <NotOutLoader />,
});
const AllSports = loadable(() => import('@/pages/AllSports'), {
  fallback: <NotOutLoader />,
});

const StakeSettings = loadable(() => import('@/pages/StakeSettings'), {
  fallback: <NotOutLoader />,
});

const CasinoGames = loadable(() => import('@/pages/CasinoGames'), {
  fallback: <NotOutLoader />,
});

const TermsPolicy = loadable(() => import('@/pages/TermsPolicy'), {
  fallback: <NotOutLoader />,
});
const CasinoBetHistory = loadable(() => import('@/pages/Reports/CasinoBetHistory'), {
  fallback: <NotOutLoader />,
});

const BetProfitLoss = loadable(() => import('@/pages/Reports/BetProfitLoss'), {
  fallback: <NotOutLoader />,
});
const BetProfitLossDetail = loadable(() => import('@/pages/Reports/BetProfitLossDetail'), {
  fallback: <NotOutLoader />,
});
const Turnover = loadable(() => import('@/pages/Reports/Turnover'), {
  fallback: <NotOutLoader />,
});
const Account = loadable(() => import('@/pages/Reports/Account'), {
  fallback: <NotOutLoader />,
});

const Deposit = loadable(() => import('@/pages/Withdraw_Deposit/Deposit'), {
  fallback: <NotOutLoader />,
});
const Withdraw = loadable(() => import('@/pages/Withdraw_Deposit/Withdraw'), {
  fallback: <NotOutLoader />,
});
const CasinoFavouriteGames = loadable(() => import('@/pages/CasinoGames/CasinoFavouriteGames'), {
  fallback: <NotOutLoader />,
});
const ReferralPage = loadable(() => import('@/pages/ReferralPage'), {
  fallback: <NotOutLoader />,
});
const MyBetsPage = loadable(() => import('@/pages/MyBetsPage'), {
  fallback: <NotOutLoader />,
});
const Affiliate = loadable(() => import('@/pages/Affiliate'), {
  fallback: <NotOutLoader />,
});
const Promotions = loadable(() => import('@/pages/Promotions'), {
  fallback: <NotOutLoader />,
});
const PopularEvents = loadable(() => import('@/pages/PopularEvents'), {
  fallback: <NotOutLoader />,
});
const BonusStatement = loadable(() => import('@/pages/BonusStatement'), {
  fallback: <NotOutLoader />,
});
const MyWallet = loadable(() => import('@/pages/MyWallet'), {
  fallback: <NotOutLoader />,
});

const Glive = loadable(() => import('@/pages/Glive'), {
  fallback: <NotOutLoader />,
});

const PromotionDetails = loadable(() => import('@/pages/PromotionDetails'), {
  fallback: <NotOutLoader />,
});

const MyAccountLayout = loadable(() => import('@/pages/MyAccount'), {
  fallback: <NotOutLoader />,
});

const MyProfile = loadable(() => import('@/pages/MyAccount/Profile'), {
  fallback: <NotOutLoader />,
});

const UpdateMobileNumber = loadable(() => import('@/pages/MyAccount/UpdateMobileNumber'), {
  fallback: <NotOutLoader />,
});

const BalanceOverview = loadable(() => import('@/pages/MyAccount/BalanceOverview'), {
  fallback: <NotOutLoader />,
});

const TwoFaSetupAuth = loadable(() => import('@/pages/TwoFA/SetupAuth'), {
  fallback: <NotOutLoader />,
});
const TwoFaIndex = loadable(() => import('@/pages/TwoFA'), {
  fallback: <NotOutLoader />,
});
const TwoFaGoogleSetup = loadable(() => import('@/pages/TwoFA/GoogleSetup'), {
  fallback: <NotOutLoader />,
});
const TwoFaGoogleVerify = loadable(() => import('@/pages/TwoFA/GoogleVerify'), {
  fallback: <NotOutLoader />,
});
const TwoFaEdit = loadable(() => import('@/pages/TwoFA/Edit2FA'), {
  fallback: <NotOutLoader />,
});
const TwoFaEditVerifyOtp = loadable(() => import('@/pages/TwoFA/EditVerifyOtp'), {
  fallback: <NotOutLoader />,
});
const ProfitLoss = loadable(() => import('@/pages/MyAccount/MyBets'), {
  fallback: <NotOutLoader />,
});

const ActivityLog = loadable(() => import('@/pages/MyAccount/ActivityLog'), {
  fallback: <NotOutLoader />,
});

const Cashback = loadable(() => import('@/pages/MyAccount/Cashback'), {
  fallback: <NotOutLoader />,
});

const AWCBets = loadable(() => import('@/pages/MyAccount/AWCBets'), {
  fallback: <NotOutLoader />,
});

const ParlayBets = loadable(() => import('@/pages/MyAccount/ParlayBets'), {
  fallback: <NotOutLoader />,
});

const BOBets = loadable(() => import('@/pages/MyAccount/BOBets'), {
  fallback: <NotOutLoader />,
});

const BetgamesBets = loadable(() => import('@/pages/MyAccount/BetgamesBets'), {
  fallback: <NotOutLoader />,
});
const Rules = loadable(() => import('@/pages/Rules'), {
  fallback: <NotOutLoader />,
});

const SettledBets = loadable(() => import('@/pages/SettledBets'), {
  fallback: <NotOutLoader />,
});

const MultiMarket = loadable(() => import('@/pages/MultiMarket'), {
  fallback: <NotOutLoader />,
});

export function App() {
  const user = useAppSelector((state: RootState) => state.user.profile);

  useEffect(() => {
    if (user?.id) {
      window.LASER_CHAT_USER_ID = user.username ? `${user.username} | ${user.id}` : String(user.id);
    } else {
      delete window.LASER_CHAT_USER_ID;
    }
  }, [user]);

  if (import.meta.env.VITE_MAINTENANCE_MODE === 'true')
    return (
      <Routes>
        <Route path="*" element={<MaintenancePage />} />s
      </Routes>
    );
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* home layout  */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/glive" element={<Glive />} />
        <Route path="/terms-policy" element={<TermsPolicy />} />
        {/* <Route path="/game-rules" element={<GameRules />} /> */}
      </Route>

      {/* home layout mini footer */}
      <Route element={<MainLayout />}>
        <Route path="/inplay" element={<AllSports />} />
        <Route path="/casino/evolution" element={<CasinoGames />} />
        <Route path="/casino" element={<CasinoGames />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/popular-events" element={<PopularEvents />} />
        <Route path="/promotion/:id" element={<PromotionDetails />} />
        <Route path="/dashboard" element={<AllSports />} />
        <Route path="/2fa" element={<TwoFaIndex />} />
        <Route path="/my-account/2fa" element={<TwoFaIndex />} />
        <Route path="/2fa/setup-auth" element={<TwoFaSetupAuth />} />
        <Route path="/2fa/google/setup" element={<TwoFaGoogleSetup />} />
        <Route path="/2fa/google/verify" element={<TwoFaGoogleVerify />} />
        <Route path="/2fa/edit-2fa" element={<TwoFaEdit />} />
        <Route path="/2fa/edit/verify/otp" element={<TwoFaEditVerifyOtp />} />
        <Route path="/sports">
          <Route index element={<AllSports />} />
          <Route path=":sportName" element={<AllSports />} />
          <Route path=":sportName/:competitionId" element={<AllSports />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path=":sportName/:competitionId/market-details/:eventId"
              element={<MarketDetails />}
            />
          </Route>
        </Route>

        <Route path="/multi-market" element={<MultiMarket />} />
        <Route path="cashback" element={<Cashback />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-account" element={<MyAccountLayout />}>
            <Route index element={<Navigate to="profile" replace />} />

            <Route path="profile" element={<MyProfile />} />
            <Route path="balance-overview" element={<BalanceOverview />} />
            <Route
              path="account-statement"
              element={<Navigate to="/account-statement" replace />}
            />
            <Route path="my-bets" element={<Navigate to="/my-bets" replace />} />
            <Route path="bet-history" element={<Navigate to="/settled-bets" replace />} />
            <Route path="profit-loss" element={<ProfitLoss />} />
            <Route path="activity-log" element={<ActivityLog />} />
            <Route path="parlay-bets" element={<ParlayBets />} />
            <Route path="awc-bets" element={<AWCBets />} />
            <Route path="bo-bets" element={<BOBets />} />
            <Route path="betgames-bets" element={<BetgamesBets />} />
          </Route>

          <Route path="/stake-settings" element={<StakeSettings />} />
          <Route path="/settled-bets" element={<SettledBets />} />
          <Route path="/bet-history" element={<Navigate to="/settled-bets" replace />} />
          <Route path="/my-bets" element={<MyBetsPage />} />
          <Route path="/casino/favourite-games" element={<CasinoFavouriteGames />} />
          <Route path="/casino-bet-history" element={<CasinoBetHistory />} />
          <Route path="/profit-loss" element={<BetProfitLoss />} />
          <Route path="/profit-loss-detail" element={<BetProfitLossDetail />} />
          <Route path="/turnover-history" element={<Turnover />} />
          <Route path="/account-statement" element={<Account />} />
          <Route path="/statements" element={<Account />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/user/rules" element={<Rules />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/bonus-statement" element={<BonusStatement />} />
          <Route element={<UserEligibilityRoute />}>
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/wallet-withdraw" element={<Withdraw />} />
          </Route>

          <Route element={<DemoProtectedRoute />}>
            <Route path="/my-account/update-mobile-number" element={<UpdateMobileNumber />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/refer-earn" element={<ReferralPage />} />
            <Route path="/wallet" element={<MyWallet />} />
          </Route>

          <Route element={<AffiliateUserRoute />}>
            <Route path="/affiliate" element={<Affiliate />} />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
  );
}
