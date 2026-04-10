# IMoveis (Mercado Imobiliário)

Web application for discovering rental properties, submitting lease applications, and managing listings. The UI is built with **Next.js 15** and **React 19**, with **Amazon Cognito** handling authentication and a separate **REST API** (configured via environment variable) for business data.

## Overview

- **Public experience**: Landing page, property search with map and filters, and detailed property pages.
- **Authenticated users**: Sign-in and sign-up through AWS Amplify UI, with roles **tenant** (renter) or **manager** (property manager).
- **API integration**: [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview) calls a backend at `NEXT_PUBLIC_API_BASE_URL`, sending the Cognito **ID token** in the `Authorization` header.

## Main functionalities

| Area | Description |
|------|-------------|
| **Landing** | Marketing sections (hero, features, discover, CTA, footer). |
| **Search & listings** | Filter properties by location, price, beds/baths, type, amenities, square footage, and map coordinates; grid or list view. |
| **Property details** | Overview, images, details, location map ([Leaflet](https://leafletjs.com/)), and application flow for tenants. |
| **Tenants** | Favorites, rental applications, current residences, and profile/settings. |
| **Managers** | CRUD-oriented flows for properties (including image upload via [FilePond](https://pqina.nl/filepond/)), application review, and settings. |
| **Auth** | Email-based sign-in/sign-up; **custom attribute `custom:role`** (`tenant` or `manager`) set at registration; protected dashboard routes with role-based navigation. |

## Tech stack

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS, tailwindcss-animate, [shadcn/ui](https://ui.shadcn.com/)-style components (Radix UI primitives)
- **State**: Redux Toolkit, RTK Query
- **Forms & validation**: react-hook-form, Zod, @hookform/resolvers
- **Auth**: aws-amplify, @aws-amplify/ui-react (Authenticator)
- **Maps**: leaflet, react-leaflet
- **Motion & UX**: framer-motion, sonner (toasts), cmdk (command palette), next-themes
- **Icons**: lucide-react, Font Awesome (React)
- **Linting**: Biome

## Environment variables

Create a `.env.local` (or configure the same keys in Amplify) with:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID` | Cognito User Pool ID |
| `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID` | Cognito app client ID |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the REST API (no trailing slash recommended) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js in development |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run Biome (`biome check`) |

---

## Deploying on AWS Amplify and configuring AWS Cognito

This app expects a **Cognito User Pool** and an **app client** whose ID and pool ID are exposed to the browser via `NEXT_PUBLIC_*` variables. The backend API must validate Cognito JWTs (typically the access or ID token sent by the app).

### 1. Amazon Cognito

1. In the **AWS Console**, open **Amazon Cognito** → **User pools** → **Create user pool**.
2. **Sign-in options**: enable **Email** (the Authenticator uses email-oriented labels; align with your pool settings).
3. **Password policy**: set according to your security requirements.
4. **MFA / recovery**: optional for development; enable for production as needed.
5. **Attributes**: add a **custom attribute** named **`role`** (full name in Cognito: `custom:role`). In the console this appears under custom attributes; the app sends `tenant` or `manager` at sign-up. Configure the attribute as **mutable** if users might change role later (otherwise immutable is fine if role never changes after registration).
6. **App integration**: create an **app client**:
   - Allowed OAuth flows / hosted UI are optional if you only use the embedded Amplify Authenticator.
   - Ensure the client can authenticate users (no secret required for a public SPA client, or use a client without secret for browser apps).
7. Note the **User Pool ID** and **App client ID** — they map to `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID` and `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID`.

**Amplify Gen 1 CLI (optional)**: You can instead run `amplify add auth` in a project configured with the Amplify CLI and push the stack; then copy pool and client IDs from the Cognito console or `amplifyconfiguration.json`. This repository configures Amplify in code (`Amplify.configure` in `authProvider.tsx`), so a hosted `amplifyconfiguration` file is not strictly required if env vars are set.

### 2. Backend API and tokens

- Set **`NEXT_PUBLIC_API_BASE_URL`** to your API Gateway / load balancer URL (or custom domain) for the REST API.
- The app attaches **`Authorization: Bearer <idToken>`** from `fetchAuthSession()`. Your API should verify the JWT against the same User Pool (JWKS from Cognito) and read claims such as **`sub`** and **`custom:role`**.

### 3. AWS Amplify Hosting

1. Open **AWS Amplify** in the console → **Host web app** (or **New app** → **Host web app**).
2. Connect your **Git** provider (GitHub, GitLab, Bitbucket, or AWS CodeCommit) and select this repository and branch.
3. **Build settings**: Amplify detects **Next.js**; use the default or ensure:
   - **Build command**: `npm run build` (or `npm ci && npm run build` if you prefer clean installs).
   - **Artifact / output**: follow Amplify’s Next.js SSR guidance for your Amplify console version (Amplify may use **Compute** for SSR apps).
4. **Environment variables** (Amplify console → App → **Environment variables**), add:
   - `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID`
   - `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID`
   - `NEXT_PUBLIC_API_BASE_URL`
5. Save and **deploy**. Redeploy after changing environment variables.

### 4. Domains and redirects

- In **Amplify** → **Domain management**, attach a custom domain and HTTPS if needed.
- If you use Cognito **Hosted UI** or OAuth callbacks in the future, add the Amplify app URL (and custom domain) to **Allowed callback URLs** and **Sign-out URLs** on the app client. For the current in-app Authenticator-only flow, this may not be required.

### 5. Images (optional)

`next.config.ts` allows images from `*.amazonaws.com` and `example.com`. For production property images on other hosts, extend `images.remotePatterns` to match your S3 bucket or CDN domain.

---


