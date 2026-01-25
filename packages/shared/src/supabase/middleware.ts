import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public paths that don't require authentication
  const publicPaths = ["/", "/signin", "/signup", "/callback", "/signout"];
  const publicApiPrefixes = ["/api/twilio", "/api/process-calls"];

  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path,
  );
  const isPublicApi = publicApiPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  // Redirect unauthenticated users to signin
  if (!user && !isPublicPath && !isPublicApi) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth pages to dashboard
  if (
    user &&
    (request.nextUrl.pathname === "/signin" ||
      request.nextUrl.pathname === "/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
