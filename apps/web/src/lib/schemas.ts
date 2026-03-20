// Validation helpers — no Zod dependency, pure runtime checks

export function validateEmail(email: unknown): string | null {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@') || trimmed.length < 5) return null;
  return trimmed;
}

export function validateRequired(value: unknown, field: string): string {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

export interface ApplyPayload {
  name: string;
  email: string;
  position: string;
  resumeUrl: string;
  message: string;
}

export function validateApplyPayload(body: Record<string, unknown>): ApplyPayload {
  const name = validateRequired(body.name, 'Name');
  const email = validateEmail(body.email);
  if (!email) throw new Error('Invalid email');
  const position = validateRequired(body.position, 'Position');
  const resumeUrl = typeof body.resumeUrl === 'string' ? body.resumeUrl.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  return { name, email, position, resumeUrl, message };
}

export interface ContactPayload {
  company: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function validateContactPayload(body: Record<string, unknown>): ContactPayload {
  const name = validateRequired(body.name, 'Name');
  const email = validateEmail(body.email);
  if (!email) throw new Error('Invalid email');
  const subject = validateRequired(body.subject, 'Subject');
  const message = validateRequired(body.message, 'Message');
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  return { company, name, email, subject, message };
}
