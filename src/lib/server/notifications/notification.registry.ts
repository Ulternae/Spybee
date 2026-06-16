import { User } from "better-auth/client";
import { NOTIFICATION_TYPE as NT, type NotificationType, NotificationTopic, NOTIFICATION_TOPIC } from "./notification.types";
import { securityEmailService } from "@/emails/services/security-email.service";

type NotificationRegistry = Record<NotificationType, {
  topic: NotificationTopic;
  defaultEnabled: boolean;
  mandatory: boolean; // If it is true, it voids any rule
  send: (p: { user: User; req?: Request }) => Promise<void>;
}>

export const NOTIFICATION_REGISTRY: NotificationRegistry = {
  [NT.PASSWORD_CHANGED]: {
    topic: NOTIFICATION_TOPIC.SECURITY_ALERTS,
    defaultEnabled: true,
    mandatory: false,
    send: ({ user, req }) => securityEmailService.sendPasswordChangedEmail({ user, req })
  },
  [NT.TWO_FACTOR_ENABLED]: {
    topic: NOTIFICATION_TOPIC.SECURITY_ALERTS,
    defaultEnabled: true,
    mandatory: false,
    send: ({ user, req }) => securityEmailService.sendTwoFactorEnabledEmail({ user, req })

  },
  [NT.BACKUP_CODES_REGENERATED]: {
    topic: NOTIFICATION_TOPIC.SECURITY_ALERTS,
    defaultEnabled: true,
    mandatory: false,
    send: ({ user, req }) => securityEmailService.sendBackupCodesRegeneratedEmail({ user, req })
  },
  [NT.TWO_FACTOR_DISABLED]: {
    topic: NOTIFICATION_TOPIC.SECURITY_ALERTS,
    defaultEnabled: true,
    mandatory: false,
    send: ({ user, req }) => securityEmailService.sendTwoFactorDisabledEmail({ user, req })
  },
}