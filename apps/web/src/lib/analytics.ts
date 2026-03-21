import posthog from 'posthog-js';

type EventProperties = Record<string, unknown>;

export function trackEvent(name: string, properties?: EventProperties) {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture(name, properties);
  }
}

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && posthog.__loaded) {
    posthog.capture('$pageview', { $current_url: url });
  }
}

// Pre-defined event helpers for the application funnel
export const analytics = {
  applyButtonClicked: (role: string) =>
    trackEvent('apply_button_clicked', { role }),

  roleCardViewed: (role: string, department: string) =>
    trackEvent('role_card_viewed', { role, department }),

  formStepCompleted: (step: number, role: string) =>
    trackEvent('form_step_completed', { step, role }),

  formStepAbandoned: (step: number, role: string) =>
    trackEvent('form_step_abandoned', { step, role }),

  applicationSubmitted: (role: string, team: string) =>
    trackEvent('application_submitted', { role, team }),

  programViewed: (program: string) =>
    trackEvent('program_viewed', { program }),

  blogPostRead: (slug: string, title: string) =>
    trackEvent('blog_post_read', { slug, title }),
};
