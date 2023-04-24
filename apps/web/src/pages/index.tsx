import { useRouter } from "next/router";
import { Button } from "ui";

import styles from "../styles/index.module.css";

export default function Web() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <h1>Web</h1>
      <Button
        onClick={() => {
          router.push("/signin");
        }}
        text="Boop"
      />
    </div>
  );
}
