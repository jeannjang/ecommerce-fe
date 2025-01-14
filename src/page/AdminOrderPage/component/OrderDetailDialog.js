import React, { useState } from "react";
import { Form, Modal, Button, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ORDER_STATUS } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";
import { updateOrder } from "../../../features/order/orderSlice";

const OrderDetailDialog = ({ open, handleClose }) => {
  const selectedOrder = useSelector((state) => state.order.selectedOrder);
  const [orderStatus, setOrderStatus] = useState(selectedOrder?.status);
  const dispatch = useDispatch();

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };

  const submitStatus = (event) => {
    event.preventDefault();
    dispatch(
      updateOrder({
        id: selectedOrder._id,
        status: orderStatus,
      })
    ).then((result) => {
      if (!result.error) {
        handleClose();
      }
    });
  };

  if (!selectedOrder) {
    return null;
  }
  const userEmail =
    selectedOrder.userId?.email || "This account has been deleted";

  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Order Number: {selectedOrder.orderNum}</p>
        <p>Order Date: {selectedOrder.createdAt.slice(0, 10)}</p>
        <p>Email: {userEmail}</p>
        <p>Address: {selectedOrder.shipTo}</p>
        <p>Contact: {selectedOrder.contact}</p>
        <p>Order Details</p>
        <div className="overflow-x">
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items?.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.productId.name}</td>
                  <td>{currencyFormat(item.price, "NZD")}</td>
                  <td>{item.qty}</td>
                  <td>{currencyFormat(item.price * item.qty, "NZD")}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4}>Total:</td>
                <td>{currencyFormat(selectedOrder.totalPrice, "NZD")}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <Form onSubmit={submitStatus}>
          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select value={orderStatus} onChange={handleStatusChange}>
              {ORDER_STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="order-button-area">
            <Button
              variant="light"
              onClick={handleClose}
              className="order-button"
            >
              Close
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetailDialog;
