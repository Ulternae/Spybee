import { serverEnv } from "@/config/env.server";
import { Resend } from "resend";

export const resend = new Resend(serverEnv.RESEND_API_KEY);
