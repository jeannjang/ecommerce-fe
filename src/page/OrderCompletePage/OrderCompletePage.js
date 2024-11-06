import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../PaymentPage/style/paymentPage.style.css";
import { useLocation } from "react-router";

const OrderCompletePage = () => {
  const location = useLocation();
  const orderNum = location.state?.orderNum;

  if (!orderNum) {
    return (
      <Container className="confirmation-page">
        <h1>Order Unsuccessful.</h1>
        <div>
          Oops! Something went wrong. Please head back to the main page.
          <Link to={"/"}>Back to Main Page</Link>
        </div>
      </Container>
    );
  }
  return (
    <Container className="confirmation-page">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>Cheers! Your order is complete.</h2>
      <div>Order Number: {orderNum}</div>
      <div>
        You can view your order details anytime under ‘My Orders' page.
        <div className="text-align-center">
          <Link to={"/account/purchase"}>Go to My Orders</Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
