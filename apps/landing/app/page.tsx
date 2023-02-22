import Header from "./components/header";
import Hero from "./components/hero";
import Supporter from "./components/supporters";
import Card from "./components/card";
import FeaturesBlocks from "./components/featureBlocks";
import Footer from "./components/footer";
export default function Index() {
  return (
    <>
 
      <div
        style={{
          background:
            "linear-gradient(to bottom right, #DDCAD9, #81e291, #d1b1cb)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
        }}
      >
        <Header></Header>
        <Hero></Hero>
      </div>

      <Supporter/>
      <hr className="h-5px"></hr>
      <FeaturesBlocks/>
      <Footer/>

    </>
  );
}
