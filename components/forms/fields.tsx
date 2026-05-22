import * as React from "react";

type BaseProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
};

export function Field({
  label,
  name,
  error,
  hint,
  children,
}: BaseProps & { children: React.ReactNode }) {
  return (
    <label htmlFor={name} className="block">
      <span className="block text-sm text-cream mb-1">{label}</span>
      {children}
      {hint && !error && (
        <span className="block mt-1 text-xs text-ink-muted/70">{hint}</span>
      )}
      {error && (
        <span className="block mt-1 text-xs text-tomato" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

const baseInput =
  "w-full rounded-xl border border-line bg-bg-elev px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-primary/60 transition-colors";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input(props, ref) {
  return <input ref={ref} {...props} className={baseInput + (props.className ? " " + props.className : "")} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea(props, ref) {
  return (
    <textarea
      ref={ref}
      rows={5}
      {...props}
      className={baseInput + " resize-y" + (props.className ? " " + props.className : "")}
    />
  );
});

export function SubmitButton({
  children,
  pending,
  className,
}: {
  children: React.ReactNode;
  pending?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        "inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-primary text-bg font-medium hover:bg-cream transition-colors disabled:opacity-60 disabled:cursor-not-allowed " +
        (className ?? "")
      }
    >
      {pending ? "Working..." : children}
    </button>
  );
}

export function FormAlert({
  kind,
  children,
}: {
  kind: "success" | "error";
  children: React.ReactNode;
}) {
  const color = kind === "success" ? "text-leaf" : "text-tomato";
  return (
    <p
      className={"text-sm rounded-xl border border-line bg-bg-elev px-4 py-3 " + color}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
