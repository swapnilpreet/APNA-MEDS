import Carousel from "../../components/common/Carousel";
import FAQ from "../../components/common/FAQ";
import Footer from "../../components/common/Footer";
import JotformAgent from "../../components/common/JotformAgent";
import MedicineList from "../../components/common/MedicineList";
import MedicineSearch from "../../components/common/MedicineSearch";
import OrderOptions from "../../components/common/OrderOptions";
import Pagewrapper from "../../components/common/Pagewrapper";

const Home = () => {
  return (
    <>
      <MedicineSearch />
      <Pagewrapper>
        <OrderOptions />
        <Carousel />
        <MedicineList />
        <FAQ />
      </Pagewrapper>
      <JotformAgent />
      <Footer />
    </>
  );
};

export default Home;
