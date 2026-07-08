// External components
import { Text, Heading, Button } from '@react-email/components';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  email: string;
  resetUrl: string;
  token: string;
};

export default function AuthAdminPasswordResetEmail({
  email,
  resetUrl,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-10 font-medium">
        Reset your admin password
      </Heading>
      <Text className="text-md !mb-10">
        We received a request to reset the password for the admin account{' '}
        {email}. Click below to set a new password:
      </Text>
      <Button
        href={resetUrl}
        className="inline-flex items-center rounded-xs justify-center transition-colors bg-black text-white h-10 px-6 mb-10"
      >
        Reset password
      </Button>
      <Text className="text-md text-grayscale-500 m-0">
        If you didn&apos;t request this change, please ignore this email, and
        your current password will remain unchanged.
      </Text>
    </EmailLayout>
  );
}

AuthAdminPasswordResetEmail.PreviewProps = {
  email: 'admin@techhubcanada.com',
  resetUrl:
    'http://localhost:9000/app/reset-password?token=1234567789012345677890',
  token: '1234567789012345677890',
} satisfies Props;
