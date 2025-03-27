import React from "react";
import styles from "./CarteAllTask.module.css";
const CarteAllTask = (props) => {
  const { nombre } = props;
  return (
    <div className={`${styles.CarteAllTask}`}>
      <h3 className={`FontFamilyPoppins bold ${styles.CarteAllTaskTitle}`}>
        TASKS CREATED
      </h3>
      <span className={`FontFamilyInter ${styles.CarteAllTaskTitleSpan}	`}>
        {nombre}
      </span>
    </div>
  );
};

export default CarteAllTask;
