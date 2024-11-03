import React, { useState } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  deleteCartItem,
  updateCartItemQty,
} from "../../../features/cart/cartSlice";
import { Form } from "react-bootstrap";

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
        <Row>
          <Col md={2} xs={12}>
            <img src={item.productId.image} width={112} alt="product" />
          </Col>
          <Col md={10} xs={12}>
            <div className="display-flex space-between">
              <h3>{item.productId.name}</h3>
              <button
                className="trash-button"
                onClick={() => setShowConfirmModal(true)}
              >
                <FontAwesomeIcon icon={faTrash} width={24} />
              </button>
            </div>
            <div>
              <strong>{currencyFormat(item.productId.price, "USD")}</strong>
            </div>
            <div>Size: {item.size}</div>
            <div>
              Total: {currencyFormat(item.productId.price * item.qty, "USD")}
            </div>
            <div className="quantity-selector">
              Quantity:
              <Form.Select
                value={item.qty}
                onChange={(e) => handleQtyChange(e.target.value)}
                className="qty-dropdown"
              >
                {getQuantityOptions()}
              </Form.Select>
            </div>
          </Col>
        </Row>
      </div>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you do not want to keep this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            No, Keep it
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CartProductCard;
