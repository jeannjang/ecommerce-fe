import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import "./style/login.style.css";
import {
  loginWithEmail,
  loginWithGoogle,
  clearErrors,
} from "../../features/user/userSlice";
import { Spinner } from "react-bootstrap";

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    user,
    loginError,
    loading: userSliceLoading,
  } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // 컴포넌트 마운트시 에러 초기화
    dispatch(clearErrors());
  }, [dispatch]);

  // location.state.from이 있으면 해당 URL로, 없으면 홈으로 이동
  if (user) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  const handleLoginWithEmail = (event) => {
    event.preventDefault();
    dispatch(loginWithEmail({ email, password }));
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign In was unsuccessful.");
  };

  return (
    <Container className="login-area">
      {loginError && (
        <div className="error-message">
          <Alert variant="danger">{loginError}</Alert>
        </div>
      )}
      <Form className="login-form" onSubmit={handleLoginWithEmail}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>E-MAIL</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-MAIL"
            required
            onChange={(event) => setEmail(event.target.value)}
            disabled={userSliceLoading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>PASSWORD</Form.Label>
          <Form.Control
            type="password"
            placeholder="PASSWORD"
            required
            onChange={(event) => setPassword(event.target.value)}
            disabled={userSliceLoading}
          />
        </Form.Group>

        <div className="display-space-between login-button-area">
          <Button variant="danger" type="submit" disabled={userSliceLoading}>
            {userSliceLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "SIGN IN"
            )}
          </Button>
          <div>
            Need an account? <Link to="/register">SIGN UP</Link>
          </div>
        </div>

        <div className="text-align-center mt-4">
          <p className="text-muted">- OR -</p>
          <div className="display-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              locale="en"
              useOneTap={false}
            />
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
