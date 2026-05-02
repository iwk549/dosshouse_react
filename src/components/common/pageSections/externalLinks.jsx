import IconRender from "../icons/iconRender";

const ExternalLinks = ({ links, className, testId }) => {
  if (!links?.length) return null;

  return (
    <div
      className={`external-links${className ? " " + className : ""}`}
      data-testid={testId}
    >
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          rel="noopener noreferrer"
          target="_blank"
          className="external-link-pill"
        >
          {link.label}
          <IconRender type="external" size={10} />
        </a>
      ))}
    </div>
  );
};

export default ExternalLinks;
