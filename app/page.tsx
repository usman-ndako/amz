import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      {/* Company Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png" // Place your logo in /public/logo.png
          alt="Tailor Shop Logo"
          width={120}
          height={120}
          className="rounded-full shadow-lg"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-6">
        Welcome to Tailor Shop
      </h1>

      {/* Get Started Button */}
      <Link href="/dashboard">
        <button className="btn btn-primary btn-lg">Get Started</button>
      </Link>
    </main>
  );
}

export const dynamic = "force-static";