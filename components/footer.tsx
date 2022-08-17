import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex gap-4 px-4 py-4">
      <p className="flex-grow"></p>
      <Link href="/about">about</Link>
      <Link href="/contact">contact</Link>
    </div>
  );
}
