const TextLink = ({ children, onClick, className }) => (
  <button className={`text-link${className ? " " + className : ""}`} onClick={onClick}>
    {children}
  </button>
);

export default TextLink;
