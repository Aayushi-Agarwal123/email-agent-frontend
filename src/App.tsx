import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "@/components/home/home-page";
import { PublicLayout } from "@/components/layouts/public-layout";
import { SignInPage } from "@/components/auth/sign-in-page";
import { RegisterPage } from "@/components/auth/register-page";
import { RequireMockAuth } from "@/components/auth/require-mock-auth";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";
import { OnboardingRoute } from "@/components/onboarding/onboarding-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { OverviewRoute, ReviewQueueRoute, CatalogRoute, SettingsRoute } from "@/components/dashboard/dashboard-routes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<PublicLayout />}>
        <Route
          path="/signin"
          element={
            <RedirectIfAuthed>
              <SignInPage />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthed>
              <RegisterPage />
            </RedirectIfAuthed>
          }
        />
      </Route>

      <Route
        path="/onboarding"
        element={
          <RequireMockAuth>
            <OnboardingRoute />
          </RequireMockAuth>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RequireMockAuth>
            <DashboardLayout />
          </RequireMockAuth>
        }
      >
        <Route index element={<OverviewRoute />} />
        <Route path="review-queue" element={<ReviewQueueRoute />} />
        <Route path="catalog" element={<CatalogRoute />} />
        <Route path="settings" element={<SettingsRoute />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
