import React from "react";
import { BiLinkExternal } from "react-icons/bi";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";

const Site = ({ imageSrc, urls, names, children, tech, repos, icon }) => {
  const imageStyle = {
    width: "auto",
    height: 40,
    borderRadius: 5,
  };
  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt={names[0]} style={imageStyle} />
      ) : (
        icon
      )}
      {urls.map((url, i) => (
        <a key={i} href={url} target="_blank" rel="noreferrer">
          <h4>
            {names[i]} <BiLinkExternal />
          </h4>
        </a>
      ))}
      {children}
      {tech &&
        tech.length > 0 &&
        tech.map((t, i) => (
          <ul key={i}>
            <b>{t.type}: </b>
            {t.stack}
          </ul>
        ))}
      {repos &&
        repos.length > 0 &&
        repos.map((repo, i) => (
          <>
            <a
              key={i}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              style={{ overflowWrap: "break-word" }}
            >
              {repo.private && <RiGitRepositoryPrivateFill />} {repo.url}{" "}
              <BiLinkExternal />
            </a>
            <br />
          </>
        ))}
      <br />
      <hr />
    </div>
  );
};

export default Site;
