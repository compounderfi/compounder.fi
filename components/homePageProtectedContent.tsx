import NFTPreview from "./nftPreview";
import NFTAddPreview from "./nftAddPreview";

export default function HomePageProtectedContent() {
  return (
    <div className="flex overflow-x-auto overflow-y-hidden">
      <NFTAddPreview></NFTAddPreview>
      {/* <NFTPreview></NFTPreview> */}
      {/* <NFTPreview></NFTPreview> */}
      {/* <NFTPreview></NFTPreview> */}
      <NFTPreview></NFTPreview>
    </div>
  )
}
