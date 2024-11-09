import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  deleteReview,
  getProductReviews,
} from "../../../features/review/reviewSlice";
import "../style/productDetail.style.css";

const ReviewSection = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.user);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getProductReviews(productId));
  }, [dispatch, productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview({ productId, rating, comment }));
    setComment("");
    setRating(5);
    setShowForm(false);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(reviewId));
    }
  };

  const StarRating = ({ value, onChange }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= value ? "selected" : ""}`}
            onClick={() => onChange && onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="review-section">
      <div className="review-header">
        <h4>REVIEWS</h4>
        {user && !showForm && (
          <Button
            variant="outline-dark"
            className="write-review-btn"
            onClick={() => setShowForm(true)}
          >
            WRITE A REVIEW
          </Button>
        )}
      </div>

      {user && showForm && (
        <div className="review-form-container">
          <Form onSubmit={handleSubmit}>
            <div className="rating-container">
              <Form.Label>Your Rating</Form.Label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                required
                className="review-textarea"
              />
            </Form.Group>

            <div className="review-form-actions">
              <Button
                variant="outline-secondary"
                onClick={() => setShowForm(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="dark" type="submit" disabled={loading}>
                Post Review
              </Button>
            </div>
          </Form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <div className="review-info">
                <h5 className="reviewer-name">{review.userId.name}</h5>
                <StarRating value={review.rating} />
              </div>
              <div className="review-actions">
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                {user && user._id === review.userId._id && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(review._id)}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <p className="review-content">{review.comment}</p>
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="no-reviews">Be the first to review this product</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
