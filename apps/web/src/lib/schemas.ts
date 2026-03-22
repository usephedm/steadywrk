export function validateEmail(email: unknown): string | null {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@') || trimmed.length < 5 || trimmed.length > 255) return null;
  return trimmed;
}

export function validateRequired(value: unknown, field: string, maxLength = 255): string {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`${field} is too long`);
  }

  return trimmed;
}

function validateOptionalText(value: unknown, field: string, maxLength: number): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new Error(`${field} is invalid`);

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`${field} is too long`);
  }

  return trimmed;
}

function validateOptionalUrl(value: unknown, field: string): string {
  const trimmed = validateOptionalText(value, field, 2048);
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Unsupported protocol');
    }
    return url.toString();
  } catch {
    throw new Error(`${field} must be a valid URL`);
  }
}

function validateSkills(value: unknown): Record<string, number> {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Skills are invalid');
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > 24) {
    throw new Error('Too many skills submitted');
  }

  return Object.fromEntries(
    entries.map(([key, rawValue]) => {
      const name = key.trim();
      const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue);

      if (!name || name.length > 80 || !Number.isFinite(numericValue)) {
        throw new Error('Skills are invalid');
      }

      if (numericValue < 0 || numericValue > 10) {
        throw new Error('Skill ratings must be between 0 and 10');
      }

      return [name, numericValue];
    }),
  );
}

function validateAnswers(value: unknown) {
  if (value === undefined || value === null) {
    return { q1: '', q2: '', q3: '' };
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Application answers are invalid');
  }

  const answers = value as Record<string, unknown>;
  return {
    q1: validateOptionalText(answers.q1, 'Answer 1', 900),
    q2: validateOptionalText(answers.q2, 'Answer 2', 900),
    q3: validateOptionalText(answers.q3, 'Answer 3', 900),
  };
}

export interface ApplyPayload {
  name: string;
  email: string;
  phone: string;
  position: string;
  team: string;
  pdplConsent: true;
  answers: {
    q1: string;
    q2: string;
    q3: string;
  };
  portfolioUrl: string;
  githubUrl: string;
  behanceUrl: string;
  skills: Record<string, number>;
  availability: string;
  challengeResponse: string;
  vouchCode?: string;
}

export function validateApplyPayload(body: Record<string, unknown>): ApplyPayload {
  const name = validateRequired(body.name, 'Name', 255);
  const email = validateEmail(body.email);
  if (!email) throw new Error('Invalid email');
  const phone = validateOptionalText(body.phone, 'Phone', 50);
  const position = validateRequired(body.position, 'Position', 100);
  const team = validateOptionalText(body.team, 'Team', 50);
  const vouchCode = typeof body.vouchCode === 'string' ? body.vouchCode.trim() : undefined;

  if (body.pdplConsent !== true) {
    throw new Error('PDPL consent is required');
  }

  const answers = validateAnswers(body.answers);
  const portfolioUrl = validateOptionalUrl(body.portfolioUrl, 'Portfolio URL');
  const githubUrl = validateOptionalUrl(body.githubUrl, 'GitHub URL');
  const behanceUrl = validateOptionalUrl(body.behanceUrl, 'Behance / Dribbble URL');
  const skills = validateSkills(body.skills);
  const availability = validateOptionalText(body.availability, 'Availability', 50);
  const challengeResponse = validateOptionalText(
    body.challengeResponse,
    'Challenge response',
    4000,
  );

  return {
    name,
    email,
    phone,
    position,
    team,
    pdplConsent: true,
    answers,
    portfolioUrl,
    githubUrl,
    behanceUrl,
    skills,
    availability,
    challengeResponse,
    vouchCode,
  };
}

export interface ContactPayload {
  company: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function validateContactPayload(body: Record<string, unknown>): ContactPayload {
  const name = validateRequired(body.name, 'Name', 255);
  const email = validateEmail(body.email);
  if (!email) throw new Error('Invalid email');
  const subject = validateRequired(body.subject, 'Subject', 200);
  const message = validateRequired(body.message, 'Message', 4000);
  const company = validateOptionalText(body.company, 'Company', 255);
  return { company, name, email, subject, message };
}
