import { CCallout } from '@coreui/react'
import styles from "./tips.module.scss";

const Tips = () => {
  return (
    <div className={styles.tips}>
     
      <div className={styles.card}>
        <p>
          <span className={styles.odigodi}>오디가디(odigodi)</span>의 정보는 대한민국 국토교통부에서 제공하는
          <span className={styles.important}> 실거래 전세와 매매</span> 가격입니다.
        </p>
        <a href="https://www.molit.go.kr/portal.do">https://www.molit.go.kr/portal.do</a>
      </div>
      <div className={styles.card}>
        <p>
          <span className={styles.odigodi}> 오디가디</span>
          는 전세사기를 방지하고자 오피스텔의 매매가와 전세가의 추이를 한 눈에 파악하기 위해 제공되고 있습니다.</p>
        <p>
          (<span className={styles.important}>월세</span>와
          <span className={styles.important}> 반전세</span>는 지원하지 않습니다.)
        </p>
      </div>

      <div className={styles.card}>
        <p>
          지원되는 법정구는 
          <span className={styles.important}> 송파구, 강남구, 강서구, 미추홀구</span>
          로써 매 주 월요일 업데이트가 진행되고 있습니다.
        </p>
      </div>
      <div className={styles.card}>
        <p>
          문의 사항이 있으시면 메뉴 Contact를 이용하여 개발자에게 연락해주시기 바랍니다! 
        </p>
      </div>
    </div>
  );
};

export default Tips;

