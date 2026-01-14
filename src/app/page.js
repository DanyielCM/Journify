import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <div className={styles.leftSection}>
        <div className={styles.mainSection}>
          <div className={styles.titleContainerMain}>
            <div className={styles.titleTextMain}>Welcome to</div>
            <Image
              src='/Common/Logo.svg'
              className={styles.logo}
              width={30}
              height={30}
              sizes='100vw'
              alt=''
            />
          </div>
          <div className={styles.description}>
            <b>
              Your thoughts, your story, your space.
              <br />
            </b>
            <b>Journify</b>
            <span>{` is more than just an `}</span>
            <b>online journal</b>
            <span>{`—it's your personal sanctuary for reflection, creativity, and growth. Whether you're jotting down `}</span>
            <b>daily thoughts</b>
            <span>{`, capturing `}</span>
            <b>memories</b>
            <span>{`, setting `}</span>
            <b>goals</b>
            <span>{`, or expressing your `}</span>
            <b>deepest feelings</b>
            <span>{`, `}</span>
            <b>Journify</b>
            <span> makes it simple, safe, and beautifully organized.</span>
          </div>
          <div className={styles.buttons}>
            <div className={styles.button3DBig}>
              <Link href='/register'>Register for free</Link>
            </div>
            <div className={styles.button3DSmall}>
              <Link href='/login'>Log in</Link>
            </div>
          </div>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.titleInfo}>How Journify helps you?</div>
          <div className={styles.infoTextsContainer}>
            <div className={styles.textContainer1}>
              <b>1.Get a gentle daily question</b>
              <p className={styles.infoText}>
                A small prompt that helps you pause and reflect, even on busy
                days.
              </p>
            </div>
            <div className={styles.textContainer2}>
              <b>2.Write a few honest lines</b>
              <p className={styles.infoText}>
                No pressure, no rules. Just your thoughts, exactly as they are.
              </p>
            </div>
            <div className={styles.textContainer3}>
              <b>3.See how you grow over time</b>
              <p className={styles.infoText}>
                Notice patterns, changes, and progress as your journal fills up.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.tag}>
          <div className={styles.tagText}>Hello, Stranger</div>
        </div>
        <div className={`${styles.lockNumber1} ${styles.lockNumbers}`}>0</div>
        <div className={`${styles.lockNumber2} ${styles.lockNumbers}`}>0</div>
        <div className={`${styles.lockNumber3} ${styles.lockNumbers}`}>0</div>
        <div className={`${styles.lockNumber4} ${styles.lockNumbers}`}>0</div>
      </div>
    </div>
  );
}
