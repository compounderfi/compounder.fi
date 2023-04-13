import Link from "next/link";

export interface PositionCardProps {
  selected?: boolean;
  children?: React.ReactNode;
  href?: string;
  showPointer?: boolean;
  isCompounding?: boolean;
}

export default function PositionCard({
  children,
  href,
  selected = false,
  showPointer = true,
  isCompounding = false
}: PositionCardProps) {
  const borderColor = isCompounding ? "border-[#81e291]" : "border-gray-200";
  const borderClasses = selected
    ? " border-2 border-[#f0f2f5] outline outline-2 outline-blue-500"
    : " border-2 " + borderColor;

  const cursorClasses = showPointer ? " cursor-pointer" : "";

  const card = (
    <div
      className={
        "h-[496px] w-[280px] rounded-[30px] bg-[#f0f2f5] shadow-lg" +
        borderClasses +
        cursorClasses
      }
    >
      <div className="flex h-full items-center justify-items-center">
        <div className="mx-auto">{children}</div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return <>{card}</>;
}
