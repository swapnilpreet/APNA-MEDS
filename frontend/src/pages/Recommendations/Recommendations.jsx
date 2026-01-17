import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Recommendations.css";
import MedicineCard from "../../components/common/MedicineCard";
import Pagewrapper from "../../components/common/Pagewrapper";

const Recommendations = () => {
  const [personalized, setPersonalized] = useState([]);
  const [symptoms, setSymptoms] = useState("");
  const [symptomResults, setSymptomResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hide, setHide] = useState(true);

  // const [debouncedSearch, setDebouncedSearch] = useState("");

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedSearch(symptoms);
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [symptoms]);

  // useEffect(() => {
  //   if (debouncedSearch) {
  //     fetchBySymptoms()
  //   }
  // }, [debouncedSearch]);

  const fetchPersonalized = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setPersonalized(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchBySymptoms = async () => {
    if (!symptoms.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/recommendations/symptoms`,
        {
          params: { symptoms },
        }
      );
      setSymptomResults(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalized();
  }, []);
 
  return (
    <Pagewrapper>
      <div className="recommend-page">
        <h1>Recommended Medicines</h1>
        <br />
        {/* 🔍 Symptom Search */}
        <div className="symptom-box">
          <input
            type="text"
            placeholder="Enter symptoms (fever, cough, headache)"
            value={symptoms}
            // onChange={handleChange}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button onClick={fetchBySymptoms}>Search</button>
        </div>

        {loading && <p className="loading">Loading...</p>}

        {/* ⭐ Personalized */}
        <section>
          <h3>Personalized For You</h3>
          <div className="medicine-list">
            {personalized.map((med) => (
              <MedicineCard key={med._id} medicine={med} hide={hide} />
            ))}
          </div>
        </section>

        {/* 🤒 Symptom Based */}
        {symptomResults.length > 0 && (
          <section>
            <h3>Based on Symptoms</h3>
            <div className="medicine-list">
              {symptomResults.map((med) => (
                <MedicineCard key={med._id} medicine={med} hide={hide} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Pagewrapper>
  );
};

export default Recommendations;
