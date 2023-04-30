"use client";
import { useTheme } from "react-native-paper";
import About from "../../content/race_day_guide.mdx";
export default function Page() {
  const { colors } = useTheme();
  return (
    <div className="prose m-2" style={{ color: colors.onBackground }}>
      <About />
    </div>
  );
}
