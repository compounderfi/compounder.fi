import Header from "./components/header";
import Hero from "./components/hero";
import Supporter from "./components/supporters";
import Card from "./components/card";
import FeaturesBlocks from "./components/featureBlocks";
import Footer from "./components/footer";
 

export default function Index() {
  return (
    <>
      <div className="mesh"
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
