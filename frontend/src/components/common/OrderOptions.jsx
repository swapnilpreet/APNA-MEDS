import "../css/OrderOptions.css";
import { FiPhoneCall } from "react-icons/fi";
import { LuFilePlus } from "react-icons/lu";
import { SetShowModel } from "../../redux/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import MedicalHistoryModal from "./MedicalHistoryModal";

const OrderOptions = () => {
  const showModal = useSelector((state) => state.loaders.showmodel);
  const dispatch = useDispatch();
  return (
    <div className="order-options-container">
      <div className="order-title">
        <span className="line" />
        <span className="label">Place Your Order Via</span>
        <span className="line" />
      </div>

      <div className="order-buttons">
        <div className="op-order-card">
          <div className="icon-box">
            <FiPhoneCall className="icon" size={22} />
          </div>
          <div className="text-box">
            <strong>Call 9876543210</strong> to place order
          </div>
        </div>

        <div
          className="op-order-card"
          onClick={() => dispatch(SetShowModel(true))}
        >
          <div className="icon-box">
            <LuFilePlus className="icon" size={22} />
          </div>
          <div className="text-box">
            Upload a <strong>prescription</strong>
          </div>
        </div>
      </div>
      <MedicalHistoryModal
        isOpen={showModal}
        onClose={() => dispatch(SetShowModel(false))}
        onSuccess={() => toast("Prescription uploaded successfully!")}
      />
    </div>
  );
};

export default OrderOptions;
