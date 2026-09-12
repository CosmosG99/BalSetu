import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DemoProvider } from './context/DemoContext';
import { CaseProvider } from './context/CaseContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';

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

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CaseProvider>
          <DemoProvider>
            <Router>
              <Routes>
                
                {/* Responder Command Center Portal (Wrapped in ResponderLayout with Left Sidebar) */}
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

                {/* Admin Analytics (Wrapped in ResponderLayout) */}
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

                {/* Public Website & Citizen App (Standard Header & Footer) */}
                <Route
                  path="/*"
                  element={
                    <div className="min-h-screen flex flex-col bg-ivory-100 dark:bg-charcoal-950 text-charcoal-800 dark:text-ivory-100 font-sans selection:bg-forest-900/20 selection:text-forest-900 dark:selection:text-white transition-colors duration-300">
                      <OfflineBanner />
                      <Header />
                      
                      <main className="flex-1">
                        <Routes>
                          {/* Public Marketing Website Routes */}
                          <Route path="/" element={<LandingPage />} />
                          <Route path="/how-it-works" element={<HowItWorksPage />} />
                          <Route path="/impact" element={<ImpactPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/resources" element={<ResourcesPage />} />
                          <Route path="/trusted-reporter" element={<TrustedReporterPage />} />

                          {/* Citizen Reporting App Routes */}
                          <Route path="/report" element={<ReportPage />} />
                          <Route path="/report/review" element={<ReportPage />} />
                          <Route path="/report/analysis" element={<ReportPage />} />
                          <Route path="/report/success" element={<ReportPage />} />

                          {/* Citizen Case Tracking */}
                          <Route path="/track" element={<TrackPage />} />
                          <Route path="/track/:caseId" element={<TrackPage />} />

                          {/* Fallback Redirect */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </main>

                      <Footer />
                    </div>
                  }
                />

              </Routes>
            </Router>
          </DemoProvider>
        </CaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
