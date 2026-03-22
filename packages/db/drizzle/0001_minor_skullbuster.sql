CREATE TABLE "applicant_vouches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_applicant_id" uuid NOT NULL,
	"vouched_email" varchar(255) NOT NULL,
	"vouch_code" varchar(50) NOT NULL,
	"claimed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "applicant_vouches_vouch_code_unique" UNIQUE("vouch_code")
);
--> statement-breakpoint
CREATE TABLE "salary_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"country" varchar(100) NOT NULL,
	"city" varchar(100),
	"years_of_experience" integer NOT NULL,
	"base_salary_usd" integer NOT NULL,
	"equity_value_usd" integer DEFAULT 0,
	"is_remote" boolean DEFAULT false NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicant_vouches" ADD CONSTRAINT "applicant_vouches_referrer_applicant_id_applicants_id_fk" FOREIGN KEY ("referrer_applicant_id") REFERENCES "public"."applicants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vouch_code_idx" ON "applicant_vouches" USING btree ("vouch_code");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_vouch_email_idx" ON "applicant_vouches" USING btree ("referrer_applicant_id","vouched_email");--> statement-breakpoint
CREATE INDEX "salary_title_country_idx" ON "salary_submissions" USING btree ("job_title","country");--> statement-breakpoint
CREATE INDEX "salary_verified_idx" ON "salary_submissions" USING btree ("verified");