import "./Login.css";
import Header from "../../components/ui/header/Header";
import Footer from "../../components/ui/footer/Footer";
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthProvider.js";
import API_ENDPOINTS from "../../services/api/apiEndpoints.js";
import useAxiosPublicFetch from "../../hooks/useAxiosPublicFetch.js";
import { validateEmail } from "../../utils/regexValidators";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const title = "Welcome to UMA!!!";
  const redirectPath = "Register";
  const { POST, statusCode, data, errorMessage } = useAxiosPublicFetch();
  const navigate = useNavigate();

  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Use a separate state for email validation status
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Effect to validate email as user types
  useEffect(() => {
    const emailValid = validateEmail(email);
    setValidEmail(emailValid);
    // Clear the error message related to email validation
    if (errMsg && emailValid) {
      setErrMsg("");
    }
  }, [email]);

  // Handle API response and redirect
  useEffect(() => {
    if (statusCode === 200 && data) {
      // Decode access token
      const decodedToken = jwtDecode(data);
      // Get User ID
      const userID = decodedToken.sub;
      // Set to global state
      setAuth({ email, userID, accessToken: data });
      // Redirect to profile page
      navigate(`/${userID}`);
    } else if (errorMessage) {
      setErrMsg(errorMessage);
      errRef.current.focus();
    }
  }, [statusCode, data, errorMessage, setAuth, navigate, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error message on new submission attempt
    setErrMsg("");

    // Check email format is valid before making the API call
    if (!validateEmail(email)) {
      setErrMsg("Kindly input a valid email.");
      return;
    }

    // Set request body params
    const payload = JSON.stringify({ email, password });

    // Login user
    await POST(API_ENDPOINTS.login, payload);
  };

  return (
    <div className="app-container">
      <section className="login-section">
        <p ref={errRef} className={errMsg ? "errmsg" : "hidden"} aria-live="assertive">
          {errMsg}
        </p>

        <Header title={title} />
        <h3 style={{ textAlign: "center" }}>Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="label-text">
              Email:
            </label>
            <input
              type="email"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              placeholder="user@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="label-text">
              Password:
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              placeholder="Password"
            />
          </div>
          <button className="login-button" disabled={!validEmail || !password}>
            Login
          </button>
        </form>
        <Footer redirectPath={redirectPath} />
      </section>
    </div>
  );
};

export default Login;
