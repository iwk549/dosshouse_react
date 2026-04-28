import { act, screen } from "@testing-library/react";
import { renderWithContext, clickByText } from "../../testHelpers";
import LeaderboardWhatIfModal from "../../../components/predictions/leaderboard/leaderboardWhatIfModal";

const makePath = ({
  champion = "Argentina",
  sf1Winner = "Argentina",
  sf2Winner = "France",
  thirdPlace = null,
  topOne = {
    _id: "p1",
    name: "My Picks",
    userID: { name: "Alice" },
    totalPoints: 50,
  },
  topTwo = {
    _id: "p2",
    name: "Your Picks",
    userID: { name: "Bob" },
    totalPoints: 40,
  },
  entryThree = {
    _id: "p3",
    name: "Their Picks",
    userID: { name: "Carol" },
    totalPoints: 30,
  },
} = {}) => ({
  champion,
  sf1Winner,
  sf2Winner,
  thirdPlace,
  topSubmissions: [
    {
      rank: 1,
      predictionID: { _id: topOne._id, name: topOne.name },
      userID: topOne.userID,
      totalPoints: topOne.totalPoints,
    },
    {
      rank: 2,
      predictionID: { _id: topTwo._id, name: topTwo.name },
      userID: topTwo.userID,
      totalPoints: topTwo.totalPoints,
    },
    {
      rank: 3,
      predictionID: { _id: entryThree._id, name: entryThree.name },
      userID: entryThree.userID,
      totalPoints: entryThree.totalPoints,
    },
  ],
  secondChanceTopSubmissions: [],
});

const renderModal = async (props = {}) => {
  await act(async () => {
    renderWithContext(LeaderboardWhatIfModal, {
      isOpen: true,
      setIsOpen: jest.fn(),
      whatIfData: null,
      isSecondChance: false,
      ...props,
    });
  });
};

describe("LeaderboardWhatIfModal", () => {
  it("shows StatusNote when whatIfData is null", async () => {
    await renderModal({ whatIfData: null });
    expect(
      screen.queryByText(
        /scenarios will be available when the semi finals are set/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows StatusNote when whatIfData has no paths", async () => {
    await renderModal({ whatIfData: { paths: [] } });
    expect(
      screen.queryByText(
        /scenarios will be available when the semi finals are set/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows the winning submission name and user", async () => {
    await renderModal({ whatIfData: { paths: [makePath()] } });
    await clickByText("By Submission");
    expect(screen.queryByText("My Picks")).toBeInTheDocument();
    expect(screen.queryByText(/Alice/)).toBeInTheDocument();
  });

  it("shows scenario count", async () => {
    await renderModal({ whatIfData: { paths: [makePath()] } });
    expect(screen.queryByText(/1 scenario/)).toBeInTheDocument();
  });

  it("shows plural scenario count when multiple paths share the same winner", async () => {
    const path2 = makePath({
      champion: "France",
      sf1Winner: "France",
      sf2Winner: "England",
    });
    await renderModal({ whatIfData: { paths: [makePath(), path2] } });
    await clickByText("By Submission");
    expect(screen.queryByText(/2 scenarios/)).toBeInTheDocument();
  });

  it("shows Champion label and team name", async () => {
    await renderModal({ whatIfData: { paths: [makePath()] } });
    await clickByText("By Submission");
    expect(screen.queryByText("Champion")).toBeInTheDocument();
    expect(screen.queryAllByText("Argentina").length).toBeGreaterThan(0);
  });

  it("shows Finalist 1 and Finalist 2 labels", async () => {
    await renderModal({ whatIfData: { paths: [makePath()] } });
    expect(screen.queryByText("Finalist 1")).toBeInTheDocument();
    expect(screen.queryByText("Finalist 2")).toBeInTheDocument();
  });

  it("shows third place when present", async () => {
    await renderModal({
      whatIfData: { paths: [makePath({ thirdPlace: "Croatia" })] },
    });
    expect(screen.queryByText("3rd")).toBeInTheDocument();
    expect(screen.queryByText("Croatia")).toBeInTheDocument();
  });

  it("does not show 3rd section when thirdPlace is null", async () => {
    await renderModal({
      whatIfData: { paths: [makePath({ thirdPlace: null })] },
    });
    expect(screen.queryByText("3rd")).not.toBeInTheDocument();
  });

  it("top-three entries are hidden before expanding", async () => {
    await renderModal({ whatIfData: { paths: [makePath()] } });
    // rank 2 & 3 entries only appear in the expanded top-three, not in the winner header
    expect(screen.queryByText("Your Picks")).not.toBeInTheDocument();
    expect(screen.queryByText("Their Picks")).not.toBeInTheDocument();
  });

  it("expands top-three entries when the finalist row is clicked", async () => {
    await renderModal({ whatIfData: { paths: [makePath()] } });
    await clickByText("Finalist 1");
    expect(screen.queryByText("Your Picks")).toBeInTheDocument();
    expect(screen.queryByText("Their Picks")).toBeInTheDocument();
    expect(screen.queryByText("50 pts")).toBeInTheDocument();
    expect(screen.queryByText("40 pts")).toBeInTheDocument();
    expect(screen.queryByText("30 pts")).toBeInTheDocument();
  });

  it("collapses when the row is clicked again", async () => {
    await renderModal({ whatIfData: { paths: [makePath()] } });
    await clickByText("Finalist 1");
    expect(screen.queryByText("Your Picks")).toBeInTheDocument();
    await clickByText("Finalist 1");
    expect(screen.queryByText("Your Picks")).not.toBeInTheDocument();
  });

  it("shows points range when compressed paths have different totals", async () => {
    const path1 = makePath({
      champion: "Argentina",
      sf1Winner: "Argentina",
      sf2Winner: "France",
      thirdPlace: "Croatia",
      topOne: {
        _id: "p1",
        name: "My Picks",
        userID: { name: "Alice" },
        totalPoints: 50,
      },
    });
    const path2 = makePath({
      champion: "Argentina",
      sf1Winner: "Argentina",
      sf2Winner: "France",
      thirdPlace: "Morocco",
      topOne: {
        _id: "p1",
        name: "My Picks",
        userID: { name: "Alice" },
        totalPoints: 66,
      },
    });
    await renderModal({ whatIfData: { paths: [path1, path2] } });
    await clickByText("Finalist 1");
    expect(screen.queryByText("50-66 pts")).toBeInTheDocument();
  });

  it("uses secondChanceTopSubmissions when isSecondChance is true", async () => {
    const path = {
      ...makePath(),
      secondChanceTopSubmissions: [
        {
          rank: 1,
          predictionID: { _id: "sc1", name: "SC Picks" },
          userID: { name: "Dave" },
          totalPoints: 20,
        },
      ],
    };
    await renderModal({ whatIfData: { paths: [path] }, isSecondChance: true });
    await clickByText("By Submission");
    expect(screen.queryByText("SC Picks")).toBeInTheDocument();
    expect(screen.queryByText(/Dave/)).toBeInTheDocument();
    expect(screen.queryByText("My Picks")).not.toBeInTheDocument();
  });

  it("groups separate champions under the same winner card", async () => {
    const path1 = makePath({ champion: "Argentina" });
    const path2 = makePath({
      champion: "France",
      sf1Winner: "France",
      sf2Winner: "England",
    });
    await renderModal({ whatIfData: { paths: [path1, path2] } });
    await clickByText("By Submission");
    const championLabels = screen.queryAllByText("Champion");
    expect(championLabels).toHaveLength(2);
  });
});
