import { defineWidgetConfig } from '@medusajs/admin-sdk';

import '../styles/admin-sidebar.css';

const LoginBranding = () => {
  return (
    <style>
      {`
        [class~="bg-ui-bg-subtle"][class~="min-h-dvh"] [class~="m-4"] > [class~="bg-ui-button-neutral"][class~="mb-4"]:first-child {
          display: none !important;
        }
      `}
    </style>
  );
};

export const config = defineWidgetConfig({
  zone: 'login.before',
});

export default LoginBranding;
