-- STE-19: Create pg_cron job for PDPL compliance
-- This deletes applicant records older than 12 months to comply with Jordan PDPL

-- Enable pg_cron extension if not already enabled (Requires superuser/admin rights on Neon)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the job to run every day at midnight
SELECT cron.schedule(
    'delete_old_applicants_pdpl',
    '0 0 * * *',
    $$ DELETE FROM applicants WHERE "created_at" < NOW() - INTERVAL '12 months' $$
);
