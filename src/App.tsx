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

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CaseProvider>
          <DemoProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-purple/30 selection:text-slate-900 dark:selection:text-white transition-colors duration-300">
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

                    {/* Responder Command Center Portal */}
                    <Route path="/responder" element={<ResponderDashboard />} />
                    <Route path="/responder/cases" element={<ResponderDashboard />} />
                    <Route path="/responder/cases/:id" element={<CaseDetailPage />} />
                    <Route path="/responder/map" element={<ResponderMapPage />} />
                    <Route path="/responder/matches" element={<MissingMatchesPage />} />

                    {/* Admin Analytics */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/analytics" element={<AdminDashboard />} />

                    {/* Fallback Redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </Router>
          </DemoProvider>
        </CaseProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
