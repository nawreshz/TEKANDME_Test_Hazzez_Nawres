import React, { useState } from "react";
import axios from "axios";
import styles from "./Carte.module.css";
import Image from "next/image";


const api = axios.create({
  baseURL: "http://localhost:1337/api",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Carte = (props) => {
  const {
    id,
    title,
    description,
    startDate,
    endDate,
    onClick1,
    onClick2,
    onClick3,
    priority,
    completed,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedStartDate, setEditedStartDate] = useState(startDate);
  const [editedEndDate, setEditedEndDate] = useState(endDate);
 
 const handleEdit = () => {
    if (!completed) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    onClick2({
      id,
      title: editedTitle,
      description: editedDescription,
      start_date: editedStartDate,
      due_date: editedEndDate,
      priority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedDescription(description);
    setEditedStartDate(startDate);
    setEditedEndDate(endDate);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onClick3(id);
  };

  const handleComplete = () => {
    onClick1(id, completed);
  };

  return (
    <div className={`${styles.Carte} d-flex justify-content-between`}>
      <div
        className={`${styles.CarteContent}  d-flex flex-column justify-content-between`}
      >
        {" "}
        {isEditing ? (
          <>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="date"
                  className="form-control"
                  value={editedStartDate}
                  onChange={(e) => setEditedStartDate(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="date"
                  className="form-control"
                  value={editedEndDate}
                  onChange={(e) => setEditedEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Enregistrer
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className={`${styles.CarteTitle} m-0 FontFamilyInter`}>
              {title}
            </h3>
            <p className={`${styles.CarteDescription} m-0 FontFamilyJost`}>
              {description}
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className={`${styles.PriorityBadge} ${styles[priority]}`}>
                {priority}
              </span>
              {completed && (
                <span className={`${styles.CompletedBadge}`}>Completed</span>
              )}
            </div>
            <h4 className={`${styles.CarteDate} m-0 FontFamilyInter`}>
              Start date : {startDate}
            </h4>
            <h4 className={`${styles.CarteDate} m-0 FontFamilyInter`}>
              Due date : {endDate}
            </h4>
          </>
        )}
      </div>

      <div
        className={`${styles.CarteButtons} d-flex flex-column align-items-center justify-content-between`}
      >
        <button onClick={handleComplete} className="bg-transparent border-0">
          <Image
            src="/Icons/Carte/Done.svg"
            alt="Done"
            width={20}
            height={20}
          />
        </button>
        <button
          onClick={handleEdit}
          className="bg-transparent border-0"
          disabled={completed}
          style={{
            opacity: completed ? 0.5 : 1,
            cursor: completed ? "not-allowed" : "pointer",
          }}
        >
          <Image
            src="/Icons/Carte/Edit.svg"
            alt="Edit"
            width={20}
            height={20}
          />
        </button>
        <button onClick={handleDelete} className="bg-transparent border-0">
          <Image
            src="/Icons/Carte/Delete.svg"
            alt="Delete"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
};

export default Carte;
