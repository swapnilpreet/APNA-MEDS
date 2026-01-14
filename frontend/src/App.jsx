import { ToastContainer } from "react-toastify";
import Navbar from "./components/common/Navbar/Navbar";
import AllRoutes from "./pages/AllRoutes";
function App() {
  return (
    <>

      <Navbar />
      <ToastContainer />
      <AllRoutes />
    </>
  );
}

export default App;
