import styles from "./ExplanationCard.module.css";

type ExplanationCardProps = {
  text: string;
};

export default function ExplanationCard({ text }: ExplanationCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
