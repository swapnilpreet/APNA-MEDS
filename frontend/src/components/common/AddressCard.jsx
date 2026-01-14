import { FiChevronRight } from "react-icons/fi";
import "../css/AddressCard.css";


const AddressCard = ({ selectedPatient, selectedAddress ,handleopenClosed}) => {
  return (
    <>
      {selectedAddress && (
        <div className="address-cardNew">
          {/* Delivery Address */}
          <div className="address-section">
            <div className="address-header">
              <span className="tag">DELIVER TO</span>
              <span className="title">
                {selectedAddress?.address}, ({selectedAddress?.city},{" "}
                {selectedAddress?.postalcode}), {selectedAddress?.state}
                {selectedAddress?.country}
              </span>
              <FiChevronRight className="icon"  onClick={handleopenClosed} />
            </div>
            <p className="address-details">{selectedAddress.fullAddress}</p>
          </div>

          {/* Patient Info */}
          <div className="patient-section">
            <div className="patient-header">
              <span className="tag">ORDER FOR</span>
              <span className="title">
                {selectedPatient ? selectedPatient.name : "No patient selected"}
              </span>
              <FiChevronRight className="icon" onClick={handleopenClosed} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AddressCard;
