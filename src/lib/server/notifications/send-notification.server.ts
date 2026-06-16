"use server"

import type { NotificationType } from "./notification.types";
import { NOTIFICATION_REGISTRY } from "./notification.registry";
import { getRequestFromHeaders } from "../request/request.server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

interface SendNotificationParams {
  type: NotificationType;
  req?: Request;
}

interface SendNotificationResponse {
  send: boolean;
  reason?: string;
}

const sendNotification = async ({ type, req }: SendNotificationParams): Promise<SendNotificationResponse> => {
  const policy = NOTIFICATION_REGISTRY[type];
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) {
    return { send: false, reason: "UNAUTHORIZED" }
  }

  if (!policy) {
    return { send: false, reason: "UNKNOWN_TYPE" }
  }

  const request = req ?? await getRequestFromHeaders({ pathname: "/" })

  await policy.send({ user: session.user, req: request })

  return { send: true };
}

export { sendNotification }