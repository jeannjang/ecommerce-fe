import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser, clearErrors } from "../../features/user/userSlice";

import "./style/register.style.css";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    policy: false,
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [policyError, setPolicyError] = useState(false);

  const { registrationError, loading: userSliceLoading } = useSelector(
    (state) => state.user
  );

  const register = (event) => {
    event.preventDefault();
    dispatch(clearErrors());

    const { name, email, password, confirmPassword, policy } = formData;
    const checkConfirmPassword = password === confirmPassword;
    if (!checkConfirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (!policy) {
      setPolicyError(true);
      return;
    }
    setPasswordError("");
    setPolicyError(false);

    dispatch(registerUser({ name, email, password, navigate }));
  };

  const handleChange = (event) => {
    event.preventDefault();
    let { id, value, type, checked } = event.target;
    if (id === "confirmPassword" && passwordError) setPasswordError("");
    if (type === "checkbox") {
      if (policyError) setPolicyError(false);
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  return (
    <Container className="register-area">
      {registrationError && (
        <div>
          <Alert variant="danger" className="error-message">
            {registrationError}
          </Alert>
        </div>
      )}
      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Label>E-MAIL</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="E-MAIL"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>NAME</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="NAME"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>PASSWORD</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="PASSWORD"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>CONFIRM PASSWORD</Form.Label>
          <Form.Control
            type="password"
            id="confirmPassword"
            placeholder="CONFIRM PASSWORD"
            onChange={handleChange}
            required
            isInvalid={passwordError}
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="I agree to all terms"
            id="policy"
            onChange={handleChange}
            isInvalid={policyError}
            checked={formData.policy}
          />
        </Form.Group>
        <Button variant="danger" type="submit" disabled={userSliceLoading}>
          {userSliceLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "SIGN UP"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
