import { z } from 'zod';

// Category & Status Enums
export const IncidentCategoryEnum = z.enum([
  'lost_child',
  'unaccompanied_child',
  'trafficking_concern',
  'abuse_concern',
  'other'
]);

export const CaseStatusEnum = z.enum([
  'new',
  'under_review',
  'assigned',
  'escalated',
  'resolved',
  'closed'
]);

export const PriorityLevelEnum = z.enum([
  'low',
  'medium',
  'high',
  'critical'
]);

export const ReportSourceEnum = z.enum([
  'app',
  'whatsapp',
  'web',
  'volunteer'
]);

export const SupportedLanguageEnum = z.enum(['en', 'hi', 'mr']);

export const UserRoleEnum = z.enum(['responder', 'admin', 'superadmin']);

export const ReporterTypeEnum = z.enum(['volunteer', 'transit_worker']);

export const MatchStatusEnum = z.enum([
  'pending_verification',
  'confirmed',
  'rejected'
]);

// Location Schema
export const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  addressText: z.string().min(1).max(500),
  zone: z.string().min(1).max(100)
}).strict();

// Create Report Request Schema
export const CreateReportSchema = z.object({
  category: IncidentCategoryEnum,
  description: z.string().min(3, 'Description must be at least 3 characters').max(3000),
  location: LocationSchema,
  photo: z.string().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  anonymous: z.boolean().default(true),
  reporterId: z.string().nullable().optional(),
  language: SupportedLanguageEnum.default('en'),
  clientReportId: z.string().min(1, 'clientReportId is required for offline sync idempotency'),
  source: ReportSourceEnum.default('web')
}).strict();

// Offline Sync Request Schema
export const SyncReportsSchema = z.object({
  reports: z.array(CreateReportSchema).min(1).max(50)
}).strict();

// Update Case (PATCH /api/cases/:id) Schema
export const UpdateCaseSchema = z.object({
  status: CaseStatusEnum.optional(),
  priority: PriorityLevelEnum.optional(),
  assignedResponderId: z.string().nullable().optional(),
  escalate: z.boolean().optional(),
  internalNote: z.string().min(1).max(2000).optional(),
  timelineNote: z.string().min(1).max(1000).optional()
}).strict();

// Register Community Reporter Schema
export const RegisterReporterSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  type: ReporterTypeEnum,
  zone: z.string().min(1).max(100)
}).strict();

// Quick Report Schema for Community Reporters
export const QuickReportSchema = z.object({
  category: IncidentCategoryEnum,
  description: z.string().min(3).max(3000),
  location: LocationSchema,
  photoUrl: z.string().nullable().optional(),
  clientReportId: z.string().optional()
}).strict();

// Verify Match Schema
export const VerifyMatchSchema = z.object({
  status: z.enum(['confirmed', 'rejected']),
  notes: z.string().max(500).optional()
}).strict();

// Auto-Route Case Schema
export const AutoRouteSchema = z.object({
  preferredZone: z.string().optional()
}).strict();
