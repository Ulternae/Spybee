const COOKIE_KEYS = {
  NEXT_LOCALE: "NEXT_LOCALE",
  ACTIVE_PROJECT_ID: "SPYBEE_ACTIVE_PROJECT_ID",
} as const

interface GetCookieParams {
  req?: Request;
  key: (typeof COOKIE_KEYS)[keyof typeof COOKIE_KEYS];
}

const getCookie = ({ req, key }: GetCookieParams) => {
  const cookie = req?.headers.get("cookie")
  if (!cookie) return null

  return (
    cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(`${key}=`))
      ?.split("=")[1]
  )
}

export { COOKIE_KEYS, getCookie }
