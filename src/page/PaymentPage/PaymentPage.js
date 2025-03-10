import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.order);

  const [cardValue, setCardValue] = useState({
    cvc: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });

  const [shipInfo, setShipInfo] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, contact, address, city, zip } = shipInfo;
    dispatch(
      createOrder({
        navigate,
        orderData: {
          totalPrice,
          contact: `${firstName} ${lastName} ${contact}`, // Combine all contact info into one string
          shipTo: `${address} ${city} ${zip}`,
          orderList: cartList.map((item) => {
            return {
              productId: item.productId._id,
              price: item.productId.price,
              size: item.size,
              qty: item.qty,
            };
          }),
        },
      })
    );
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setShipInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (event) => {
    const { name, value } = event.target;
    if (name === "expiry") {
      const formattedValue = cc_expires_format(value);
      setCardValue((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setCardValue((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInputFocus = (e) => {
    setCardValue((prev) => ({ ...prev, focus: e.target.name }));
  };

  return (
    <Container>
      <Row>
        <Col lg={7}>
          <div>
            <h2 className="mb-2">Shipping Address</h2>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="tel"
                  name="contact"
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="city"
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control
                    name="zip"
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Row>

              <div className="mobile-receipt-area">
                <OrderReceipt />
              </div>

              <div>
                <h2 className="payment-title">Payment Information</h2>
                <PaymentForm
                  cardValue={cardValue}
                  handleInputFocus={handleInputFocus}
                  handlePaymentInfoChange={handlePaymentInfoChange}
                />
              </div>

              <Button
                variant="dark"
                className="payment-button pay-button"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Pay Now"}
              </Button>
            </Form>
          </div>
        </Col>
        <Col lg={5} className="receipt-area">
          <OrderReceipt />
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
