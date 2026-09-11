import React, { createContext, useContext, useState, useEffect } from 'react';
import { CaseModel, CaseStatus, ReportInput, UserRole } from '../types';
import { mockBackend } from '../services/mockBackend';

interface CaseContextType {
  cases: CaseModel[];
  activeRole: UserRole['role'];
  setActiveRole: (role: UserRole['role']) => void;
  reportDraft: Partial<ReportInput>;
  updateReportDraft: (update: Partial<ReportInput>) => void;
  clearReportDraft: () => void;
  submitReport: (report: ReportInput) => Promise<CaseModel>;
  updateCaseStatus: (caseId: string, status: CaseStatus, responderName?: string) => void;
  addNoteToCase: (caseId: string, note: string, performer: string) => void;
  getCaseById: (caseId: string) => CaseModel | undefined;
  refreshCases: () => void;
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

  const refreshCases = () => {
    setCases(mockBackend.getCases());
  };

  useEffect(() => {
    refreshCases();
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
    const created = await mockBackend.createReport(report);
    refreshCases();
    clearReportDraft();
    return created;
  };

  const updateCaseStatus = (caseId: string, status: CaseStatus, responderName?: string) => {
    mockBackend.updateStatus(caseId, status, responderName);
    refreshCases();
  };

  const addNoteToCase = (caseId: string, note: string, performer: string) => {
    mockBackend.addInternalNote(caseId, note, performer);
    refreshCases();
  };

  const getCaseById = (caseId: string) => {
    return mockBackend.getCaseById(caseId);
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
