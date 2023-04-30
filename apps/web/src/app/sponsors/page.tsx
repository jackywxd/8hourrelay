"use client";
import { useTheme } from "react-native-paper";
import Sponsors from "../../content/sponsors.mdx";

export default function Page() {
  const { colors } = useTheme();
  return (
    <div className="prose m-2" style={{ color: colors.onBackground }}>
      <Sponsors />
    </div>
  );
}
