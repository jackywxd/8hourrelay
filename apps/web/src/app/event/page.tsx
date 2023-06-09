import { useTheme } from "react-native-paper";
import About from "../../content/race_day_guide.mdx";
export default function Page() {
  return (
    <div className="prose m-2">
      <About />
    </div>
  );
}
