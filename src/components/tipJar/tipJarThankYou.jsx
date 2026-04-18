import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingContext from "../../context/loadingContext";
import DualNavLink from "../common/pageSections/dualNavLink";

const TipJarThankYou = () => {
  const { setLoading, user } = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="centered-page-container" style={{ marginTop: "-5px" }}>
      <div className="pop-box centered-page-box">
        <img
          src="assets/usb_p_logo.png"
          alt="Dosshouse logo"
          width={50}
          height={50}
          className="centered-page-logo"
        />
        <h2 className="centered-page-title">
          Thanks for the tip{user?.name ? `, ${user.name}` : ""}!
        </h2>
        <p className="centered-page-message">
          Your support means a lot and helps keep the site running.
        </p>
        <DualNavLink
          left={{ label: "My Submissions", onClick: () => navigate("/submissions") }}
          right={{ label: "Competitions", onClick: () => navigate("/competitions"), back: false }}
        />
      </div>
    </div>
  );
};

export default TipJarThankYou;
