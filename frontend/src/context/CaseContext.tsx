import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseModel, CaseStatus, ReportInput, UserRole } from '../types';
import * as caseApi from '../api/cases';

interface CaseContextType {
  cases: CaseModel[];
  activeRole: UserRole['role'];
  setActiveRole: (role: UserRole['role']) => void;
  reportDraft: Partial<ReportInput>;
  updateReportDraft: (update: Partial<ReportInput>) => void;
  clearReportDraft: () => void;
  submitReport: (report: ReportInput) => Promise<CaseModel>;
  updateCaseStatus: (caseId: string, status: CaseStatus, responderName?: string) => Promise<void>;
  addNoteToCase: (caseId: string, note: string, performer: string) => Promise<void>;
  getCaseById: (caseId: string) => CaseModel | undefined;
  refreshCases: () => Promise<void>;
  apiError: string | null;
  isOffline: boolean;
  savedOfflineDraft: boolean;
  saveOfflineDraft: () => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<CaseModel[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole['role']>('CITIZEN');
  const [reportDraft, setReportDraft] = useState<Partial<ReportInput>>({
    incidentTypes: [],
    location: '',
    locationType: 'RAILWAY_STATION',
    description: '',
    isAnonymous: true,
    isBlurred: true
  });
  const [isOffline, setIsOffline] = useState(false);
  const [savedOfflineDraft, setSavedOfflineDraft] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const refreshCases = async () => {
    try {
      setCases(await caseApi.listCases());
      setApiError(null);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to load cases.');
    }
  };

  useEffect(() => {
    void refreshCases();
  }, []);

  const updateReportDraft = (update: Partial<ReportInput>) => {
    setReportDraft((prev) => ({ ...prev, ...update }));
  };

  const clearReportDraft = () => {
    setReportDraft({
      incidentTypes: [],
      location: '',
      locationType: 'RAILWAY_STATION',
      description: '',
      isAnonymous: true,
      isBlurred: true
    });
    setSavedOfflineDraft(false);
  };

  const submitReport = async (report: ReportInput): Promise<CaseModel> => {
    const created = await caseApi.createReport(report);
    await refreshCases();
    clearReportDraft();
    return created;
  };

  const updateCaseStatus = async (caseId: string, status: CaseStatus, responderName?: string) => {
    const updated = await caseApi.updateCase(caseId, status);
    setCases((previous) => previous.map((item) => item.id === updated.id ? updated : item));
  };

  const addNoteToCase = async (caseId: string, note: string, performer: string) => {
    const updated = await caseApi.updateCase(caseId, undefined, note);
    setCases((previous) => previous.map((item) => item.id === updated.id ? updated : item));
  };

  const getCaseById = (caseId: string) => {
    return cases.find((item) => item.id.toUpperCase() === caseId.trim().toUpperCase());
  };

  const saveOfflineDraft = () => {
    localStorage.setItem('rakshak_offline_draft', JSON.stringify(reportDraft));
    setSavedOfflineDraft(true);
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        activeRole,
        setActiveRole,
        reportDraft,
        updateReportDraft,
        clearReportDraft,
        submitReport,
        updateCaseStatus,
        addNoteToCase,
        getCaseById,
        refreshCases,
        apiError,
        isOffline,
        savedOfflineDraft,
        saveOfflineDraft
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCases = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within CaseProvider');
  }
  return context;
};
