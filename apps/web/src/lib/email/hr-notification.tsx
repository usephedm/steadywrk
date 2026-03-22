import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';

interface HRNotificationProps {
  name: string;
  email: string;
  phone: string;
  role: string;
  team: string;
}

export function HRNotification({ name, email, phone, role, team }: HRNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New application: {name} for {role}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={badge}>NEW APPLICATION</Text>

          <Heading style={heading}>
            {name} for {role}
          </Heading>

          <Section style={summaryCard}>
            <Row>
              <Column style={labelCol}>Name</Column>
              <Column style={valueCol}>{name}</Column>
            </Row>
            <Row>
              <Column style={labelCol}>Email</Column>
              <Column style={valueCol}>{email}</Column>
            </Row>
            <Row>
              <Column style={labelCol}>Phone</Column>
              <Column style={valueCol}>{phone}</Column>
            </Row>
            <Row>
              <Column style={labelCol}>Role</Column>
              <Column style={valueCol}>{role}</Column>
            </Row>
            <Row>
              <Column style={labelCol}>Team Interest</Column>
              <Column style={valueCol}>{team}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          <Section style={buttonSection}>
            <Button
              style={advanceButton}
              href={`mailto:hello@steadywrk.app?subject=ADVANCE: ${name} - ${role}&body=ADVANCE`}
            >
              ADVANCE
            </Button>
            <Button
              style={rejectButton}
              href={`mailto:hello@steadywrk.app?subject=REJECT: ${name} - ${role}&body=REJECT`}
            >
              REJECT
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={footer}>
            Reply ADVANCE or REJECT to this email, or use the buttons above.
          </Text>
          <Text style={footerMuted}>
            STEADYWRK Hiring Pipeline · steadywrk.app/dashboard/hiring
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

const badge = {
  backgroundColor: '#FFF4E6',
  color: '#E58A0F',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  padding: '4px 12px',
  borderRadius: '9999px',
  display: 'inline-block',
  margin: '0 0 16px',
};

const heading = {
  color: '#23211D',
  fontSize: '22px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px',
};

const summaryCard = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E5E2',
  borderRadius: '12px',
  padding: '20px 24px',
};

const labelCol = {
  color: '#6E695F',
  fontSize: '13px',
  fontWeight: '500',
  padding: '6px 0',
  width: '120px',
  verticalAlign: 'top' as const,
};

const valueCol = {
  color: '#23211D',
  fontSize: '14px',
  fontWeight: '500',
  padding: '6px 0',
  verticalAlign: 'top' as const,
};

const divider = {
  borderTop: '1px solid #E5E5E2',
  margin: '24px 0',
};

const buttonSection = {
  textAlign: 'center' as const,
};

const advanceButton = {
  backgroundColor: '#4D7A3A',
  color: '#FFFFFF',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  padding: '12px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
  marginRight: '12px',
};

const rejectButton = {
  backgroundColor: '#A03D4A',
  color: '#FFFFFF',
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  padding: '12px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-block',
};

const footer = {
  color: '#6E695F',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 4px',
  textAlign: 'center' as const,
};

const footerMuted = {
  color: '#B0B0AB',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'center' as const,
};

export default HRNotification;
