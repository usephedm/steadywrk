import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ApplicationConfirmationProps {
  name: string;
  role: string;
}

export function ApplicationConfirmation({ name, role }: ApplicationConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for applying to STEADYWRK — we received your application for {role}.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://steadywrk.app/logo.webp"
              width="140"
              height="32"
              alt="STEADYWRK"
              style={logo}
            />
          </Section>

          <Heading style={heading}>Thank you for applying, {name}</Heading>

          <Text style={paragraph}>
            We received your application for <strong>{role}</strong>. Our team is excited to review
            your profile and learn more about you.
          </Text>

          <Hr style={divider} />

          <Heading as="h2" style={subheading}>
            What happens next
          </Heading>

          <Section style={timeline}>
            <div style={timelineItem}>
              <Text style={timelineStep}>1</Text>
              <div>
                <Text style={timelineTitle}>Application Review</Text>
                <Text style={timelineDesc}>Our team reviews your application within 48 hours.</Text>
              </div>
            </div>
            <div style={timelineItem}>
              <Text style={timelineStep}>2</Text>
              <div>
                <Text style={timelineTitle}>Skills Assessment</Text>
                <Text style={timelineDesc}>
                  A short, role-specific challenge to showcase your strengths.
                </Text>
              </div>
            </div>
            <div style={timelineItem}>
              <Text style={timelineStep}>3</Text>
              <div>
                <Text style={timelineTitle}>Interview</Text>
                <Text style={timelineDesc}>
                  A structured conversation with the team — no surprises.
                </Text>
              </div>
            </div>
            <div style={timelineItem}>
              <Text style={timelineStep}>4</Text>
              <div>
                <Text style={timelineTitle}>Decision</Text>
                <Text style={timelineDesc}>
                  We commit to a decision within 14 days of your application.
                </Text>
              </div>
            </div>
          </Section>

          <Hr style={divider} />

          <Text style={footer}>
            Questions? Reply to this email or reach us at hello@steadywrk.app.
          </Text>
          <Text style={footerMuted}>
            STEADYWRK LLC · Amman, Jordan · steadywrk.app
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: '#FAFAF8',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 24px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  display: 'inline-block',
};

const heading = {
  color: '#23211D',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 16px',
};

const subheading = {
  color: '#23211D',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 20px',
};

const paragraph = {
  color: '#23211D',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const divider = {
  borderTop: '1px solid #E5E5E2',
  margin: '24px 0',
};

const timeline = {
  margin: '0 0 8px',
};

const timelineItem = {
  display: 'flex' as const,
  gap: '16px',
  marginBottom: '20px',
};

const timelineStep = {
  backgroundColor: '#E58A0F',
  color: '#FFFFFF',
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'center' as const,
  lineHeight: '28px',
  flexShrink: 0,
  margin: '0',
};

const timelineTitle = {
  color: '#23211D',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 2px',
};

const timelineDesc = {
  color: '#6E695F',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const footer = {
  color: '#6E695F',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 4px',
};

const footerMuted = {
  color: '#B0B0AB',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
};

export default ApplicationConfirmation;
