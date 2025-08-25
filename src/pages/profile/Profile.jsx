import "./Profile.css";
import Header from "../../components/ui/header/Header";
import Footer from "../../components/ui/footer/Footer";
import DragAndDropPhoto from "../../components/DragAndDropPhoto";
import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../services/api/apiEndpoints";
import useAxiosPrivateFetch from "../../hooks/useAxiosPrivateFetch";
import { validateName, validatePassword } from "../../utils/regexValidators";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  const { GET, POST, PUT, statusCode, data, errorMessage } = useAxiosPrivateFetch();
  const { auth, setAuth } = useAuth();

  const [title, setTitle] = useState("");

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // New state for image uploader
  const [profilePicture, setProfilePicture] = useState(null);

  const [errMsg, setErrMsg] = useState("");
  const [updatedUserInfo, setUpdatedUserInfo] = useState(false);
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    //Always return to login if no valid token
    if (!auth?.data) navigate("/");

    userRef.current.focus();

    //Cancel request whenever componet unmount
    const controller = new AbortController();

    //get auth for token
    var userID = auth.userID;
    var email = auth.email;
    var url = `${API_ENDPOINTS.user.profile}?userid=${userID}&email=${email}`;

    const getUserInfo = async () => {
      await GET(url);
    };

    getUserInfo();

    return () => {
      controller.abort();
    };
  }, [auth]);

  useEffect(() => {
    const result = validateName(firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = validateName(lastName);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = password ? validatePassword(password) : true;
    setValidPassword(result);
    const match = password ? password === matchPassword : true;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
    setSuccess("");
  }, [firstName, lastName, password, matchPassword]);

  useEffect(() => {
    if (statusCode == 200) {
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
      setEmail(data.user.email);
      setTitle(`Hi, ${data.user.firstName} ${data.user.lastName}`);
      setProfilePicture(data.user.profilePictureUrl);
      setErrMsg("");
    } else if (statusCode == 401) {
      setAuth({});
    }
  }, [statusCode]);

  useEffect(() => {
    let timer;
    if (updatedUserInfo) {
      // Set a timer to reset the state back to false after 2 seconds
      timer = setTimeout(() => {
        setUpdatedUserInfo(false);
      }, 2000);
    }
    // Cleanup function to clear the timer if the component unmounts or state changes
    return () => clearTimeout(timer);
  }, [updatedUserInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstNameValid = validateName(firstName);
    const lastNameValid = validateName(lastName);

    let passwordValid = password ? validatePassword(password) : true;

    if (!firstNameValid || !lastNameValid || !passwordValid || !validMatch) {
      setErrMsg("Invalid Entry");
      return;
    }

    const userID = auth.userID;
    const updateProfileUrl = API_ENDPOINTS.user.profile;
    const updateProfilePayload = JSON.stringify({ userID, firstName, lastName, email, password });
    await PUT(updateProfileUrl, updateProfilePayload);
    if (statusCode !== 200) {
      setErrMsg(errorMessage);
      errRef.current.focus();
      return;
    }

    const updateProfilePictureUrl = API_ENDPOINTS.user.profile_picture;
    let profilePictureFormData = new FormData();
    profilePictureFormData.append("ProfilePicture", profilePicture);
    profilePictureFormData.append("UserID", auth.userID);
    profilePictureFormData.append("Email", auth.email);
    await POST(updateProfilePictureUrl, profilePictureFormData);
    if (statusCode !== 200) {
      setErrMsg("Failed to update profile picture");
      errRef.current.focus();
      return;
    }

    setSuccess(true);
  };

  const logout = async () => {
    setAuth({});
  };

  return (
    <div className="app-container">
      <section className="profile-section">
        <p ref={errRef} className={errMsg ? "errmsg" : "hidden"} aria-live="assertive">
          {errMsg}
        </p>
        {success && (
          <div className="text-center">
            <h1 className="heading-primary">Success!</h1>
            <p className="secondary-text">Your profile is updated!</p>
          </div>
        )}
        <>
          <Header title={title} />
          <br />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <DragAndDropPhoto
                profilePicture={profilePicture}
                setProfilePicture={setProfilePicture}
                setErrMsg={setErrMsg}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName" className="label-text">
                First Name:
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
            </div>
            <p
              id="firstNameNote"
              className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              2 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters
            </p>

            <div className="form-group">
              <label htmlFor="lastName" className="label-text">
                Last Name:
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
              <label className="label-text">Email:</label>
              {email}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label-text">
                Password:
                <FontAwesomeIcon icon={faCheck} className={validPassword && password ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
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
                <br />
                Allowed special characters: <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password" className="label-text">
                Confirm Password:
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
            <div className="button-container">
              <button
                type="submit"
                className="submit-button"
                disabled={!validFirstName || !validLastName || !validPassword || !validMatch}
              >
                Save
              </button>
              <button type="button" className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
          </form>
          <Footer />
        </>
      </section>
    </div>
  );
};

export default Profile;
