import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, Alert } from "react-bootstrap";
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
  const [stockWarning, setStockWarning] = useState(false);
  const [currentQty, setCurrentQty] = useState(item.qty);
  const currentStock = item.productId.stock[item.size] || 0;

  // Check if current quantity exceeds available stock
  useEffect(() => {
    if (currentStock < currentQty) {
      setStockWarning(true);
      // Optionally auto-adjust the quantity to max available
      // setCurrentQty(currentStock);
    } else {
      setStockWarning(false);
    }
  }, [currentStock, currentQty, item]);

  const handleDelete = () => {
    setShowConfirmModal(false);
    dispatch(deleteCartItem(item._id));
  };

  const handleQtyChange = (newQty) => {
    const updatedQty = parseInt(newQty);
    setCurrentQty(updatedQty);
    dispatch(
      updateCartItemQty({
        itemId: item._id,
        qty: updatedQty,
      })
    ).then(() => {
      // Update warning state after quantity change
      setStockWarning(currentStock < updatedQty);
    });
  };

  const getQuantityOptions = () => {
    const maxStock = currentStock;
    const options = [];
    // 현재 선택된 수량이 재고보다 많은 경우에도 현재 수량을 포함
    const maxQty = Math.max(currentQty, Math.min(maxStock, 10));

    for (let i = 1; i <= maxQty; i++) {
      options.push(
        <option
          key={i}
          value={i}
          disabled={i > maxStock} // 재고보다 큰 수량은 비활성화
        >
          {i} {i > maxStock ? "(Out of Stock)" : ""}
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
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h4 className="mb-0">{item.productId.name}</h4>
              <button
                className="trash-button border-0 bg-transparent"
                onClick={() => setShowConfirmModal(true)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="mb-1">
              <strong>{currencyFormat(item.productId.price, "USD")}</strong>
            </div>
            <div className="text-muted mb-1">Size: {item.size}</div>

            {stockWarning && (
              <Alert variant="warning" className="py-2 mb-2">
                <small>
                  Currently only {currentStock} items available in stock.
                  {currentStock > 0
                    ? " Please adjust quantity or remove item to checkout."
                    : " Please remove item to checkout."}
                </small>
              </Alert>
            )}
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center">
                <span className="me-2">Quantity:</span>
                <Form.Select
                  value={currentQty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className="qty-dropdown"
                  style={{ width: "80px" }}
                  isInvalid={stockWarning}
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
            </div>
          </Col>
          <Col md={3} xs={12} className="text-md-end mt-3 mt-md-0">
            <div className="fw-bold">
              Total: {currencyFormat(item.productId.price * currentQty, "USD")}
            </div>
          </Col>
        </Row>
      </div>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove this item from your cart?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartProductCard;
