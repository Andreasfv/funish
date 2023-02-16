// https://colorhunt.co/palette/def5e5bcead59ed5c58ec3b0

const theme = {
  colors: {
    lightGreen: "#DEF5E5",
    green: "#BCEAD5",
    lightDarkGreen: "#9ED5C5",
    darkGreen: "#8EC3B0",
  },
  borders: {
    cardBorder: "1px solid lightgrey",
  },
  shadow: {
    cardShadow: "0 2px 2px 1px rgba(0,0,0,0.2)",
  },
  media: {
    mobile: "only screen and (max-width: 600px)",
  },
};

export type Theme = typeof theme;
export default theme;
