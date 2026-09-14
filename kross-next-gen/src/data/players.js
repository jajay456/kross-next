export const PLAYERS = [
  {
    id: "player_001",
    name: "Smith",
    level: "NG6",
    class: "Elite",
    image: "",
    coach: "Roberto",
    memberSince: "Jan 2024",
    lastUpdate: "24 Aug 2026",
    developmentPlan: {
      currentFocus: ["Return under pressure", "First volley decisions"],
      next4Weeks: [
        "Improve return consistency",
        "Play more aggressive first volley",
        "Better court positioning",
      ],
      longTermGoal: "Become Thailand #1 and compete in international tournaments.",
    },
    latestAssessment: {
      date: "24 Aug 2026",
      technical: 4,
      tactical: 4,
      physical: 5,
      mentalCompetition: 4,
      gameUnderstanding: 4,
      coachComment:
        "Great improvement in return under pressure. Needs to be more consistent in important points.",
    },
    recentClasses: [
      { id: "class_001", className: "Match Play", coach: "Roberto", duration: 90, date: "25 Aug 2026" },
      { id: "class_002", className: "Technical", coach: "Lau", duration: 60, date: "23 Aug 2026" },
      { id: "class_003", className: "Tactical", coach: "Roberto", duration: 90, date: "21 Aug 2026" },
      { id: "class_004", className: "Physical", coach: "Roberto", duration: 60, date: "20 Aug 2026" },
      { id: "class_005", className: "Match Play", coach: "Kiril", duration: 90, date: "18 Aug 2026" },
    ],
  },
  {
    id: "player_002",
    name: "John",
    level: "NG5",
    class: "Advanced",
    image: "",
    coach: "Kiril",
    memberSince: "Mar 2025",
    lastUpdate: "22 Aug 2026",
    developmentPlan: {
      currentFocus: ["Backhand consistency", "Defensive positioning"],
      next4Weeks: ["Improve backhand", "Better transition to net"],
      longTermGoal: "Compete in national level tournaments.",
    },
    latestAssessment: {
      date: "22 Aug 2026",
      technical: 3,
      tactical: 4,
      physical: 4,
      mentalCompetition: 3,
      gameUnderstanding: 4,
      coachComment: "Good tactical understanding but needs more consistency.",
    },
    recentClasses: [
      { id: "class_006", className: "Technical", coach: "Kiril", duration: 60, date: "24 Aug 2026" },
    ],
  },
  {
    id: "player_003",
    name: "Beam",
    level: "NG4",
    class: "Team",
    image: "",
    coach: "Kiril",
    memberSince: "Jun 2024",
    lastUpdate: "13 Aug 2026",
    developmentPlan: {
      currentFocus: ["Bandeja depth"],
      next4Weeks: ["Hold net position longer", "Deeper lobs"],
      longTermGoal: "Move up to Elite class within a year.",
    },
    latestAssessment: {
      date: "13 Aug 2026",
      technical: 3,
      tactical: 3,
      physical: 4,
      mentalCompetition: 3,
      gameUnderstanding: 3,
      coachComment: "Strong at net. Needs patience in long rallies.",
    },
    recentClasses: [
      { id: "class_007", className: "Match Play", coach: "Kiril", duration: 90, date: "12 Aug 2026" },
    ],
  },
  {
    id: "player_004",
    name: "Alex",
    level: "NG3",
    class: "Academy",
    image: "",
    coach: "Roberto",
    memberSince: "Sep 2024",
    lastUpdate: "06 Aug 2026",
    developmentPlan: {
      currentFocus: ["Serve placement"],
      next4Weeks: ["Consistent wall play"],
      longTermGoal: "Join the Team class.",
    },
    latestAssessment: {
      date: "06 Aug 2026",
      technical: 3,
      tactical: 2,
      physical: 3,
      mentalCompetition: 3,
      gameUnderstanding: 2,
      coachComment: "Improving steadily. Focus on footwork before power.",
    },
    recentClasses: [
      { id: "class_008", className: "Technical", coach: "Roberto", duration: 60, date: "05 Aug 2026" },
    ],
  },
  {
    id: "player_005",
    name: "Mint",
    level: "NG2",
    class: "Academy",
    image: "",
    coach: "Lau",
    memberSince: "Jan 2025",
    lastUpdate: "29 Jul 2026",
    developmentPlan: {
      currentFocus: ["Basic grip and swing path"],
      next4Weeks: ["Rally consistency"],
      longTermGoal: "Play social matches confidently.",
    },
    latestAssessment: {
      date: "29 Jul 2026",
      technical: 2,
      tactical: 2,
      physical: 3,
      mentalCompetition: 3,
      gameUnderstanding: 2,
      coachComment: "Fast learner with good attitude.",
    },
    recentClasses: [
      { id: "class_009", className: "Group Class", coach: "Lau", duration: 90, date: "28 Jul 2026" },
    ],
  },
  {
    id: "player_006",
    name: "Tom",
    level: "NG1",
    class: "Academy",
    image: "",
    coach: "Kiril",
    memberSince: "May 2025",
    lastUpdate: "21 Jul 2026",
    developmentPlan: {
      currentFocus: ["Learning basic rules"],
      next4Weeks: ["Forehand contact point"],
      longTermGoal: "Build a solid technical base.",
    },
    latestAssessment: {
      date: "21 Jul 2026",
      technical: 1,
      tactical: 1,
      physical: 2,
      mentalCompetition: 2,
      gameUnderstanding: 1,
      coachComment: "Just started. Very motivated.",
    },
    recentClasses: [
      { id: "class_010", className: "Intro Class", coach: "Kiril", duration: 60, date: "20 Jul 2026" },
    ],
  },
];

export const LEVELS = ["NG1", "NG2", "NG3", "NG4", "NG5", "NG6"];
export const CLASSES = ["Academy", "Team", "Advanced", "Elite"];
export const COACHES = ["Roberto", "Lau", "Kiril"];

export const ASSESSMENT_FIELDS = [
  { key: "technical", label: "Technical" },
  { key: "tactical", label: "Tactical" },
  { key: "physical", label: "Physical" },
  { key: "mentalCompetition", label: "Mental / Competition" },
  { key: "gameUnderstanding", label: "Game Understanding" },
];

export const EMPTY_PLAYER_EXTRAS = {
  developmentPlan: { currentFocus: [], next4Weeks: [], longTermGoal: "" },
  latestAssessment: {
    date: "",
    technical: 0,
    tactical: 0,
    physical: 0,
    mentalCompetition: 0,
    gameUnderstanding: 0,
    coachComment: "",
  },
  recentClasses: [],
};