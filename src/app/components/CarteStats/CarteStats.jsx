import React from "react";
import styles from "./CarteStats.module.css";
const CarteStats = (props) => {
  const { title, value, isCompleted } = props;
  return (
    <div
      className={`${
        styles.CarteStats
      } d-flex flex-column justify-content-between align-items-center ${
        isCompleted ? styles.Completed : ""
      }`}
    >
      <span className={`${styles.Title} FontFamilyInter bold text-uppercase  text-center`}>
        {title}
      </span>
      <span className={`${styles.Value} FontFamilyInter extraBold`}>
        {value}
      </span>
    </div>
  );
};

export default CarteStats;
