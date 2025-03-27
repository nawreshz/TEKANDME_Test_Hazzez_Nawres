import React, { useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const { logout, user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header
      className={`${styles.header} d-flex justify-content-between align-items-center`}
    >
      <div className={`${styles.LogoTextContainer} d-flex align-items-center`}>
        <Image src="Icons/Logo.svg" alt="Logo" width={40} height={40} />
        <span
          className={`${styles.TodoListName} color-quaternary  FontFamilyMoments`}
        >
          Todo List
        </span>
      </div>
      <div className="position-relative">
        <button className="border-0 bg-transparent" onClick={toggleDropdown}>
          <Image
            src="/user.png"
            alt="user"
            width={50}
            height={50}
            className={`${styles.userImage}`}
          />
        </button>
        {showDropdown && (
          <div className="dropdown-menu show position-absolute end-0 mt-2">
            <div className="dropdown-item">
              <span>Connecté en tant que</span>
              <div className="fw-bold">{user?.username}</div>
            </div>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item text-danger" onClick={logout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
