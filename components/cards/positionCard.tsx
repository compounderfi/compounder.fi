import Link from "next/link";

export interface PositionCardProps {
  selected?: boolean;
  children?: React.ReactNode;
  href?: string;
}

export default function PositionCard({
  children,
  href,
  selected = false,
}: PositionCardProps) {
  const borderClasses = selected
    ? " border-2 border-[#f0f2f5] outline outline-2 outline-blue-500"
    : " border-2 border-gray-200";
  if (href) {

  return (
    <>
      <Link href={href}>
        <div
          className={
            "h-[496px] w-[280px] cursor-pointer rounded-[30px] bg-[#f0f2f5] shadow-lg" +
            borderClasses
          }
        >
          <div className="flex h-full items-center justify-items-center">
            <div className="mx-auto">{children}</div>
          </div>
        </div>
      </Link>
    </>
  );

  }

  return (
    <>
        <div
          className={
            "h-[496px] w-[280px] cursor-pointer rounded-[30px] bg-[#f0f2f5] shadow-lg" +
            borderClasses
          }
        >
          <div className="flex h-full items-center justify-items-center">
            <div className="mx-auto">{children}</div>
          </div>
        </div>
    </>
  );

}
