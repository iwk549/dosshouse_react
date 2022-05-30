import React, { useState } from "react";

// import FormSelect from "../../common/form/select";
import { getFinalRound } from "../../../utils/bracketsUtil";
import logos from "../../../textMaps/logos";
import { renderSelectLabel } from "../../../utils/rendering";
import SingleMatchModal from "./singleMatchModal";
import TeamSelectComponent from "./teamSelectComponent";

const Miscellaneous = ({
  playoffMatches,
  misc,
  onChange,
  competition,
  allTeams,
  isLocked,
}) => {
  console.log(misc);
  const [matchModalOpen, setMatchModalOpen] = useState(false);

  const mappedTeams = allTeams
    .sort((a, b) => (a > b ? 1 : -1))
    .map((t) => {
      return { value: t, label: renderSelectLabel(t, true) };
    });
  const final = playoffMatches.find(
    (m) => m.round === getFinalRound(playoffMatches)
  );

  const getThirdPlacePlayoff = () => {
    const semiFinals = playoffMatches.filter(
      (m) => m.round === getFinalRound(playoffMatches) - 1
    );
    const thirdPlaceMatch = [];
    ["home", "away"].forEach((t) => {
      let losingTeam = "";
      const finalist = final[t + "TeamName"];
      if (finalist.toLowerCase().includes("winner")) {
        losingTeam = "Loser " + final.getTeamsFrom[t].matchNumber;
      } else {
        ["home", "away"].forEach((t1) => {
          const semiFinal = semiFinals.find(
            (m) => m[t1 + "TeamName"] === finalist
          );
          if (semiFinal) {
            losingTeam =
              semiFinal[(t1 === "home" ? "away" : "home") + "TeamName"];
          }
        });
      }
      thirdPlaceMatch.push({
        value: losingTeam,
        label: renderSelectLabel(losingTeam, true),
        logo: logos[losingTeam],
      });
    });
    return thirdPlaceMatch;
  };

  return (
    <div>
      {competition?.miscPicks.map((p) => (
        <React.Fragment key={p.name}>
          {/* <FormSelect
            name={p.name}
            label={p.label}
            boldHeader={true}
            onChange={(value) => {
              onChange(p.name, value);
            }}
            options={
              p.name === "thirdPlace" ? getThirdPlacePlayoff() : mappedTeams
            }
            selectedOption={misc[p.name]}
            tooltip={{
              direction: "right",
              content: (
                <span className="tooltip-content-mini">
                  <p>
                    <b>{p.label}</b>
                    <br />
                    {p.description}
                  </p>
                </span>
              ),
            }}
            isLocked={isLocked}
          /> */}
          <TeamSelectComponent
            teams={
              p.name === "thirdPlace" ? getThirdPlacePlayoff() : mappedTeams
            }
            title={p.label}
            onSelect={(value) => onChange(p.name, value)}
            isLocked={isLocked}
            selectedOption={misc[p.name]}
          >
            {p.name === "thirdPlace" && (
              <>
                <br />
                <button
                  className="btn btn-info"
                  onClick={() => setMatchModalOpen(true)}
                >
                  View Match Details
                </button>
                <SingleMatchModal
                  isOpen={matchModalOpen}
                  setIsOpen={setMatchModalOpen}
                  match={p.info}
                />
                <br />
              </>
            )}
          </TeamSelectComponent>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Miscellaneous;
