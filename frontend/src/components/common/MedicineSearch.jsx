import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaSearch,
  FaChevronUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/MedicineSearch.css";
import axios from "axios";
const rotatingList = [
  "LEVIPIL",
  "PARACETAMOL",
  "ASPIRIN",
  "DOLO 650",
  "CETIRIZINE",
  "AZITHROMYCIN",
];

const MedicineSearch = () => {
  const [location, setLocation] = useState({
    pincode: "400079",
    city: "Mumbai",
    state: "Maharashtra",
  });
  const [showPincodeInput, setShowPincodeInput] = useState(false);
  const [pincodeInput, setPincodeInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestionError, setsuggestionError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchLocationFromPincode = async (pincode) => {
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();
      if (data[0].Status === "Success") {
        const office = data[0].PostOffice[0];
        setLocation({
          pincode: pincode,
          city: office.District,
          state: office.State,
        });
      } else {
        setLocation({ pincode, city: "Unknown", state: "" });
      }
    } catch (error) {
      console.error("Error fetching pincode:", error);
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincodeInput) {
      fetchLocationFromPincode(pincodeInput);
      setShowPincodeInput(false);
      setPincodeInput("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        setsuggestionError(false);
        return;
      } else {
        fetchmedicineforsuggestion(searchTerm);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchmedicineforsuggestion = async (keyword) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASEURL
        }/api/medicine/?keyword=${encodeURIComponent(keyword)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.Medicines.length > 0) {
        setSuggestions(response.data.Medicines);
      } else {
        setsuggestionError(true);
        setSuggestions([]);
        // setTimeout(() => {
        //   setsuggestionError(false);
        // }, 2000);
        throw new Error("Error fetching medicine suggestions");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="search-section">
      <h1>Say Goodbye to High Medicine Prices</h1>
      <p>Compare prices and save up to 51%</p>

      <div className="search-bar">
        <div className="location-select">
          <FaMapMarkerAlt />
          <span>
            {location.pincode}, {location.city}{" "}
            {location.state && `(${location.state})`}
          </span>
          {!showPincodeInput ? (
            <FaChevronDown
              onClick={() => setShowPincodeInput(!showPincodeInput)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <FaChevronUp
              onClick={() => setShowPincodeInput(!showPincodeInput)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>

        {showPincodeInput && (
          <form
            className="pincode-input-wrapper"
            onSubmit={handlePincodeSubmit}
          >
            <input
              className="pincode-input"
              type="text"
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value)}
              placeholder="Enter Pincode And Press Enter"
            />
          </form>
        )}
        <div className="divider"></div>

        <div className="search-input-wrapper">
          <input
            className="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search for ${rotatingList[placeholderIndex]}`}
          />

          {suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((item) => (
                <li key={item._id}>
                  <Link
                    to={`/medicine/${item._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {suggestionError && (
            <ul className="suggestions-dropdown">No medicines found.</ul>
          )}
        </div>
        <button className="search-button">
          <FaSearch />
        </button>
      </div>
      <div className="background-icon left"></div>
      <div className="background-icon right"></div>
    </div>
  );
};

export default MedicineSearch;
