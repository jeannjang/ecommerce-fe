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
          contact: `${firstName} ${lastName} ${contact}`, // 문자열로 연결
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
            <h2 className="mb-2">배송 주소</h2>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="lastName">
                  <Form.Label>성</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="firstName">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>연락처</Form.Label>
                <Form.Control
                  type="tel"
                  name="contact"
                  placeholder="010-xxxx-xxxx"
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>주소</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>도시</Form.Label>
                  <Form.Control
                    name="city"
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>우편번호</Form.Label>
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
                <h2 className="payment-title">결제 정보</h2>
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
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "결제하기"
                )}
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
