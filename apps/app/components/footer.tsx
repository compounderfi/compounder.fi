import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex gap-6 px-4 py-4">
      <p className="flex-grow"></p>
      <Link href="/about">about</Link>
      <Link href="/contact">contact</Link>
      <Link href="https://compounder-fi.gitbook.io/compounder.fi/">docs</Link>
      <Link href="/positions/all">view all positions</Link>
    </div>
  );
}
