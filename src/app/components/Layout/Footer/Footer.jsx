import Image from "next/image";
import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
const Footer = () => {
  return (
    <footer
      className={`${styles.footer} d-flex justify-content-between align-items-center`}
    >
      <div className={`${styles.LogoTextContainer} d-flex`}>
        <Image src="Icons/Logo.svg" alt="Logo" width={30} height={30} />
        <span
          className={`${styles.TodoListName} color-quaternary  FontFamilyMoments`}
        >
          Todo List
        </span>
      </div>
      <h3
        className={`${styles.tekandmecopyright} color-secondary FontFamilyActor`}
      >
        © 2024 Tekandme. All Rights Reserved.{" "}
      </h3>
      <div className={`${styles.SocialMediaContainer} d-flex`}>
        <div className={`${styles.LogoTextContainerMobile} d-flex`}>
          <Image src="Icons/Logo.svg" alt="Logo" width={30} height={30} />
          <span
            className={`${styles.TodoListName} color-quaternary  FontFamilyMoments`}
          >
            Todo List
          </span>
        </div>
        <div>
          <Link href="https://www.facebook.com/" target="_blank" title="facebook">
            <Image
              src="Icons/Facebook.svg"
              alt="Facebook"
              width={20}
              height={20}
            />
          </Link>
          <Link href="https://www.linkedin.com/" target="_blank" title="linkedin">
            <Image
              src="Icons/Linkedin.svg"
              alt="Linkedin"
              width={20}
              height={20}
            />
          </Link>
          <Link href="https://www.twitter.com/" target="_blank" title="twitter">
            <Image src="Icons/Twitter.svg" alt="Twitter" width={20} height={20} />
          </Link>
          <Link href="https://www.github.com/" target="_blank" title="github">
            <Image src="Icons/Github.svg" alt="Github" width={20} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
