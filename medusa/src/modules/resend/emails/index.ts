import AuthAdminPasswordResetEmail from "./auth-admin-password-reset";
import AuthEmailConfirm from "./auth-email-confirm";
import AuthPasswordForgotResetEmail from "./auth-forgot-password";
import AuthPasswordResetEmail from "./auth-password-reset";
import OrderPlacedEmail from "./order-placed";
import OrderUpdateEmail from "./order-update";
import WelcomeEmail from "./welcome";

// TODO: we should be able to use notification data in subjects too
export const subjects = {
  "auth-admin-password-reset": "Reset your admin password",
  "auth-password-reset": "Reset your password",
  "auth-email-confirm": "Verify your email",
  "order-placed": "Your order has been placed",
  "order-update": "Your order has been updated",
  "customer-welcome": "Welcome to TechHub!",
  "auth-forgot-password": "Reset your password",
};

export default {
  "auth-admin-password-reset": AuthAdminPasswordResetEmail,
  "auth-password-reset": AuthPasswordResetEmail,
  "auth-email-confirm": AuthEmailConfirm,
  "order-placed": OrderPlacedEmail,
  "order-update": OrderUpdateEmail,
  "customer-welcome": WelcomeEmail,
  "auth-forgot-password": AuthPasswordForgotResetEmail,
};
