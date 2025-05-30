import useSettings from "app/hooks/useSettings";

export default function MatxLogo({ className, style }) {
  const { settings } = useSettings();
  const theme = settings.themes[settings.activeTheme];

  return (
    <img
      src="https://www.dekhowood.shop/wp-content/uploads/2025/03/dekhowoodlogo-1-1536x687.jpg"
      alt="Dekho Wood Logo"
      className={className}
      style={{
        width: "100%",
        height: "auto",
        ...style,
        filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
      }}
    />
  );
}
