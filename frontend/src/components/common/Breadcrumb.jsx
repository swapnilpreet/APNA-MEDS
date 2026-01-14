import { Link, useParams } from "react-router-dom";
import "../css/Breadcrumb.css";

const Breadcrumb = ({ medicineName }) => {
  const { id } = useParams();
  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <span> &gt; </span>
      <Link to="/">Medicines</Link>
      <span> &gt; </span>
      <span>{medicineName || id}</span>
    </div>
  );
};

export default Breadcrumb;