import { APIError } from "better-auth";

const GENERIC_ERROR_CODE = "GENERIC_ERROR";

const extractErrorCode = (error: unknown): string => {
  if (error instanceof APIError) {
    return error.body?.code ?? GENERIC_ERROR_CODE;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const clientError = error as {
      code?: unknown;
      message?: unknown;
    };

    if (typeof clientError.code === "string") {
      return clientError.code;
    }

    if (typeof clientError.message === "string") {
      return clientError.message;
    }
  }

  return GENERIC_ERROR_CODE;
};

export { extractErrorCode, GENERIC_ERROR_CODE };
