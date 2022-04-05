import React, { useState, useEffect, useContext, useRef } from "react";

import Header from "../common/pageSections/header";
import Site from "./site";

const ActiveSites = () => {
  const sites = [
    {
      imageSrc: "/assets/ultimateScoreboardLogo.ico",
      urls: [
        "https://ultimatescoreboard.com",
        "https://play.google.com/store/apps/details?id=com.ultimatescoreboard",
        "https://apps.apple.com/app/ultimate-scoreboard-mobile/id1576931083",
      ],
      names: [
        "Ultimate Scoreboard Web",
        "Ultimate Scoreboard Android",
        "Ultimate Scoreboard Mobile iOS",
      ],
      text: (
        <p>
          Ultimate Scoreboard is a fully functional and feature complete
          recreational sports league management app.
          <br />
          The goal of the site is to reduce data entry requirements and
          eliminate paper usage while also providing a single source of truth
          for all players to track their upcoming matches, league standings and
          leaderboard placements.
        </p>
      ),
      tech: [
        { type: "Front-End", stack: "ReactJS" },
        { type: "Back-End", stack: "NodeJS, Express" },
        { type: "Database", stack: "MongoDB" },
        { type: "Mobile", stack: "React Native" },
        { type: "Storage", stack: "Google Cloud Storage" },
        { type: "DevOps", stack: "Render, Google Play Store, Apple App Store" },
        { type: "Payments", stack: "Stripe" },
      ],
      repos: [
        {
          url: "https://github.com/iwk549/ultimate_scoreboard",
          private: true,
        },
        {
          url: "https://github.com/iwk549/ultimatescoreboard_api",
          private: true,
        },
        {
          url: "https://github.com/iwk549/ultimate_scoreboard_docker",
          private: true,
        },
      ],
    },
    {
      imageSrc: "/assets/StructureMateGuyInverted.png",
      urls: ["https://structuremate.com"],
      names: ["StructureMate"],
      text: (
        <p>
          StructureMate is an engineering calculator being built in
          collaboration with a master in civil engineering.
          <br />
          The calculator provides a fast and easy way to perform complex
          calculations such as load bearing capacity, shear, and many more.
          <br />
          All calculations are specific to the type of material selected.
        </p>
      ),
      tech: [
        { type: "Front-End", stack: "ReactTS" },
        { type: "Back-End", stack: "NodeJS, Express, GraphQL" },
        { type: "Database", stack: "MongoDB, Redis" },
        { type: "DevOps", stack: "Render" },
        { type: "Payments", stack: "Stripe" },
      ],
      repos: [
        {
          url: "https://github.com/iwk549/structuremate",
          private: true,
        },
        {
          url: "https://github.com/iwk549/structureapi",
          private: true,
        },
      ],
    },
    {
      imageSrc: "/assets/scorecardLogo.png",
      urls: [
        "https://play.google.com/store/apps/details?id=com.scorecard.ultimatescoreboard",
        "https://apps.apple.com/us/app/ultimate-scorecard/id1565606580",
      ],
      names: ["Scorecard Android", "Ultimate Scorecard iOS"],
      text: (
        <>
          <p>
            Scorecard is a scorekeeping app for games like scrabble, bridge,
            darts, etc.
          </p>
          Features include:
          <ul>
            <li>Three different scorekeeping types</li>
            <li>Up to 99 players</li>
            <li>Ability to save multiple scorecards</li>
            <li>Reset at any time without having to re-enter player names</li>
            <li>
              Update player names without having to start a new scorecard.
            </li>
            <li>
              A "Brad" timer which can be reset and restarted with a single
              button to keep turns moving
            </li>
            <li>A full Sudoku game within the app, play while you wait</li>
          </ul>
        </>
      ),
      tech: [
        { type: "Mobile", stack: "React Native" },
        { type: "DevOps", stack: "Google Play Store, Apple App Store" },
      ],
      repos: [
        {
          url: "https://github.com/iwk549/scorecard",
          private: false,
        },
      ],
    },
    {
      urls: ["https://dosshouse.us"],
      names: ["Dosshouse"],
      text: (
        <p>
          Dosshouse makes use of microservice architechture to provide multiple
          functional apps in a single place.
          <br />
          Each page calls its own API performing different functions to keep the
          site as lightweight and fast as possible.
        </p>
      ),
      tech: [
        { type: "Front-End", stack: "ReactJS" },
        { type: "Back-End", stack: "Flask" },
        { type: "DevOps", stack: "Render" },
      ],
      repos: [
        {
          url: "https://github.com/iwk549/dosshouse_react",
          private: false,
        },
        {
          url: "https://github.com/iwk549/spotify_flask",
          private: false,
        },
      ],
    },
  ];
  return (
    <div>
      <Header text="Apps and Projects" />
      {sites.map((s, i) => (
        <Site
          key={i}
          imageSrc={s.imageSrc}
          names={s.names}
          urls={s.urls}
          tech={s.tech}
          repos={s.repos}
        >
          {s.text}
        </Site>
      ))}
      <hr />
    </div>
  );
};

export default ActiveSites;
