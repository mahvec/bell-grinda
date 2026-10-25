import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { profileRepository, sessionRepository } from "./persistence/database";
import { useAppDispatch, useAppSelector } from "./state/hooks";
import { hydrate } from "./state/store";

const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const HistoryPage = lazy(() => import("./pages/HistoryPage").then((module) => ({ default: module.HistoryPage })));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage").then((module) => ({ default: module.OnboardingPage })));
const ExercisesPage = lazy(() => import("./pages/ExercisesPage").then((module) => ({ default: module.ExercisesPage })));
const ProfilePage = lazy(() => import("./pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const ProgressPage = lazy(() => import("./pages/ProgressPage").then((module) => ({ default: module.ProgressPage })));
const ReadinessPage = lazy(() => import("./pages/ReadinessPage").then((module) => ({ default: module.ReadinessPage })));
const SessionPage = lazy(() => import("./pages/SessionPage").then((module) => ({ default: module.SessionPage })));
const WorkoutPreviewPage = lazy(() => import("./pages/WorkoutPreviewPage").then((module) => ({ default: module.WorkoutPreviewPage })));
const WarmupPage = lazy(() => import("./pages/WarmupPage").then((module) => ({ default: module.WarmupPage })));

function RouteFallback() {
  return <main className="boot-screen"><span className="brand-mark large">BG</span><p>Preparing your training view</p></main>;
}

export function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [pathname]);
  const dispatch = useAppDispatch();
  const { hydrated, profile } = useAppSelector((state) => state.app);
  useEffect(() => {
    void Promise.all([profileRepository.get(), sessionRepository.getActive()]).then(([savedProfile, activeSession]) => {
      dispatch(hydrate({ profile: savedProfile ?? null, activeSession: activeSession ?? null }));
    });
  }, [dispatch]);

  if (!hydrated) return <main className="boot-screen"><span className="brand-mark large">BG</span><p>Loading your training state</p></main>;
  if (!profile) return <Suspense fallback={<RouteFallback />}><OnboardingPage /></Suspense>;

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/readiness" element={<ReadinessPage />} />
        <Route path="/workout" element={<WorkoutPreviewPage />} />
        <Route path="/warmup" element={<WarmupPage />} />
        <Route path="/session" element={<SessionPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
