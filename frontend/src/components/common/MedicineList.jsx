import React, { useEffect, useState } from "react";
import MedicineCard from "./MedicineCard";
import CompareModal from "./CompareModal";
import { useDispatch } from "react-redux";
import "../css/MedicineCard.css";
import { SetLoader } from "../../redux/LoadingSlice";
import Filters from "./Filters";
import Pagination from "./Pagination";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const MedicineList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [medicines, setMedicines] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const dispatch = useDispatch();

  const fetchMedicines = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/medicine`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            pageNumber: currentPage,
            keyword,
            brand,
            minPrice,
            maxPrice,
          },
        }
      );
      dispatch(SetLoader(false));
      if(response.data.success) {
        setMedicines(response.data.Medicines);
        setTotalPages(response.data.pages);
        setBrandList(response.data.brandList);
      }
    } catch(error){
      console.log(error);
      dispatch(SetLoader(false));
    }
  };

  const handleApplyFilters = () => {
    setKeyword(keyword);
    setBrand(brand);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    setCurrentPage(1);
    fetchMedicines();
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMedicines();
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword,brand,currentPage]);

  const handleCompareToggle = (medicine) => {
    const alreadySelected = selected.find((m) => m._id === medicine._id);

    if (alreadySelected) {
      setSelected(selected.filter((m) => m._id !== medicine._id));
    } else if (selected.length < 2) {
      setSelected([...selected, medicine]);
    }

    setTimeout(() => {
      if (selected.length === 1 && !alreadySelected) {
        setShowModal(true);
      }
    }, 100);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected([]);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      <Filters
        keyword={keyword}
        setKeyword={setKeyword}
        brand={brand}
        setBrand={setBrand}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        brandList={brandList}
        onApply={handleApplyFilters}
        setCurrentPage={setCurrentPage}
      />
      <div className="medicine-list-wrapper">
        <div className="medicine-list">
          {medicines?.length > 0 ? (
            medicines.map((medicine) => (
              <MedicineCard
                key={medicine._id}
                medicine={medicine}
                onCompareToggle={handleCompareToggle}
                isSelected={selected.some((m) => m._id === medicine._id)}
              />
            ))
          ) : (
            <p>No medicines found.</p>
          )}

          {showModal && selected.length === 2 && (
            <CompareModal medicines={selected} onClose={closeModal} />
          )}
        </div>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
      <ToastContainer />
    </>
  );
};

export default MedicineList;
