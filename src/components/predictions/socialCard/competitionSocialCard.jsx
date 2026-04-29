import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getActiveCompetitions,
  getExpiredCompetitions,
} from "../../../services/competitionService";
import LoadingContext from "../../../context/loadingContext";

function fmt(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const s = {
  page: {
    background: "#0f0020",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: 540,
    background:
      "linear-gradient(160deg, #1a0040 0%, #3d0080 40%, #831fe0 75%, #b060ff 100%)",
    borderRadius: 28,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "36px 44px",
    color: "#fff",
    fontFamily: "'Segoe UI', Inter, Arial, sans-serif",
    boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
    gap: 20,
    containerType: "inline-size",
  },
  appName: {
    fontSize: "clamp(10px, 2.5cqw, 14px)",
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    opacity: 0.65,
    textAlign: "center",
    width: "100%",
    whiteSpace: "nowrap",
  },
  hero: {
    textAlign: "center",
    width: "100%",
    containerType: "inline-size",
  },
  logo: {
    width: 28,
    height: 28,
    objectFit: "contain",
    borderRadius: 6,
    flexShrink: 0,
  },
  compName: {
    fontSize: "clamp(20px, 11.5cqw, 52px)",
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: -1,
    wordBreak: "break-word",
    textShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  dates: {
    fontSize: "clamp(12px, 5cqw, 22px)",
    fontWeight: 600,
    opacity: 0.85,
    marginTop: 12,
    whiteSpace: "nowrap",
  },
  deadline: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 6,
  },
  freeBadgeWrap: {
    width: "calc(100% + 66px)",
    marginLeft: -33,
    marginRight: -33,
    containerType: "inline-size",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  freeBadge: {
    background: "#eeccff",
    color: "#831fe0",
    fontSize: "clamp(12px, 6.5cqw, 28px)",
    fontWeight: 900,
    letterSpacing: 3,
    padding: "14px 20px",
    borderRadius: 60,
    textTransform: "uppercase",
    boxShadow: "0 6px 30px rgba(0,200,117,0.4)",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    gap: 12,
  },
  groupsCallout: {
    background: "rgba(255,255,255,0.1)",
    border: "1.5px solid rgba(255,255,255,0.22)",
    borderRadius: 18,
    padding: "24px 32px",
    textAlign: "center",
    width: "100%",
  },
  groupsIcon: {
    fontSize: 40,
    display: "block",
    marginBottom: 8,
  },
  groupsTitle: {
    fontSize: 24,
    fontWeight: 800,
  },
  groupsSub: {
    fontSize: 17,
    opacity: 0.8,
    marginTop: 4,
  },
  features: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  featureItem: {
    fontSize: 18,
    fontWeight: 600,
    opacity: 0.9,
  },
  secondChance: {
    background: "rgba(255,215,0,0.1)",
    border: "1.5px solid rgba(255,215,0,0.35)",
    borderRadius: 14,
    padding: "20px 28px",
    width: "100%",
  },
  scLabel: {
    fontSize: 18,
    fontWeight: 800,
    display: "block",
    marginBottom: 4,
  },
  scDate: {
    fontSize: 14,
    opacity: 0.8,
  },
};

const CompetitionSocialCard = () => {
  const { setLoading } = useContext(LoadingContext);
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [competition, setCompetition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
    if (!code) {
      setError("No competition code provided");
      setLoading(false);
      return;
    }
    async function load() {
      let res = await getActiveCompetitions();
      let found = (res?.data || []).find((c) => c.code === code);
      if (!found) {
        res = await getExpiredCompetitions();
        found = (res?.data || []).find((c) => c.code === code);
      }
      if (found) setCompetition(found);
      else setError("Competition not found");
      setLoading(false);
    }
    load();
  }, [code]);

  if (error) return <div style={{ color: "#fff", padding: 40 }}>{error}</div>;
  if (!competition) return null;

  const {
    name,
    competitionStart,
    competitionEnd,
    submissionDeadline,
    miscPicks,
    secondChance,
  } = competition;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.appName}>Ultimate Scoreboard Picker</div>

        <div style={s.hero}>
          <div style={s.compName}>{name.toUpperCase()}</div>
          <div style={s.dates}>
            {fmt(competitionStart)} - {fmt(competitionEnd)}
          </div>
          <div style={s.deadline}>
            Entry deadline: {fmt(submissionDeadline)}
          </div>
        </div>

        <div style={s.freeBadgeWrap}>
          <div style={{ ...s.freeBadge, justifyContent: "space-between", width: "100%" }}>
            <img src="/assets/usb_p_logo.png" alt="" style={s.logo} />
            <img src="/assets/usb_p_logo.png" alt="" style={s.logo} />
          </div>
        </div>

        <div style={s.groupsCallout}>
          <span style={s.groupsIcon}>👥</span>
          <div style={s.groupsTitle}>Create Groups &amp; Pools</div>
          <div style={s.groupsSub}>
            Compete with friends, family &amp; co-workers
          </div>
        </div>

        <div style={s.features}>
          <div style={s.featureItem}>
            ⚽ Pick group standings &amp; every knockout match
          </div>
          {miscPicks?.length > 0 && (
            <div
              style={{
                ...s.featureItem,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <span style={{ whiteSpace: "nowrap", marginRight: 4 }}>
                🎯 Bonus picks:
              </span>
              <span>{miscPicks.map((p) => p.label).join(", ")}</span>
            </div>
          )}
          <div style={s.featureItem}>
            🔴 Live leaderboard updates as matches are played
          </div>
        </div>

        {secondChance && (
          <div style={s.secondChance}>
            <span style={s.scLabel}>⚡ Second Chance Entry</span>
            <span style={s.scDate}>
              Available {fmt(secondChance.availableFrom)} - deadline{" "}
              {fmt(secondChance.submissionDeadline)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionSocialCard;
