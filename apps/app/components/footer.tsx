import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex gap-6 px-4 py-4">
      <p className="flex-grow"></p>
      <Link href="https://discord.gg/UcbM8w4uVK">discord</Link>
      <Link href="https://twitter.com/compounderfi">twitter</Link>
      <Link href="https://github.com/compounderfi">github</Link>
      <Link href="https://compounder-fi.gitbook.io/compounder.fi/">docs</Link>
      <Link href="https://compounder-fi.gitbook.io/compounder.fi/terms-of-service">tos</Link>
      <Link href="/positions/all">view all positions</Link>
      <Link href="/compounds">view recent compounds</Link>
    </div>
  );
}
