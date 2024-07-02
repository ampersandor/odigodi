import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";

import { pageVariants, pageTransition } from "../../css/FramerAnimation";
import styles from "./contact.module.scss";
import lottieData from "../../static/lottie_email.json";
import plane from "../../static/plane.json";
import emailjs from '@emailjs/browser';
import Modal from "../../components/Modal"
import styled from "styled-components";

const contactOpen = "<Contact />";

const Contact = () => {
  const form = useRef();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false); // Close the success modal
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false); // Close the error modal
  };
  const handleOnsubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    emailjs.sendForm('service_c1soo1a', 'template_tlxuxog', form.current, process.env.REACT_APP_EMAILJS_KEY)
      .then((result) => {
        // show the user a success message
        setShowSuccessModal(true);
        form.current.reset();
        setLoading(false);
      }, (error) => {
        // show the user an error
        setShowErrorModal(true);
        setLoading(false);
      });

  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottieData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const planeOptions = {
    loop: true,
    autoplay: true,
    animationData: plane,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  }

  return (
    <div className={styles.contact}>
      <motion.div
        initial='init'
        animate='anim'
        exit='last'
        variants={pageVariants}
        transition={pageTransition}
        className={styles.wrapper}
      >
        <div className={styles.form}>
          <h3 className={styles.contactOpen}>{contactOpen}</h3>
          <form ref={form} onSubmit={handleOnsubmit}>
            <input
              type='text'
              name='from_name'
              placeholder='Name'
              required
            />
            <input
              type='email'
              name='from_email'
              placeholder='Email'
              required
            />
            <textarea
              name='message'
              cols={30}
              rows={5}
              placeholder='Your Message'
              required
            ></textarea>
            <button type='submit'>Send</button>
          </form>
        </div>
        <div className={styles.lottie}>
          <Lottie
            options={defaultOptions}
            height='100%'
            width='100%'
            isStopped={false}
            isPaused={false}
          />
        </div>
      </motion.div>
      {isLoading &&
        <Rottie>
          <Lottie
            background-color="#99999"
            options={planeOptions}
            height="50%"
            width="50%"
            isStopped={false}
            isPaused={false}
          />
        </Rottie>
      }
      {showSuccessModal &&
        <SuccessBox>
          <h2>Success!</h2>
          <p>Your message has been sent successfully.</p>
          <button style={{
            "outline": "none",
            "border": "none",
            "border-radius": "5px",
            "background-color": "#3c83f3",
            "font-size": "1rem",
            "font-weight": "500",
            "color": "#fff",
            "cursor": "pointer",
            "box-shadow": "0 4px 8px 0 rgba(128, 128, 128, 0.4)"
          }} onClick={handleSuccessModalClose}>Close</button>
        </SuccessBox>
      }
      {showErrorModal &&
        <Modal onClickToggleModal={handleErrorModalClose}>
          <FailBox>
            <h2>Error!</h2>
            <p>Something goes wrong while sending your email</p>
            <button onClick={handleErrorModalClose}>Close</button>
          </FailBox>
        </Modal>
      }
    </div>
  );
};

export default Contact;

const Rottie = styled.dialog`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9999;
  background-color: transparent;
  border: 0;
`


const SuccessBox = styled.dialog`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 2rem;
  background-color: #80a8e1;
  position: fixed;
  box-shadow: 0 4px 8px 0 rgba(128, 128, 128, 0.8);
  z-index: 9999;
`

const FailBox = styled.dialog`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 2rem;
  background-color: red;
  position: fixed;
  box-shadow: 0 4px 8px 0 rgba(128, 128, 128, 0.8);
  z-index: 9999;
`