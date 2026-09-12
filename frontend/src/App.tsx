import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CaseProvider } from './context/CaseContext';

import { PublicLayout } from './components/common/PublicLayout';

import { LandingEntryPage } from './pages/LandingEntryPage';
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ImpactPage } from './pages/ImpactPage';
import { AboutPage } from './pages/AboutPage';
import { ReportPage } from './pages/ReportPage';
import { TrackPage } from './pages/TrackPage';
import { ResponderDashboard } from './pages/ResponderDashboard';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { ResponderMapPage } from './pages/ResponderMapPage';
import { MissingMatchesPage } from './pages/MissingMatchesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ResourcesPage } from './pages/ResourcesPage';
import { TrustedReporterPage } from './pages/TrustedReporterPage';
import { ResponderLayout } from './components/responder/ResponderLayout';

const RedirectTrackRoute: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/app${location.pathname}${location.search}`} replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CaseProvider>
            <Router>
              <Routes>
                
                {/* 1. FRONT DOOR ENTRY LANDING PAGE (No Left Sidebar) */}
                <Route path="/" element={<LandingEntryPage />} />
                <Route path="/landing" element={<LandingEntryPage />} />

                {/* 2. RESPONDER COMMAND CENTER PORTAL (Wrapped in ResponderLayout) */}
                <Route
                  path="/responder/*"
                  element={
                    <ResponderLayout>
                      <Routes>
                        <Route path="/" element={<ResponderDashboard />} />
                        <Route path="/cases" element={<ResponderDashboard />} />
                        <Route path="/cases/:id" element={<CaseDetailPage />} />
                        <Route path="/map" element={<ResponderMapPage />} />
                        <Route path="/matches" element={<MissingMatchesPage />} />
                        <Route path="*" element={<Navigate to="/responder" replace />} />
                      </Routes>
                    </ResponderLayout>
                  }
                />

                {/* 3. ADMIN ANALYTICS PORTAL (Wrapped in ResponderLayout) */}
                <Route
                  path="/admin/*"
                  element={
                    <ResponderLayout>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/analytics" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                      </Routes>
                    </ResponderLayout>
                  }
                />

                {/* 4. MAIN RAKSHAK APPLICATION (Wrapped in PublicLayout with Fixed Left Sidebar) */}
                <Route
                  path="/app/*"
                  element={
                    <PublicLayout>
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/impact" element={<ImpactPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/resources" element={<ResourcesPage />} />
                        <Route path="/trusted-reporter" element={<TrustedReporterPage />} />

                        <Route path="/report" element={<ReportPage />} />
                        <Route path="/report/review" element={<ReportPage />} />
                        <Route path="/report/analysis" element={<ReportPage />} />
                        <Route path="/report/success" element={<ReportPage />} />

                        <Route path="/track" element={<TrackPage />} />
                        <Route path="/track/:caseId" element={<TrackPage />} />

                        <Route path="*" element={<Navigate to="/app" replace />} />
                      </Routes>
                    </PublicLayout>
                  }
                />

                {/* Fallback Direct Link Redirects to /app/* */}
                <Route path="/how-it-works" element={<Navigate to="/app/how-it-works" replace />} />
                <Route path="/impact" element={<Navigate to="/app/impact" replace />} />
                <Route path="/about" element={<Navigate to="/app/about" replace />} />
                <Route path="/resources" element={<Navigate to="/app/resources" replace />} />
                <Route path="/trusted-reporter" element={<Navigate to="/app/trusted-reporter" replace />} />
                <Route path="/report/*" element={<Navigate to="/app/report" replace />} />
                <Route path="/track/*" element={<RedirectTrackRoute />} />

                {/* Fallback Redirect to Landing Entry Page */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </Router>
        </CaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
