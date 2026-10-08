import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="gutter mx-auto flex min-h-screen max-w-[1440px] flex-col justify-center">
      <Image src="/brand/logo-monogram.png" alt="" aria-hidden width={408} height={324} unoptimized className="h-auto w-16" />
      <h1 className="display mt-10 text-[3rem] md:text-[4.4rem]">This page was never built.</h1>
      <p className="mt-4 max-w-[44ch] text-muted">The link may be old or mistyped. Everything lives on one page.</p>
      <Link href="/" className="mt-10 block w-full bg-ink px-6 py-3.5 text-center font-semibold text-cream transition-colors hover:bg-earth sm:inline-block sm:w-auto sm:self-start">
        Back to Crystal Kizor
      </Link>
    </main>
  );
}
