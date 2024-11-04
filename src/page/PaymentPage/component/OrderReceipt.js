import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";

const OrderReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const isCartPage = location.pathname.includes("/cart");

  return (
    <div className="receipt-container">
      <h4 className="receipt-title">ORDER SUMMARY</h4>
      <ul className="receipt-list">
        {cartList.map((item) => (
          <li key={item._id} className="display-flex space-between">
            <div>
              {item.productId.name} ({item.size}) x {item.qty}
            </div>
            <div>{currencyFormat(item.productId.price * item.qty)}</div>
          </li>
        ))}
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>{currencyFormat(totalPrice)}</strong>
        </div>
      </div>
      {isCartPage && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => navigate("/payment")}
        >
          Proceed to Checkout
        </Button>
      )}

      <div className="small text-muted mt-3">
        {/* <p>가능한 결제 수단</p> */}
        <p>Pricing and shipping costs are finalized during checkout.</p>
        <p>
          Our 30-day return policy applies. Return shipping fees and unclaimed
          package charges may apply.
        </p>
      </div>
    </div>
  );
};

export default OrderReceipt;
