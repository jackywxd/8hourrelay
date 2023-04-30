"use client";
import { useTheme } from "react-native-paper";
import About from "../../content/about.mdx";
import Images from "./Images";
export default function Page() {
  const { colors } = useTheme();
  return (
    <div className="prose m-2" style={{ color: colors.onBackground }}>
      <About />
      <Images />
    </div>
  );
}
