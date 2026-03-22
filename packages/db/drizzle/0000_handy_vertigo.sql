CREATE TYPE "public"."applicant_status" AS ENUM('applied', 'screening', 'assessment', 'interview', 'offer', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."blog_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."email_event_type" AS ENUM('advance', 'reject', 'status_update', 'welcome', 'reminder');--> statement-breakpoint
CREATE TYPE "public"."employee_level" AS ENUM('explorer', 'contributor', 'builder', 'leader');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('open', 'closed', 'draft');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('full-time', 'part-time', 'contract', 'internship');--> statement-breakpoint
CREATE TABLE "applicants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(50),
	"role_slug" varchar(100) NOT NULL,
	"team_interest" varchar(50),
	"cv_url" text,
	"linkedin_url" text,
	"portfolio_url" text,
	"github_url" text,
	"answers" jsonb,
	"skills" jsonb,
	"availability" varchar(50),
	"challenge_response" text,
	"status" "applicant_status" DEFAULT 'applied' NOT NULL,
	"score" integer,
	"reviewer_notes" text,
	"pdpl_consent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"author" varchar(255) NOT NULL,
	"category" varchar(100),
	"seo_title" varchar(255),
	"seo_description" text,
	"og_image" text,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" uuid NOT NULL,
	"type" "email_event_type" NOT NULL,
	"subject" varchar(500),
	"resend_message_id" varchar(255),
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(100) NOT NULL,
	"department" varchar(100) NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"level" "employee_level" DEFAULT 'explorer' NOT NULL,
	"badges" jsonb DEFAULT '[]'::jsonb,
	"points" integer DEFAULT 0 NOT NULL,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "interview_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" uuid NOT NULL,
	"calcom_event_id" varchar(255),
	"scheduled_at" timestamp with time zone NOT NULL,
	"duration" integer DEFAULT 45 NOT NULL,
	"interviewer_name" varchar(255),
	"meeting_url" text,
	"notes" text,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"department" varchar(100) NOT NULL,
	"type" "job_type" NOT NULL,
	"location" varchar(255) NOT NULL,
	"salary_range" varchar(100),
	"description" text NOT NULL,
	"requirements" jsonb,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "job_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "job_listings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_slots" ADD CONSTRAINT "interview_slots_applicant_id_applicants_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applicant_email_idx" ON "applicants" USING btree ("email");--> statement-breakpoint
CREATE INDEX "applicant_status_idx" ON "applicants" USING btree ("status");--> statement-breakpoint
CREATE INDEX "applicant_role_idx" ON "applicants" USING btree ("role_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "applicant_email_role_idx" ON "applicants" USING btree ("email","role_slug");--> statement-breakpoint
CREATE INDEX "applicant_status_created_idx" ON "applicants" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "blog_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_status_idx" ON "blog_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contact_email_idx" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_applicant_idx" ON "email_events" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "email_type_idx" ON "email_events" USING btree ("type");--> statement-breakpoint
CREATE INDEX "employee_clerk_idx" ON "employees" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "employee_dept_idx" ON "employees" USING btree ("department");--> statement-breakpoint
CREATE UNIQUE INDEX "employee_email_idx" ON "employees" USING btree ("email");--> statement-breakpoint
CREATE INDEX "interview_applicant_idx" ON "interview_slots" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "interview_schedule_idx" ON "interview_slots" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "job_slug_idx" ON "job_listings" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "job_status_idx" ON "job_listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_dept_idx" ON "job_listings" USING btree ("department");