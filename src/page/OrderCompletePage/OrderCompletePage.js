import React from "react";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
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
      <h3>Cheers! Your order is complete.</h3>
      <div>Order Number: {orderNum}</div>
      <div>
        You can view your order details anytime under ‘My Orders' page.
        <div className="text-align-center">
          <Link to={"/account/purchase"} className="text-decoration-none">
            Go to <FontAwesomeIcon icon={faBox} />
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderCompletePage;
