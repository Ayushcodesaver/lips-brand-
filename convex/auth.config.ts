/**
 * Clerk ↔ Convex integration.
 *
 * After creating your Clerk app, add a JWT template named "convex"
 * (see SETUP.md) and set these env vars on the Convex deployment:
 *   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://your-app.clerk.accounts.dev
 *   npx convex env set CLERK_APPLICATION_ID  <Application ID from the JWT template>
 */
const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationId: process.env.CLERK_APPLICATION_ID,
    },
  ],
};

export default authConfig;
