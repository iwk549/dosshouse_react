import { longDate } from "../../../utils/allowables";

const InfoLine = ({ label, value, type, testId }) => {
  const formatted = type === "date" ? longDate(value, true) : value;
  return (
    <div className="info-line">
      <span className="info-line-label">{label}</span>
      <span className="info-line-value" data-testid={testId}>
        {formatted}
      </span>
    </div>
  );
};

export default InfoLine;
