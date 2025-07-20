** RESPONSES ** DO CHECKS AT THE END \*\*

-> I am getting this error from the build:

i got this from the terminal for your build:
• Packages in scope: @codecave/api, @codecave/web
• Running build in 2 packages
• Remote caching disabled
@codecave/web:build: cache miss, executing 38a3405c5c8ee52b
@codecave/api:build: cache miss, executing 4627400561ebd375
@codecave/web:build:
@codecave/api:build:
@codecave/web:build:
@codecave/web:build: > @codecave/web@0.1.0 build /Users/julianhein/Work/Personal Projects/codecave/apps/web
@codecave/web:build: > next build
@codecave/web:build:
@codecave/api:build:
@codecave/api:build: > @codecave/api@0.1.0 build /Users/julianhein/Work/Personal Projects/codecave/apps/api
@codecave/api:build: > nest build
@codecave/api:build:
@codecave/web:build: ⚠ Warning: Found multiple lockfiles. Selecting /Users/julianhein/Work/Personal Projects/package-lock.json.
@codecave/web:build: Consider removing the lockfiles at:
@codecave/web:build: \* /Users/julianhein/Work/Personal Projects/codecave/pnpm-lock.yaml
@codecave/web:build:
@codecave/web:build: ▲ Next.js 15.4.1
@codecave/web:build: - Environments: .env.local
@codecave/web:build: - Experiments (use with caution):
@codecave/web:build: · clientTraceMetadata
@codecave/web:build:
@codecave/web:build: Creating an optimized production build ...
@codecave/web:build: ✓ Compiled successfully in 9.0s

@codecave/web:build: Failed to compile.

@codecave/web:build: ./src/app/auth/callback/page.tsx
@codecave/web:build: 1:10 Warning: 'NextRequest' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build:
@codecave/web:build: ./src/components/landing/communities-section.tsx
@codecave/web:build: 32:7 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
@codecave/web:build:
@codecave/web:build: ./src/components/landing/features-section.tsx
@codecave/web:build: 123:43 Warning: 'index' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build:
@codecave/web:build: ./src/components/landing/mobile-menu-toggle.tsx
@codecave/web:build: 36:58 Warning: 'onClose' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build:
@codecave/web:build: ./src/components/landing/navigation.tsx
@codecave/web:build: 2:10 Warning: 'ArrowRight' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build:
@codecave/web:build: ./src/components/landing/pricing-section.tsx
@codecave/web:build: 1:39 Warning: 'Star' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build:
@codecave/web:build: ./src/components/landing/ready-to-start-section.tsx
@codecave/web:build: 2:10 Warning: 'Smartphone' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build:
@codecave/web:build: ./src/components/landing/trending-projects-cards.tsx
@codecave/web:build: 23:7 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
@codecave/web:build:
@codecave/web:build: ./src/components/landing/trending-projects.tsx
@codecave/web:build: 2:18 Warning: 'ExternalLink' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build: 73:7 Warning: 'SocialEngagement' is assigned a value but never used. @typescript-eslint/no-unused-vars
@codecave/web:build: 214:7 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
@codecave/web:build:
@codecave/web:build: ./src/components/landing/why-codecave-section.tsx
@codecave/web:build: 25:80 Warning: 'index' is defined but never used. @typescript-eslint/no-unused-vars
@codecave/web:build:
@codecave/web:build: ./src/components/ui/codecave-logo.tsx
@codecave/web:build: 76:13 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
@codecave/web:build: 82:13 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
@codecave/web:build: 89:13 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
@codecave/web:build: 101:13 Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element @next/next/no-img-element
@codecave/web:build:
@codecave/web:build: ./src/components/ui/theme-provider.tsx
@codecave/web:build: 8:18 Error: Unexpected any. Specify a different type. @typescript-eslint/no-explicit-any
@codecave/web:build:
@codecave/web:build: info - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
@codecave/web:build:  ELIFECYCLE  Command failed with exit code 1.
@codecave/web:build: ERROR: command finished with error: command (/Users/julianhein/Work/Personal Projects/codecave/apps/web) /Users/julianhein/Work/Personal Projects/node_modules/.bin/pnpm run build exited (1)
@codecave/web#build: command (/Users/julianhein/Work/Personal Projects/codecave/apps/web) /Users/julianhein/Work/Personal Projects/node_modules/.bin/pnpm run build exited (1)

Tasks: 1 successful, 2 total
Cached: 0 cached, 2 total
Time: 12.977s
Failed: @codecave/web#build

ERROR run failed: command exited (1)
julianhein@Julians-MacBook-Pro codecave %

\*\* CHECKS

-> Go through all the files you created. Optimize them if you can. If the component can be split more into server side and client side, do it. dont have unnecessary client side components.

-> Don't use useEffect, at all. There are always better alternatives. Go through the files to see if there is useEffect being used. If they are really necessary, keey them.

-> Check through all your files and make sure they are compliant with my request. Go through them to look for runtime errors. ALWAYS DOUBLE CHECK THE FILES AFTER YOU CREATE THEM FOR ERRORS.

-> Remove any unused components and imports.
