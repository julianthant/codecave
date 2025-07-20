import { redirect } from "next/navigation";

interface CallbackParams {
  searchParams: Promise<{
    token?: string;
    refresh?: string;
    error?: string;
  }>;
}

export default async function AuthCallback({ searchParams }: CallbackParams) {
  const params = await searchParams;
  const { token, refresh, error } = params;

  if (error) {
    // Redirect to login with error
    redirect(`/?error=${encodeURIComponent(error)}`);
  }

  if (token && refresh) {
    // Store tokens in localStorage via client-side script
    return (
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                localStorage.setItem('accessToken', '${token}');
                localStorage.setItem('refreshToken', '${refresh}');
                window.location.href = '/dashboard';
              `,
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontFamily: "system-ui",
            }}
          >
            <p>Authenticating... Please wait.</p>
          </div>
        </body>
      </html>
    );
  }

  // If no token, redirect to home
  redirect("/");
}
