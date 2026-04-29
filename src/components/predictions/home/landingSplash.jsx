import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Free to Play",
    description: "No cost to enter. Start making picks immediately.",
  },
  {
    title: "Compete With Friends",
    description:
      "Create a private group, share the link, and see how your predictions stack up.",
  },
  {
    title: "Live Leaderboard",
    description:
      "Track standings in real time as the tournament plays out, and check out the what-if view.",
  },
  {
    title: "Second Chance",
    description:
      "Missed the deadline? Some competitions offer a second-chance entry once group play ends.",
  },
];

const s = {
  splash: {
    maxWidth: 900,
    margin: "0 auto 16px",
    padding: "0 16px",
  },
  hero: {
    background: "linear-gradient(135deg, #831fe0 0%, #cc66ff 100%)",
    borderRadius: 10,
    padding: "28px 24px",
    textAlign: "center",
    color: "#f2f2f2",
    marginBottom: 10,
    boxShadow: "2px 2px 10px #dd99ff",
  },
  title: {
    fontSize: "1.8em",
    fontWeight: 800,
    margin: "0 0 10px",
    letterSpacing: "0.02em",
  },
  subtitle: {
    fontSize: "0.95em",
    opacity: 0.9,
    margin: "0 auto 20px",
    maxWidth: 500,
    lineHeight: 1.5,
  },
  featureCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: "10px 14px",
    boxShadow: "2px 2px 8px #dd99ff",
    borderTop: "3px solid #831fe0",
  },
  featureTitle: {
    fontWeight: 700,
    fontSize: "0.9em",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: "0.82em",
    color: "#555555",
    lineHeight: 1.45,
  },
};

const gridCss = `
  .landing-splash-features {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  @media (min-width: 480px) {
    .landing-splash-features { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 800px) {
    .landing-splash-features { grid-template-columns: repeat(4, 1fr); }
  }
`;

const LandingSplash = ({ competitionID, competitionName }) => {
  const navigate = useNavigate();

  return (
    <>
      <style>{gridCss}</style>
      <div style={s.splash}>
        <div style={s.hero}>
          <h1 style={s.title}>Predict. Compete. Win.</h1>
          <p style={s.subtitle}>
            Make your tournament picks, challenge your friends, and follow the
            action live - completely free.
          </p>
          {competitionID && (
            <button
              className="btn btn-light btn-md"
              onClick={() =>
                navigate(`/submissions?id=new&competitionID=${competitionID}`)
              }
            >
              Get Started{competitionName ? `: ${competitionName}` : ""}
            </button>
          )}
        </div>
        <div className="landing-splash-features">
          {features.map((f) => (
            <div style={s.featureCard} key={f.title}>
              <div style={s.featureTitle}>{f.title}</div>
              <div style={s.featureDesc}>{f.description}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LandingSplash;
