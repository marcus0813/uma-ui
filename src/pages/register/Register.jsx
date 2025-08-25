import "./Register.css";
import Header from "../../components/ui/header/Header";
import Footer from "../../components/ui/footer/Footer";
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API_ENDPOINTS from "../../services/api/apiEndpoints";
import useAxiosFetch from "../../hooks/useAxiosPublicFetch";
import { validateName, validateEmail, validatePassword } from "../../utils/regexValidators";

const Register = () => {
  const title = "Register";
  const redirectPath = "Login";
  const { POST, statusCode, data, errorMessage } = useAxiosFetch();

  const userRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = validateName(firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = validateName(lastName);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = validatePassword(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    const result = validateEmail(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, password, matchPassword, email]);

  useEffect(() => {
    if (statusCode == 200) {
      setSuccess(true);
      setFirstName("");
      setLastName("");
      setPassword("");
      setMatchPassword("");
      setEmail("");
      setErrMsg("");
    } else {
      setErrMsg(errorMessage);
      errRef.current.focus();
    }
  }, [statusCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstNameValid = validateName(firstName);
    const lastNameValid = validateName(lastName);
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!firstNameValid || !lastNameValid || !emailValid || !validMatch || !passwordValid) {
      setErrMsg("Invalid Entry");
      return;
    }

    let payload = JSON.stringify({ firstName, lastName, email, password });
    await POST(API_ENDPOINTS.user.profile, payload);
  };

  return (
    <div className="app-container">
      <section className="register-section">
        <p ref={errRef} className={errMsg ? "errmsg" : "hidden"} aria-live="assertive">
          {errMsg}
        </p>

        {success ? (
          <div className="text-center">
            <h1 className="heading-primary">Success!</h1>
            <p className="secondary-text">
              You have successfully registered.
              <br />
            </p>
            <Footer redirectPath={redirectPath} />
          </div>
        ) : (
          <>
            <Header title={title} />
            <br />
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName" className="label-text">
                  First Name <span style={{ color: "red" }}></span>:
                  <FontAwesomeIcon icon={faCheck} className={validFirstName ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validFirstName || !firstName ? "hide" : "invalid"} />
                </label>
                <input
                  type="text"
                  id="firstName"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  required
                  aria-invalid={validFirstName ? "false" : "true"}
                  aria-describedby="firstNameNote"
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                />
                <p
                  id="firstNameNote"
                  className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  2 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Only Letters are allowed
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="label-text">
                  Last Name<span style={{ color: "red" }}></span>:
                  <FontAwesomeIcon icon={faCheck} className={validLastName ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validLastName || !lastName ? "hide" : "invalid"} />
                </label>
                <input
                  type="text"
                  id="lastName"
                  autoComplete="off"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  required
                  aria-invalid={validLastName ? "false" : "true"}
                  aria-describedby="lastNameNote"
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                />
                <p
                  id="lastNameNote"
                  className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  2 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Only Letters are allowed
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="label-text">
                  Email<span style={{ color: "red" }}></span>:
                  <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="emailNote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p id="emailNote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must be a valid email format.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="label-text">
                  Password<span style={{ color: "red" }}></span>:
                  <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                  <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  aria-invalid={validPassword ? "false" : "true"}
                  aria-describedby="passwordnote"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <p id="passwordnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters and a number.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password" className="label-text">
                  Confirm Password<span style={{ color: "red" }}></span>:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validMatch && matchPassword && password ? "valid" : "hide"}
                  />
                  <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? "hide" : "invalid"} />
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  onChange={(e) => setMatchPassword(e.target.value)}
                  value={matchPassword}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={!validFirstName || !validLastName || !validEmail || !validPassword || !validMatch}
              >
                Register
              </button>
            </form>
            <Footer redirectPath={redirectPath} />
          </>
        )}
      </section>
    </div>
  );
};

export default Register;
