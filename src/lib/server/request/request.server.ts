import "server-only";
import { headers } from "next/headers";
import { serverEnv } from "@/config/env.server";
import { UAParser } from "ua-parser-js";
import type { Activity } from "@/emails/types/templates.types";

interface RequestFromHeadersProps {
  pathname?: string;
}

interface AbsoluteUrlProps {
  pathname?: string;
  req?: Request;
}

const getAbsoluteUrl = async ({
  pathname = "/",
  req,
}: AbsoluteUrlProps = {}) => {
  const h = req?.headers ?? (await headers());
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? serverEnv.APP_HOST;
  const proto = h.get("x-forwarded-proto") ?? serverEnv.PROTOCOL;

  return `${proto}://${host}${pathname}`;
};

const getRequestFromHeaders = async ({
  pathname = "/",
}: RequestFromHeadersProps) => {
  const h = await headers();
  const url = await getAbsoluteUrl({ pathname });

  return new Request(url, { headers: h });
};

const getClientInfo = async () => {
  const h = await headers();

  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    undefined;

  const userAgent = h.get("user-agent") ?? undefined;

  return { ip, userAgent };
};

interface GetSecurityActivityProps {
  req?: Request;
}

const getSecurityActivity = async ({
  req,
}: GetSecurityActivityProps = {}): Promise<Activity> => {
  const h = req?.headers ?? (await headers());
  const userAgent = h.get("user-agent") ?? undefined;
  const { browser, os } = new UAParser(userAgent).getResult();
  const country =
    h.get("x-vercel-ip-country")?.toUpperCase() ??
    h.get("cf-ipcountry")?.toUpperCase() ??
    null;

  return {
    country,
    browser: browser?.name ?? null,
    os: os?.name ?? null,
  };
};

export {
  getRequestFromHeaders,
  getClientInfo,
  getSecurityActivity,
  getAbsoluteUrl,
};
