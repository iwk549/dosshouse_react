import TextLink from "../../common/pageSections/textLink";

const DualNavLink = ({ left, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", margin: "0 10px" }}>
    <div>
      {left && (
        <TextLink className={left.back !== false ? "text-link-back" : undefined} onClick={left.onClick}>
          {left.label}
        </TextLink>
      )}
    </div>
    <div>
      {right && (
        <TextLink onClick={right.onClick}>
          {right.label}
        </TextLink>
      )}
    </div>
  </div>
);

export default DualNavLink;
