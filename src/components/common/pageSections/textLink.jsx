const TextLink = ({ children, onClick }) => (
  <button className="text-link" onClick={onClick}>
    {children}
  </button>
);

export default TextLink;
