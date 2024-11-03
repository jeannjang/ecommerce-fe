import React from "react";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartList());
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={12} md={7}>
          {cartList.length > 0 ? (
            cartList.map((item) => (
              <CartProductCard item={item} key={item._id} />
            ))
          ) : (
            <div className="text-align-center empty-bag text-muted mt-3">
              <h5>There’s nothing in your cart yet.</h5>
              <div>Add some products to get started!</div>
            </div>
          )}
        </Col>
        <Col xs={12} md={5}>
          <OrderReceipt />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
