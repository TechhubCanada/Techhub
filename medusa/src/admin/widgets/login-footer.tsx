import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Text } from '@medusajs/ui';

const LoginFooter = () => {
  return (
    <div className="mt-3 border-t border-ui-border-base pt-4 text-center">
      <Text size="small" leading="compact" className="text-ui-fg-muted">
        Designed and developed by{' '}
        <a
          href="https://agency.namankataria.com/"
          target="_blank"
          rel="noreferrer"
          className="text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover font-medium outline-none"
        >
          Agency by Naman Kataria
        </a>
      </Text>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: 'login.after',
});

export default LoginFooter;
