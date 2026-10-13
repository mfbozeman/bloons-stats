import styles from "./styles/Loading.module.css";

function LoadingPage() {
  return (
    <>
      <span className={styles["loader"]}></span>
      <p>This can take a while.</p>
    </>
  );
}

export default LoadingPage;
