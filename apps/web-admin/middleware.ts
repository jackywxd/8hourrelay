import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authentication } from "next-firebase-auth-edge/lib/next/middleware";
import { authConfig } from "./config/server-config";
import { getFirebaseAuth } from "next-firebase-auth-edge/lib/auth";

const PUBLIC_PATHS = [
  "/register",
  "/login",
  "/reset-password",
  // "/api/get-users",
  // "/api/get-teams",
  // "/api/get-race-entries",
  // "/api/get-free-entries",
];

const ADMIN_USERS = [
  "admin@heidi.cloud",
  "jackywxd@gmail.com",
  "jimlao@gmail.com",
];

const { setCustomUserClaims } = getFirebaseAuth(
  authConfig.serviceAccount,
  authConfig.apiKey
);

function redirectToHome(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectToUnAuthorized(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/unauthorized";
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectToLogin(request: NextRequest) {
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  console.log(`[middleware] ${request.nextUrl.pathname}`);
  const result = await authentication(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }) => {
      if (
        decodedToken.email &&
        !ADMIN_USERS.includes(decodedToken?.email) &&
        !request.nextUrl.pathname.startsWith("/unauthorized")
      ) {
        return redirectToUnAuthorized(request);
      }
      if (
        decodedToken.email &&
        ADMIN_USERS.includes(decodedToken?.email) &&
        request.nextUrl.pathname.startsWith("/unauthorized")
      ) {
        return redirectToHome(request);
      }

      // Authenticated user should not be able to access /login, /register and /reset-password routes
      if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
        return redirectToHome(request);
      }

      if (
        decodedToken.email &&
        ADMIN_USERS.includes(decodedToken?.email) &&
        !decodedToken.role
      ) {
        console.log(`updating user claims`);
        await setCustomUserClaims(decodedToken.uid, {
          role: "admin",
          someCustomClaim: {
            updatedAt: Date.now(),
          },
        });
      } else {
        console.log(`user claims already updated`);
        console.log(`decodedToken`, decodedToken);
      }

      return NextResponse.next();
    },
    handleInvalidToken: async () => {
      return redirectToLogin(request);
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });
      return redirectToLogin(request);
    },
  });
  return result;
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
  ],
};
