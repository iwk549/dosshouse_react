import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import LoadingContext from "../../context/loadingContext";
import { getActiveCompetitions, getExpiredCompetitions } from "../../services/competitionService";
import { calculateCompetition } from "../../services/resultsService";
import StatusNote from "../common/pageSections/statusNote";
import Confirm from "../common/modal/confirm";

const AdminTools = () => {
  const { setLoading } = useContext(LoadingContext);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [activeRes, expiredRes] = await Promise.all([
        getActiveCompetitions(),
        getExpiredCompetitions(),
      ]);
      const active = activeRes?.status === 200 ? activeRes.data : [];
      const expired = expiredRes?.status === 200 ? expiredRes.data : [];
      const all = [...active, ...expired];
      setCompetitions(all);
      if (all.length > 0) setSelectedCode(all[0].code);
      setLoading(false);
    };
    load();
  }, []);

  const selectedCompetition = competitions.find((c) => c.code === selectedCode);
  const isComplete =
    selectedCompetition && new Date(selectedCompetition.competitionEnd) < new Date();

  const handleCalculateClick = () => {
    if (!selectedCode) return;
    if (isComplete) return setConfirmOpen(true);
    runCalculation();
  };

  const runCalculation = async () => {
    setLoading(true);
    setLastResult(null);
    const res = await calculateCompetition(selectedCode);
    if (res?.status === 200) {
      toast.success(`Calculation complete for ${selectedCode}`);
      setLastResult({ ok: true, data: res.data });
    } else {
      toast.error(res?.data || "Calculation failed");
      setLastResult({ ok: false, data: res?.data });
    }
    setLoading(false);
  };

  return (
    <div>
      <p style={{ marginBottom: "16px" }}>
        Trigger score recalculation for a competition. This runs{" "}
        <code>POST /results/calculate/:code</code>.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <select
          className="form-select"
          style={{ maxWidth: "320px" }}
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
        >
          {competitions.length === 0 && (
            <option value="">No competitions found</option>
          )}
          {competitions.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
        <button
          className="btn btn-dark"
          onClick={handleCalculateClick}
          disabled={!selectedCode}
        >
          Calculate
        </button>
      </div>
      {lastResult && !lastResult.ok && (
        <div style={{ marginTop: "16px" }}>
          <StatusNote>
            <strong>Error:</strong>{" "}
            {typeof lastResult.data === "string"
              ? lastResult.data
              : JSON.stringify(lastResult.data, null, 2)}
          </StatusNote>
        </div>
      )}
      <Confirm
        header="Competition Complete"
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        onConfirm={runCalculation}
        buttonText={["Cancel", "Calculate"]}
        focus="cancel"
      >
        <p>
          <strong>{selectedCompetition?.name}</strong> has already ended. Are
          you sure you want to recalculate?
        </p>
      </Confirm>
    </div>
  );
};

export default AdminTools;
