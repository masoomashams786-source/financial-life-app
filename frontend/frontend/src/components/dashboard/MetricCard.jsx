import { Card, CardContent } from "@mui/material";

const styles = {
  cardBase: ({
    isClickable,
    borderColor,
    hoverBorderColor,
    minHeight,
    boxShadow,
    backgroundColor,
    disableHover,
  }) => ({
    borderRadius: 3,
    boxShadow: boxShadow ?? "0 8px 16px -6px rgba(10, 37, 64, 0.12)",
    border: `1px solid ${borderColor}`,
    bgcolor: backgroundColor,
    height: "100%",
    minHeight,
    cursor: isClickable ? "pointer" : "default",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.2s ease-in-out",
    ...(isClickable && !disableHover
      ? {
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 32px -8px rgba(10, 37, 64, 0.2)",
            borderColor: hoverBorderColor ?? borderColor,
          },
          "&:active": {
            transform: "translateY(-2px)",
          },
        }
      : {}),
  }),
  contentBase: {
    p: 2.5,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1,
  },
};

export default function MetricCard({
  children,
  onClick,
  background,
  watermark,
  cardSx,
  contentSx,
  clickable = true,
  disableHover = false,
  minHeight = 140,
  borderColor = "#f1f5f9",
  hoverBorderColor,
  boxShadow,
  backgroundColor = "#FFFFFF",
}) {
  const isClickable = Boolean(onClick) && clickable;

  return (
    <Card
      onClick={onClick}
      sx={[
        styles.cardBase({
          isClickable,
          borderColor,
          hoverBorderColor,
          minHeight,
          boxShadow,
          backgroundColor,
          disableHover,
        }),
        cardSx,
      ]}
    >
      {background}
      {watermark}
      <CardContent sx={[styles.contentBase, contentSx]}>{children}</CardContent>
    </Card>
  );
}
