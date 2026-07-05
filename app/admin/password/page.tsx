import { PasswordForm } from "./PasswordForm";

export default function AdminPasswordPage() {
  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl text-primary mb-2">
        Password
      </h1>
      <p className="text-ink-muted mb-6 max-w-md">
        Set or change the password you use to sign in. If you arrived here from a
        reset link, choose a new password below.
      </p>
      <PasswordForm />
    </div>
  );
}
