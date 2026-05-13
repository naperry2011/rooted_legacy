import Image from "next/image";

type Props = {
  size?: number;
  priority?: boolean;
  className?: string;
};

export function Logo({ size = 64, priority = false, className }: Props) {
  return (
    <Image
      src="/brand/rooted_legacy_logo.jpg"
      alt="Rooted Legacy"
      width={size}
      height={size}
      priority={priority}
      className={
        "rounded-full ring-1 ring-primary/40 shadow-[0_0_40px_-12px_rgba(217,164,65,0.5)] " +
        (className ?? "")
      }
    />
  );
}
