import React from 'react';
import styles from "./tips.module.scss";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../../css/FramerAnimation";

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

const Tips: React.FC = () => {
  return (
    <div className={styles.tips}>
      <motion.div
        initial="init"
        animate="anim"
        exit="last"
        variants={pageVariants}
        transition={pageTransition}
        className={styles.wrapper}
      >  
        <Card>
          <p>
            <span className={styles.odigodi}>오디가디(odigodi)</span>
            의 정보는 대한민국 국토교통부에서 제공하는
            <span className={styles.important}> 실거래 전세와 매매</span> 가격입니다.
          </p>
          <a 
            href="https://www.molit.go.kr/portal.do"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.molit.go.kr/portal.do
          </a>
        </Card>

        <Card>
          <p>
            <span className={styles.odigodi}> 오디가디</span>
            는 전세사기를 방지하고자 오피스텔의 매매가📉와 전세가📈의 추이를 한 눈에 파악하기 위해 제공되고 있습니다.
          </p>
          <p>
            (<span className={styles.important}>월세</span>와
            <span className={styles.important}> 반전세</span>는 지원하지 않습니다. 🥹)
          </p>
        </Card>

        <Card>
          <p>
            지원되는 법정구는 
            <span className={styles.important}> 송파구, 강남구, 강서구, 미추홀구</span>
            로써 매 주 월요일 업데이트가 진행되고 있습니다. 🏃🏻💦
          </p>
        </Card>

        <Card>
          <p>
            문의 사항이 있으시면 메뉴 Contact📨를 이용하여 개발자에게 연락해주시기 바랍니다! 
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Tips;