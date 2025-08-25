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
  const title = "Login";
  const redirectPath = "Register";
  const { POST, statusCode, data, errorMessage } = useAxiosPublicFetch();
  const navigate = useNavigate();

  const { auth, setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const emailValid = validateEmail(email);
    setValidEmail(emailValid);
    setErrMsg("");
  }, [email, password]);

  useEffect(() => {
    //Redirecting to profile page after success
    if (statusCode == 200 && data) {
      //Empty the state whenever API is called
      setEmail("");
      setPassword("");

      //Decode access token
      const decodedToken = jwtDecode(data);
      //Get User ID
      const userID = decodedToken.sub;
      //Set to global state
      setAuth({ email, userID, data });
      //Set for refresh token
    } else {
      setErrMsg(errorMessage);
      errRef.current.focus();
      navigate("/");
    }
  }, [statusCode, data]);

  useEffect(() => {
    if (auth?.userID && auth?.data)
      //Redirect to profile page
      navigate(`/${auth.userID}`);
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    //prevent refresh
    e.preventDefault();

    //check email format is valid
    const emailValid = validateEmail(email);
    setValidEmail(emailValid);

    //Set request body params
    var payload = JSON.stringify({ email, password });

    //Login user
    await POST(API_ENDPOINTS.login, payload);
  };

  return (
    <div className="app-container">
      <section className="login-section">
        <p ref={errRef} className={errMsg ? "errmsg" : "hidden"} aria-live="assertive">
          {errMsg}
        </p>

        <Header title={title} />
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
