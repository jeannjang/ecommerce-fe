import React, { useState } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  deleteCartItem,
  updateCartItemQty,
} from "../../../features/cart/cartSlice";

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDelete = () => {
    setShowConfirmModal(false);
    dispatch(deleteCartItem(item._id));
  };

  const handleQtyChange = (newQty) => {
    dispatch(
      updateCartItemQty({
        itemId: item._id,
        qty: parseInt(newQty),
      })
    );
  };

  const getQuantityOptions = () => {
    const maxStock = item.productId.stock[item.size] || 0;
    const options = [];
    for (let i = 1; i <= Math.min(maxStock, 10); i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <>
      <div className="product-card-cart">
        <Row className="align-items-center">
          <Col md={2} xs={12} className="mb-3 mb-md-0">
            <Link to={`/product/${item.productId._id}`}>
              <img
                src={item.productId.image}
                width={112}
                alt={item.productId.name}
                className="w-100"
              />
            </Link>
          </Col>
          <Col md={7} xs={12}>
            <div className="mb-2">
              <h4 className="mb-0">{item.productId.name}</h4>
            </div>
            <div className="mb-1">
              <strong>{currencyFormat(item.productId.price)}</strong>
            </div>
            <div className="text-muted mb-1">Size: {item.size}</div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                <span className="me-2">Quantity:</span>
                <Form.Select
                  value={item.qty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className="qty-dropdown"
                  style={{ width: "80px" }}
                >
                  {getQuantityOptions()}
                </Form.Select>
              </div>
              <Link
                to={`/product/${item.productId._id}`}
                className="text-decoration-none text-muted small"
              >
                View Details
              </Link>
              <button
                className="trash-button border-0 bg-transparent p-0"
                onClick={() => setShowConfirmModal(true)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </Col>
          <Col md={3} xs={12} className="text-md-end mt-3 mt-md-0">
            <div className="fw-bold">
              Total: {currencyFormat(item.productId.price * item.qty)}
            </div>
          </Col>
        </Row>
      </div>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Are you sure you don't want to keep this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            No, Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartProductCard;
