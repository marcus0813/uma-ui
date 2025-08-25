import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = ({ redirectPath }) => {
  return redirectPath == "Register" ? (
    <p className="secondary-text text-center">
      Don't have account?
      <br />
      <Link to="/register" className="redirect-link">
        Register Now!
      </Link>
    </p>
  ) : (
    redirectPath == "Login" && (
      <p className="secondary-text text-center">
        Already have an account?
        <br />
        <Link to="/" className="redirect-link">
          Login Now!
        </Link>
      </p>
    )
  );
};

export default Footer;
