import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import {
  applicantVouches,
  applicants,
  blogPosts,
  emailEvents,
  employees,
  interviewSlots,
  jobListings,
  salarySubmissions,
} from './schema';

/* ─── Applicants ─── */

export const insertApplicantSchema = createInsertSchema(applicants);
export const selectApplicantSchema = createSelectSchema(applicants);
export type InsertApplicant = typeof applicants.$inferInsert;
export type SelectApplicant = typeof applicants.$inferSelect;

/* ─── Job Listings ─── */

export const insertJobListingSchema = createInsertSchema(jobListings);
export const selectJobListingSchema = createSelectSchema(jobListings);
export type InsertJobListing = typeof jobListings.$inferInsert;
export type SelectJobListing = typeof jobListings.$inferSelect;

/* ─── Blog Posts ─── */

export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const selectBlogPostSchema = createSelectSchema(blogPosts);
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type SelectBlogPost = typeof blogPosts.$inferSelect;

/* ─── Employees ─── */

export const insertEmployeeSchema = createInsertSchema(employees);
export const selectEmployeeSchema = createSelectSchema(employees);
export type InsertEmployee = typeof employees.$inferInsert;
export type SelectEmployee = typeof employees.$inferSelect;

/* ─── Interview Slots ─── */

export const insertInterviewSlotSchema = createInsertSchema(interviewSlots);
export const selectInterviewSlotSchema = createSelectSchema(interviewSlots);
export type InsertInterviewSlot = typeof interviewSlots.$inferInsert;
export type SelectInterviewSlot = typeof interviewSlots.$inferSelect;

/* ─── Email Events ─── */

export const insertEmailEventSchema = createInsertSchema(emailEvents);
export const selectEmailEventSchema = createSelectSchema(emailEvents);
export type InsertEmailEvent = typeof emailEvents.$inferInsert;
export type SelectEmailEvent = typeof emailEvents.$inferSelect;

/* ─── Contacts ─── */

export const insertContactSchema = createInsertSchema(contacts);
export const selectContactSchema = createSelectSchema(contacts);
export type InsertContact = typeof contacts.$inferInsert;
export type SelectContact = typeof contacts.$inferSelect;

/* ─── Applicant Vouches ─── */

export const insertApplicantVouchSchema = createInsertSchema(applicantVouches);
export const selectApplicantVouchSchema = createSelectSchema(applicantVouches);
export type InsertApplicantVouch = typeof applicantVouches.$inferInsert;
export type SelectApplicantVouch = typeof applicantVouches.$inferSelect;

/* ─── Salary Submissions ─── */

export const insertSalarySubmissionSchema = createInsertSchema(salarySubmissions);
export const selectSalarySubmissionSchema = createSelectSchema(salarySubmissions);
export type InsertSalarySubmission = typeof salarySubmissions.$inferInsert;
export type SelectSalarySubmission = typeof salarySubmissions.$inferSelect;
