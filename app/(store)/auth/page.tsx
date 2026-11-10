import { SignIn, SignUp } from '@clerk/nextjs';
import { PageTitle, StoreLayout } from '@/components/store-layout';

export const metadata = { title: 'Sign in' };

export default function AuthPage() {
  return (
    <StoreLayout>
      <PageTitle eyebrow="Maison Vell" title="Welcome" />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pb-24 md:grid-cols-2">
        <div className="panel">
          <h2>Sign in</h2>
          <SignIn routing="hash" />
        </div>
        <div className="panel">
          <h2>Create account</h2>
          <SignUp routing="hash" />
        </div>
      </div>
    </StoreLayout>
  );
}
