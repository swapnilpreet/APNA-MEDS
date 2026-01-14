import React, { useState, useEffect } from "react";
import "./AIsuggestion.css";
import Error from "../../components/common/Error";
import Footer from "../../components/common/Footer";
import { useSelector } from "react-redux";

const AIsuggestion = () => {
  const [loadingId, setLoadingId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [error, setError] = useState(false);

  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    if (user && user.medicalHistory) {
      setMedicalHistory(user.medicalHistory);

      if (user.medicalHistory.length < 1) {
        setError(true);
      }
    }
  }, [user]);
  const getMedicineSuggestion = async (description, id) => {
    setLoadingId(id);
    setSuggestions([]);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "xiaomi/mimo-v2-flash:free",
            messages: [
              {
                role: "system",
                content:
                  'You are a medical suggestion assistant. Respond ONLY in valid JSON array format like: [{"name":"","use":"","dosage":"","disclaimer":""}]',
              },
              { role: "user", content: description },
            ],
          }),
        }
      );
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("❌ Not valid JSON response:", text);
        throw new Error("Invalid JSON returned from OpenRouter");
      }
      if (!response.ok || !data?.choices?.length) {
        const msg = data?.error?.message || "OpenRouter request failed";
        throw new Error(msg);
      }

      let raw = data.choices[0].message.content.trim();
      if (raw.startsWith("```")) {
        raw = raw.replace(/```json|```/g, "").trim();
      }

      let parsed;
      try {
        // Extract first valid JSON block (object or array)
        const match = raw.match(/^\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*/);
        if (match) {
          parsed = JSON.parse(match[1]);
          // Ensure parsed is always an array
          if (!Array.isArray(parsed)) {
            parsed = [parsed];
          }
        } else {
          throw new Error("No valid JSON found in AI output");
        }
      } catch (err) {
        console.error("⚠️ AI output not valid JSON:", raw);
        parsed = [
          {
            name: "⚠️ Parsing Failed",
            use: "Check AI output format",
            dosage: "-",
            disclaimer:
              "Consult a certified doctor before taking any medication.",
          },
        ];
      }

      setSuggestions(parsed);
    } catch (error) {
      console.error("getMedicineSuggestion error:", error.message);
      setSuggestions([
        { name: "Error", use: "-", dosage: "-", disclaimer: error.message },
      ]);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      {/* {!error ? <> */}
      <div>
        {!error ? (
          <>
            {" "}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <h1>AI-Powered Medicine Suggestions</h1>
              <p
                style={{
                  color: "#555",
                  fontSize: "14px",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Personalized medicine recommendations generated based on your
                health condition and medical history. These are suggestions
                only—please consult a certified doctor before starting or
                changing any medication.
              </p>
            </div>
            <div className="ai-container">
              {/* Left side - Medical History */}
              <div className="ai-left">
                <h2 className="ai-heading">🩺 Medical History</h2>
                <table className="ai-table">
                  <thead>
                    <tr>
                      <th>Condition</th>
                      <th>Diagnosis Date</th>
                      <th>Medications</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalHistory.map((item) => (
                      <tr key={item._id}>
                        <td>{item.condition}</td>
                        <td>
                          {new Date(item.diagnosisDate).toLocaleDateString()}
                        </td>
                        <td>{item.medications.join(", ")}</td>
                        <td>{item.notes}</td>
                        <td>
                          <button
                            className="ai-button"
                            onClick={() =>
                              getMedicineSuggestion(item.condition, item._id)
                            }
                          >
                            {loadingId === item._id
                              ? "Loading..."
                              : "Get AI Suggestion"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right side - AI Suggestions */}
              <div className="ai-right">
                <h2 className="ai-heading">🤖 AI Medicine Suggestions</h2>
                {suggestions.length > 0 ? (
                  <table className="ai-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Use</th>
                        <th>Dosage</th>
                        <th>Disclaimer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestions.map((med, i) => (
                        <tr key={i}>
                          <td>{med.name}</td>
                          <td>{med.use}</td>
                          <td>{med.dosage}</td>
                          <td>{med.disclaimer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="ai-placeholder">
                    No suggestions yet. Click a button.
                  </p>
                )}
              </div>
            </div>{" "}
          </>
        ) : (
          <Error
            message="You Dont have medical history"
            btntext="Add Medical History"
            path="/profile"
          />
        )}
        {/* <Footer/> } */}
      </div>
      {/* </> : <Error  message="You Dont have medical history" btntext="Add Medical History" path="/profile"/>} 
      <Footer/> */}
    </>
  );
};

export default AIsuggestion;
