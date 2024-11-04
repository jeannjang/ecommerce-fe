// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { useNavigate } from "react-router";
// import { useSelector, useDispatch } from "react-redux";
// import OrderReceipt from "./component/OrderReceipt";
// import PaymentForm from "./component/PaymentForm";
// import "./style/paymentPage.style.css";
// import { cc_expires_format } from "../../utils/number";
// import { createOrder } from "../../features/order/orderSlice";

// const PaymentPage = () => {
//   const dispatch = useDispatch();
//   const { orderNum } = useSelector((state) => state.order);
//   const { cartList, totalPrice } = useSelector((state) => state.cart);
//   const [cardValue, setCardValue] = useState({
//     cvc: "",
//     expiry: "",
//     focus: "",
//     name: "",
//     number: "",
//   });
//   const navigate = useNavigate();
//   const [firstLoading, setFirstLoading] = useState(true);
//   const [shipInfo, setShipInfo] = useState({
//     firstName: "",
//     lastName: "",
//     contact: "",
//     address: "",
//     city: "",
//     zip: "",
//   });
//   console.log(shipInfo);

//   useEffect(() => {
//     // 오더번호를 받으면 어디로 갈까?
//   }, [orderNum]);

//   // 오더 생성
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const { firstName, lastName, contact, address, city, zip } = shipInfo;
//     dispatch(
//       createOrder({
//         totalPrice,
//         constact: { firstName, lastName, contact },
//         shipTo: { address, city, zip },
//         OrderList: cartList.map((item) => {
//           return {
//             productId: item.productId._id,
//             price: item.productId.price,
//             size: item.size,
//             qty: item.qty,
//           };
//         }),
//       })
//     );
//   };

//   const handleFormChange = (event) => {
//     //shipInfo에 값 넣기
//     const { name, value } = event.target;
//     setShipInfo({ ...shipInfo, [name]: value });
//   };

//   const handlePaymentInfoChange = (event) => {
//     //카드정보 입력 using react-credit-cards with numbers.js
//     const { name, value } = event.target;
//     if (name === "expiry") {
//       const formattedValue = cc_expires_format(value);
//       setCardValue({ ...cardValue, [name]: formattedValue });
//     } else {
//       setCardValue({ ...cardValue, [name]: value });
//     }
//   };

//   const handleInputFocus = (e) => {
//     setCardValue({ ...cardValue, focus: e.target.name });
//   };

//   return (
//     <Container>
//       <Row>
//         <Col lg={7}>
//           <div>
//             <h2 className="mb-2">배송 주소</h2>
//             <div>
//               <Form onSubmit={handleSubmit}>
//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="lastName">
//                     <Form.Label>성</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={handleFormChange}
//                       required
//                       name="lastName"
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="firstName">
//                     <Form.Label>이름</Form.Label>
//                     <Form.Control
//                       type="text"
//                       onChange={handleFormChange}
//                       required
//                       name="firstName"
//                     />
//                   </Form.Group>
//                 </Row>

//                 <Form.Group className="mb-3" controlId="formGridAddress1">
//                   <Form.Label>연락처</Form.Label>
//                   <Form.Control
//                     placeholder="010-xxx-xxxxx"
//                     onChange={handleFormChange}
//                     required
//                     name="contact"
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formGridAddress2">
//                   <Form.Label>주소</Form.Label>
//                   <Form.Control
//                     placeholder="Apartment, studio, or floor"
//                     onChange={handleFormChange}
//                     required
//                     name="address"
//                   />
//                 </Form.Group>

//                 <Row className="mb-3">
//                   <Form.Group as={Col} controlId="formGridCity">
//                     <Form.Label>City</Form.Label>
//                     <Form.Control
//                       onChange={handleFormChange}
//                       required
//                       name="city"
//                     />
//                   </Form.Group>

//                   <Form.Group as={Col} controlId="formGridZip">
//                     <Form.Label>Zip</Form.Label>
//                     <Form.Control
//                       onChange={handleFormChange}
//                       required
//                       name="zip"
//                     />
//                   </Form.Group>
//                 </Row>
//                 <div className="mobile-receipt-area">
//                   <OrderReceipt />
//                 </div>
//                 <div>
//                   <h2 className="payment-title">결제 정보</h2>
//                   <PaymentForm
//                     cardValue={cardValue}
//                     handleInputFocus={handleInputFocus}
//                     handlePaymentInfoChange={handlePaymentInfoChange}
//                   />
//                 </div>

//                 <Button
//                   variant="dark"
//                   className="payment-button pay-button"
//                   type="submit"
//                 >
//                   결제하기
//                 </Button>
//               </Form>
//             </div>
//           </div>
//         </Col>
//         <Col lg={5} className="receipt-area">
//           <OrderReceipt />
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default PaymentPage;

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OrderReceipt from "./component/OrderReceipt";
import PaymentForm from "./component/PaymentForm";
import "./style/paymentPage.style.css";
import { cc_expires_format } from "../../utils/number";
import { createOrder } from "../../features/order/orderSlice";
import { size } from "@cloudinary/url-gen/qualifiers/textFit";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartList, totalPrice } = useSelector((state) => state.cart);
  const { loading, orderNum } = useSelector((state) => state.order);

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

  // 주문번호가 생성되면 주문완료 페이지로 이동
  useEffect(() => {
    if (orderNum) {
      navigate("/payment/success");
    }
  }, [orderNum, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { firstName, lastName, contact, address, city, zip } = shipInfo;
    dispatch(
      createOrder({
        totalPrice,
        contact: `${firstName} ${lastName} ${contact}`, // 문자열로 연결
        shipTo: `${address} ${city} ${zip}`, // 문자열로 연결
        orderList: cartList.map((item) => {
          // OrderList -> orderList로 수정
          return {
            productId: item.productId._id,
            price: item.productId.price,
            size: item.size,
            qty: item.qty,
          };
        }),
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
