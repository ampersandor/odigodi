import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";

import { pageVariants, pageTransition } from "../../css/FramerAnimation";
import styles from "./contact.module.scss";
import lottieData from "../../static/lottie_email.json";
import emailjs from '@emailjs/browser';
import Modal from "../../components/Modal"

const contactOpen = "<Contact />";

const Contact = () => {

  const form = useRef();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false); // Close the success modal
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false); // Close the error modal
  };
  const handleOnsubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_c1soo1a', 'template_tlxuxog', form.current, 'cq2gfGUlSovhV5brP')
    .then((result) => {
        // show the user a success message
        setShowSuccessModal(true);
        form.current.reset();
    }, (error) => {
        // show the user an error
        setShowErrorModal(true);
    });

  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: lottieData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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
      {showSuccessModal &&
        <Modal onClickToggleModal={handleSuccessModalClose}>
          <h2>Success!</h2>
          <p>Your message has been sent successfully.</p>
          <button onClick={handleSuccessModalClose}>Close</button>
        </Modal>
      }
      {showErrorModal &&
        <Modal onClickToggleModal={handleErrorModalClose}>
          <h2>Success!</h2>
          <p>Your message has been sent successfully.</p>
          <button onClick={handleErrorModalClose}>Close</button>
        </Modal>
      }
    </div>
  );
};

export default Contact;
