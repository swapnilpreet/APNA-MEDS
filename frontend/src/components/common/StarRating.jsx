import { FaStar, FaStarHalfAlt, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const stars = [];
  for(let i = 1; i <= 5; i++){
    if (rating >= i){
      stars.push(<FaStar size={22} key={i} className="star filled" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt size={22} key={i} className="star half" />);
    } else {
      stars.push(<FaRegStar size={22} key={i} className="star empty" />);
    }
  }
  return <div className="star-rating">{stars}</div>;
};

export default StarRating;