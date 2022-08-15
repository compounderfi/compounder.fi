export interface PositionCardProps {
  id?: string;
}

export default function PositionCard({ id }: PositionCardProps) {
  return (
    <div className="h-[550px] w-[330px] rounded-md border-2 border-black ">
      {!id && (
        <div className="flex h-full items-center justify-items-center">
          <div className="mx-auto">
            <div className="text-center text-8xl">+</div>
            <div className="text-center text-4xl">Add Position!</div>
          </div>
        </div>
      )}

      {id && (
        <div className="flex h-full items-center justify-items-center">
          <div className="mx-auto">
            <div className="text-center text-4xl">{id}</div>
          </div>
        </div>
      )}
    </div>
  );
}
