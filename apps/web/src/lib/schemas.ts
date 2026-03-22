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
  const name = validateRequired(body.name, 'Name');
  const email = validateEmail(body.email);
  if (!email) throw new Error('Invalid email');
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const position = validateRequired(body.position, 'Position');
  const team = typeof body.team === 'string' ? body.team.trim() : '';
  const vouchCode = typeof body.vouchCode === 'string' ? body.vouchCode.trim() : undefined;

  if (body.pdplConsent !== true) {
    throw new Error('PDPL consent is required');
  }

  const rawAnswers = body.answers as Record<string, unknown> | undefined;
  const answers = {
    q1: typeof rawAnswers?.q1 === 'string' ? rawAnswers.q1.trim() : '',
    q2: typeof rawAnswers?.q2 === 'string' ? rawAnswers.q2.trim() : '',
    q3: typeof rawAnswers?.q3 === 'string' ? rawAnswers.q3.trim() : '',
  };

  const portfolioUrl = typeof body.portfolioUrl === 'string' ? body.portfolioUrl.trim() : '';
  const githubUrl = typeof body.githubUrl === 'string' ? body.githubUrl.trim() : '';
  const behanceUrl = typeof body.behanceUrl === 'string' ? body.behanceUrl.trim() : '';
  const skills = (
    typeof body.skills === 'object' && body.skills !== null ? body.skills : {}
  ) as Record<string, number>;
  const availability = typeof body.availability === 'string' ? body.availability.trim() : '';
  const challengeResponse =
    typeof body.challengeResponse === 'string' ? body.challengeResponse.trim() : '';

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
  const name = validateRequired(body.name, 'Name');
  const email = validateEmail(body.email);
  if (!email) throw new Error('Invalid email');
  const subject = validateRequired(body.subject, 'Subject');
  const message = validateRequired(body.message, 'Message');
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  return { company, name, email, subject, message };
}
