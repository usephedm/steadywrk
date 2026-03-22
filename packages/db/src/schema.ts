import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  uuid,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

/* ─── Enums ─── */

export const applicantStatusEnum = pgEnum('applicant_status', [
  'applied',
  'screening',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
]);

export const employeeLevelEnum = pgEnum('employee_level', [
  'explorer',
  'contributor',
  'builder',
  'leader',
]);

export const jobStatusEnum = pgEnum('job_status', ['open', 'closed', 'draft']);

export const jobTypeEnum = pgEnum('job_type', [
  'full-time',
  'part-time',
  'contract',
  'internship',
]);

export const blogStatusEnum = pgEnum('blog_status', [
  'draft',
  'published',
  'archived',
]);

export const emailEventTypeEnum = pgEnum('email_event_type', [
  'advance',
  'reject',
  'status_update',
  'welcome',
  'reminder',
]);

/* ─── Tables ─── */

export const applicants = pgTable(
  'applicants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 50 }),
    roleSlug: varchar('role_slug', { length: 100 }).notNull(),
    teamInterest: varchar('team_interest', { length: 50 }),
    cvUrl: text('cv_url'),
    linkedinUrl: text('linkedin_url'),
    portfolioUrl: text('portfolio_url'),
    githubUrl: text('github_url'),
    answers: jsonb('answers').$type<{
      q1: string;
      q2: string;
      q3: string;
    }>(),
    skills: jsonb('skills').$type<Record<string, number>>(),
    availability: varchar('availability', { length: 50 }),
    challengeResponse: text('challenge_response'),
    status: applicantStatusEnum('status').default('applied').notNull(),
    score: integer('score'),
    reviewerNotes: text('reviewer_notes'),
    pdplConsent: boolean('pdpl_consent').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('applicant_email_idx').on(table.email),
    index('applicant_status_idx').on(table.status),
    index('applicant_role_idx').on(table.roleSlug),
    uniqueIndex('applicant_email_role_idx').on(table.email, table.roleSlug),
    index('applicant_status_created_idx').on(table.status, table.createdAt),
  ],
);

export const jobListings = pgTable(
  'job_listings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    department: varchar('department', { length: 100 }).notNull(),
    type: jobTypeEnum('type').notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    salaryRange: varchar('salary_range', { length: 100 }),
    description: text('description').notNull(),
    requirements: jsonb('requirements').$type<string[]>(),
    featured: boolean('featured').default(false).notNull(),
    status: jobStatusEnum('status').default('open').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('job_slug_idx').on(table.slug),
    index('job_status_idx').on(table.status),
    index('job_dept_idx').on(table.department),
  ],
);

export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 500 }).notNull().unique(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    author: varchar('author', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    ogImage: text('og_image'),
    status: blogStatusEnum('status').default('draft').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('blog_slug_idx').on(table.slug),
    index('blog_status_idx').on(table.status),
  ],
);

export const employees = pgTable(
  'employees',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    role: varchar('role', { length: 100 }).notNull(),
    department: varchar('department', { length: 100 }).notNull(),
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    level: employeeLevelEnum('level').default('explorer').notNull(),
    badges: jsonb('badges').$type<string[]>().default([]),
    points: integer('points').default(0).notNull(),
    streakDays: integer('streak_days').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('employee_clerk_idx').on(table.clerkUserId),
    index('employee_dept_idx').on(table.department),
    uniqueIndex('employee_email_idx').on(table.email),
  ],
);

export const interviewSlots = pgTable(
  'interview_slots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicantId: uuid('applicant_id')
      .notNull()
      .references(() => applicants.id, { onDelete: 'cascade' }),
    calcomEventId: varchar('calcom_event_id', { length: 255 }),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    duration: integer('duration').default(45).notNull(),
    interviewerName: varchar('interviewer_name', { length: 255 }),
    meetingUrl: text('meeting_url'),
    notes: text('notes'),
    completed: boolean('completed').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('interview_applicant_idx').on(table.applicantId),
    index('interview_schedule_idx').on(table.scheduledAt),
  ],
);

export const emailEvents = pgTable(
  'email_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicantId: uuid('applicant_id')
      .notNull()
      .references(() => applicants.id, { onDelete: 'cascade' }),
    type: emailEventTypeEnum('type').notNull(),
    subject: varchar('subject', { length: 500 }),
    resendMessageId: varchar('resend_message_id', { length: 255 }),
    sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  },
  (table) => [
    index('email_applicant_idx').on(table.applicantId),
    index('email_type_idx').on(table.type),
  ],
);

export const waitlist = pgTable(
  'waitlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('waitlist_email_idx').on(table.email),
  ],
);

export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    company: varchar('company', { length: 255 }),
    message: text('message').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('contact_email_idx').on(table.email),
  ],
);
