import styles from "./styles.module.scss";

interface BottomScoreProps {
  data: any[];
  seoName: string;
  companyID: string;
}

export default function BottomScore({ data, seoName, companyID }: BottomScoreProps) {
  const sr_avgScore = data.find((item) => item.keyId === "sr_avgScore").value;
  const earningsScore = Math.round(sr_avgScore);
  return (
    <>
      <div className={styles.prevScore}>
        Previous Score: <span>{earningsScore}/10</span>
      </div>
    </>
  );
}
