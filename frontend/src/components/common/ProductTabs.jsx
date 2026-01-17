import React, { useEffect, useState } from "react";
import "../css/ProductTabs.css";
import axios from "axios";
import { useSelector } from "react-redux";
import StarRating from "./StarRating";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { timeAgo } from "../../Utills/timeAgo";

const StarInput = ({ rating, setRating }) => {
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={star <= rating ? "star filled" : "star"}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

const ProductTabs = ({ med }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });
  const [medicineReview, setMedicineReview] = useState({
    reviews: [],
    averageRating: 0,
  });
  const { user } = useSelector((state) => state.users);
  const [error, setError] = useState(null);
  console.log("ProductTabs Component - Medicine:", med.name);

  const fetchMedicnineReviews = async (id) => {
    console.log(`Fetching reviews for medicine ID:${id}`);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BASEURL}/api/medicine/${id}/reviews`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Medicine Reviews:", data.reviews);
      if (data?.reviews?.length > 0) {
        setMedicineReview(data);
        setError(null);
      } else {
        setMedicineReview({ reviews: [], averageRating: 0 });
        setError("No reviews found for this medicine.");
      }
    } catch (error) {
      console.error("Error fetching medicine reviews:", error);
    }
  };

  const submitReview = async () => {
    try {
      if (isEditMode) {
        console.log("Updating review ID:", selectedReviewId);
        await axios.put(
          `${import.meta.env.VITE_BASEURL}/api/medicine/${
            med._id
          }/reviews/${selectedReviewId}`,
          reviewForm,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/medicine/${med._id}/reviews`,
          reviewForm,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      fetchMedicnineReviews(med._id);
      setShowReviewModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/medicine/${
          med._id
        }/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchMedicnineReviews(med._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditReview = (review) => {
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    });
    // console.log("review._id", review._id);
    setSelectedReviewId(review._id);
    // console.log("selectedReviewId", selectedReviewId);
    setIsEditMode(true);
    setShowReviewModal(true);
  };

  const openAddReviewModal = () => {
    setIsEditMode(false);
    setReviewForm({ rating: 0, comment: "" });
    setShowReviewModal(true);
  };

  useEffect(() => {
    if (med?._id) {
      fetchMedicnineReviews(med._id);
    }
  }, [med?._id]);

  return (
    <div key={med._id} className="product-container">
      <div>
        <section className="product-section">
          <h3 className="product-heading">
            📝 Product Description of {med.name}
          </h3>
          <p className="product-paragraph">
            <strong>{med.name}</strong> is used for maintaining overall health
            and wellness...
          </p>
        </section>

        <section className="product-section">
          <h3 className="product-heading">🔬 Ingredients of {med.name}</h3>
          <ul className="product-list">
            <li className="product-list-item">
              <strong>Vitamins:</strong> A, B1, B6, B12, D, E...
            </li>
            <li className="product-list-item">
              <strong>Amino Acids:</strong> L-Arginine, L–Glutathione...
            </li>
            <li className="product-list-item">
              <strong>Minerals:</strong> Zinc, Selenium, Copper...
            </li>
            <li className="product-list-item">
              <strong>Lycopene:</strong> Natural antioxidant...
            </li>
          </ul>
        </section>

        <section className="product-section">
          <h3 className="product-heading">📌 Key Uses</h3>
          <p className="product-paragraph">
            Maintains energy, immunity, and promotes overall well-being.
          </p>
        </section>

        <section className="product-section">
          <h3 className="product-heading">🕒 How To Use</h3>
          <p className="product-paragraph">
            Take one tablet daily after a meal or as prescribed by your
            physician.
          </p>
        </section>

        <section className="product-section">
          <h3 className="product-heading">⚠️ Safety Information</h3>
          <ul className="product-list">
            <li className="product-list-item">Keep out of reach of children</li>
            <li className="product-list-item">Store in a cool, dry place</li>
            <li className="product-list-item">
              Do not exceed recommended dose
            </li>
          </ul>
        </section>

        {/* show medicine reviews */}
        <section className="product-section">
          <button className="pill" onClick={openAddReviewModal}>Add Medicine Review</button>
          <h3 className="product-heading">🗣️ Medicine Reviews</h3>

          <div className="review-stack">
            <div><StarRating rating={medicineReview?.averageRating}/></div>
            <div><AiOutlineComment size={22}/>{" "} {medicineReview?.reviews?.length||0} </div>
          </div>
          {error && (
            <p className="product-paragraph">
              No reviews yet. Be the first to review {med.name}!
            </p>
          )}
          {medicineReview?.reviews?.map((review) => (
            <div key={review._id} className="review-box">
              {/* User Info */}
              {/* src={
            user?.profilePicture?.url
              ? user?.profilePicture?.url
              : "https://loremipsum.imgix.net/gPyHKDGI0md4NkRDjs4k8/36be1e73008a0181c1980f727f29d002/avatar-placeholder-generator-500x500.jpg?w=1280&q=60&auto=format,compress"
          } */}
              <div className="review-user-info">
                <img
                  src={review?.user?.profilePicture?.url || "https://loremipsum.imgix.net/gPyHKDGI0md4NkRDjs4k8/36be1e73008a0181c1980f727f29d002/avatar-placeholder-generator-500x500.jpg?w=1280&q=60&auto=format,compress"}
                  alt="User"
                />

                <div className="user-details">
                  <h4>{review?.user?.name}</h4>
                  <p>{review?.user?.email}</p>
                  <span className="review-time">
                    {timeAgo(review.createdAt)}
                  </span>
                </div>

                {/* Edit / Delete Icons*/}
                {user._id === review?.user?._id && (
                  <div className="review-actions">
                    <FaEdit
                      className="action-icon edit"
                      onClick={() => handleEditReview(review)}
                    />
                    <FaTrash
                      className="action-icon delete"
                      onClick={() => handleDeleteReview(review._id)}
                    />
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="review-content">
                <StarRating rating={review.rating} />
                <p className="review-text">{review.comment}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {showReviewModal && (
        <div className="modal-overlay">
          <div className="review-modal">
            <h3>{isEditMode ? "Edit Review" : "Add Review"}</h3>

            <StarInput
              rating={reviewForm.rating}
              setRating={(value) =>
                setReviewForm({ ...reviewForm, rating: value })
              }
            />

            <textarea
              placeholder="Write your review..."
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
            />

            <div className="modal-actions">
              <button className="submit" onClick={submitReview}>
                {isEditMode ? "Update" : "Submit"}
              </button>
              <button
                className="cancel"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
