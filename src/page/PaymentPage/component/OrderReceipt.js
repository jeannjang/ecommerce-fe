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
        <p>가능한 결제 수단</p>
        <p>
          귀하가 결제 단계에 도달할 때까지 가격 및 배송료는 확인되지 않습니다.
        </p>
        <p>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          안내
        </p>
      </div>
    </div>
  );
};

export default OrderReceipt;
