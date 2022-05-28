import React from "react";

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
          StructureMate is an engineering calculator built in collaboartion with
          a civil engineer.
          <br />
          The calculator provides a fast and easy way to perform complex
          calculations such as load bearing capacity, shear, and more.
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
              A &quot;Brad&quot; timer which can be reset and restarted with a
              single button to keep turns moving
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
      imageSrc: "/assets/logo4.png",
      urls: [
        "https://dosshouse.us/predictions",
        "https://dosshouse.us/spotify_api",
      ],
      names: ["Bracket Predictions", "Spotify API"],
      text: (
        <>
          <p>
            Dosshouse makes use of microservice architechture to provide
            multiple functional apps in a single place.
            <br />
            Each page calls its own API performing different functions to keep
            the site as lightweight and fast as possible.
          </p>
          <b>Active Apps:</b>
          <ul>
            <li>
              <b>Bracket Predictions</b>
            </li>
            A bracket maker for professional sports tournaments such as the
            World Cup and March Madness.
            <br />
            Includes leaderboards with group creation to track your results
            against your friends.
            <br />
            <br />
            <li>
              <b>Spotify API</b>
            </li>
            Using machine learning this app can accurately predict in which
            playlist an artists song best fit.
          </ul>
        </>
      ),
      tech: [
        { type: "Front-End", stack: "ReactJS" },
        { type: "Back-End", stack: "Flask, NodeJS, Express" },
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
        {
          url: "https://github.com/iwk549/dosshouse_backend",
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
