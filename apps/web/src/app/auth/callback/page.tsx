import { redirect } from "next/navigation";

interface CallbackParams {
  searchParams: Promise<{
    token?: string;
    refresh?: string;
    error?: string;
    existing_provider?: string;
    attempted_provider?: string;
  }>;
}

export default async function AuthCallback({ searchParams }: CallbackParams) {
  const params = await searchParams;
  const { token, refresh, error, existing_provider, attempted_provider } =
    params;

  if (error) {
    // Handle specific "account exists with different provider" error
    const isAccountExistsError = error === "account_exists";
    const hasProviderInfo = existing_provider && attempted_provider;

    if (isAccountExistsError && hasProviderInfo) {
      const errorMessage = `An account with this email already exists and is linked to ${existing_provider}. Please sign in with ${existing_provider} instead of ${attempted_provider}.`;
      redirect(
        `/?error=${encodeURIComponent(errorMessage)}&error_type=account_exists&existing_provider=${existing_provider}`
      );
    } else {
      // Handle other errors
      redirect(`/?error=${encodeURIComponent(error)}`);
    }
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
                window.location.href = '/home';
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
