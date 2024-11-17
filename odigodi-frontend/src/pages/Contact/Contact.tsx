import React, { useState, useRef, FormEvent, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';
import styled from "styled-components";
import { pageVariants, pageTransition } from "../../css/FramerAnimation";
import styles from "./contact.module.scss";
import lottieData from "../../assets/lottie_email.json";
import plane from "../../assets/plane.json";
import LottieAnimation from "../../components/LottieAnimation";
import Modal from "../../components/Modal";

const contactOpen = "<Contact />";

interface EmailFormElement extends HTMLFormElement {
  from_name: HTMLInputElement;
  from_email: HTMLInputElement;
  message: HTMLTextAreaElement;
}
const Contact: React.FC = () => {
  const form = useRef<EmailFormElement>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleSuccessModalClose = useCallback((): void => {
    setShowSuccessModal(false);
  }, []);

  const handleErrorModalClose = useCallback((): void => {
    setShowErrorModal(false);
  }, []);

  const handleOnsubmit = useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (form.current) {
        await emailjs.sendForm(
          'service_c1soo1a',
          'template_tlxuxog',
          form.current,
          import.meta.env.VITE_EMAILJS_KEY
        );
        setShowSuccessModal(true);
        form.current.reset();
      }
    } catch (error) {
      setShowErrorModal(true);
      console.error('Email send error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderForm = useCallback(() => (
    <div className={styles.form}>
      <h3 className={styles.contactOpen}>{contactOpen}</h3>
      <form ref={form} onSubmit={handleOnsubmit}>
        <input
          type="text"
          name="from_name"
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="from_email"
          placeholder="Email"
          required
        />
        <textarea
          name="message"
          cols={30}
          rows={5}
          placeholder="Your Message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  ), [handleOnsubmit]);

  const renderLottie = useCallback(() => (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.lottie}>
        <LottieAnimation animationData={lottieData} />
      </div>
    </Suspense>
  ), []);

  const renderLoadingAnimation = useCallback(() => (
    isLoading && (
      <Rottie>
        <Suspense fallback={<div>Loading...</div>}>
          <LottieAnimation
            animationData={plane}
            width="50%"
            height="50%"
          />
        </Suspense>
      </Rottie>
    )
  ), [isLoading]);

  return (
    <div className={styles.contact}>
      <motion.div
        initial="init"
        animate="anim"
        exit="last"
        variants={pageVariants}
        transition={pageTransition}
        className={styles.wrapper}
      >
        {renderForm()}
        {renderLottie()}
        {renderLoadingAnimation()}
      </motion.div>
  
      {showSuccessModal && (
        <SuccessBox>
          <h2>Success!</h2>
          <p>Your message has been sent successfully.</p>
          <StyledButton onClick={handleSuccessModalClose}>Close</StyledButton>
        </SuccessBox>
      )}
  
      {showErrorModal && (
        <Modal onClickToggleModal={handleErrorModalClose}>
          <FailBox>
            <h2>Error!</h2>
            <p>Something went wrong while sending your email</p>
            <StyledButton onClick={handleErrorModalClose}>Close</StyledButton>
          </FailBox>
        </Modal>
      )}
    </div>
  );
};
// Styled components remain the same...
const StyledButton = styled.button`
  outline: none;
  border: none;
  border-radius: 5px;
  background-color: #3c83f3;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 8px 0 rgba(128, 128, 128, 0.4);
  padding: 8px 16px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Rottie = styled.dialog`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 9999;
  background-color: transparent;
  border: 0;
`;

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
  padding: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    color: white;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: white;
  }
`;

const FailBox = styled.dialog`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 2rem;
  background-color: #ff6b6b;
  position: fixed;
  box-shadow: 0 4px 8px 0 rgba(128, 128, 128, 0.8);
  z-index: 9999;
  padding: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    color: white;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: white;
  }
`;

export default React.memo(Contact);