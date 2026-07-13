// External packages
import { Text, Heading, Row, Column } from '@react-email/components';
import { CustomerDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

const UnorderedList: React.FC<{
  children?: any;
  className?: string;
}> = ({ children, className }) => {
  return (
    <Row className={['align-top', className].filter(Boolean).join(' ')}>
      <Column className="pl-6">{children}</Column>
    </Row>
  );
};

const UnorderedListItem: React.FC<{
  children?: any;
  className?: string;
  textClassName?: string;
}> = ({ children, className, textClassName }) => {
  return (
    <ul
      role="presentation"
      className={['list-disc mt-0 mb-0 p-0', className]
        .filter(Boolean)
        .join(' ')}
    >
      <li role="listitem" className="m-0 p-0">
        <span className={textClassName}>{children}</span>
      </li>
    </ul>
  );
};

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
};

export default function WelcomeEmail({
  customer,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-10 font-medium">
        Welcome to TechHub!
      </Heading>
      <Text className="text-md !mb-8">
        Welcome to TechHub. Your account is ready for product requests, order
        updates, invoices, and support across computers, accessories, repairs,
        and business technology projects.
      </Text>
      <Text className="text-md font-semibold !mb-8">
        With your account, you can:
      </Text>
      <UnorderedList className="mb-8">
        <UnorderedListItem className="text-md">
          Track TechHub orders and invoices from your account
        </UnorderedListItem>
        <UnorderedListItem className="text-md">
          Request computers, printers, networking gear, parts, and accessories
        </UnorderedListItem>
        <UnorderedListItem className="text-md">
          Coordinate repairs, setup, service, and business technology support
        </UnorderedListItem>
        <UnorderedListItem className="text-md">
          Save products and return to them when you are ready
        </UnorderedListItem>
      </UnorderedList>
      <Text className="text-md">
        Best wishes,
        <br />
        The TechHub Team
      </Text>
    </EmailLayout>
  );
}

WelcomeEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'example@medusa.local',
    first_name: 'John',
    last_name: 'Doe',
  },
} satisfies Props;
