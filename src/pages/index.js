import Link from 'next/link';
import styles from '../styles/LandingPage.module.css';

const LandingPage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>AI Form Generator</h1>
                <p className={styles.subtitle}>Effortlessly create dynamic forms with the power of AI.</p>
                <Link legacyBehavior href="/form-generator">
                    <a className={styles.button}>Try It Out Now</a>
                </Link>
            </header>
            <main className={styles.main}>
                <section className={styles.features}>
                    <h2 className={styles.featuresTitle}>Features</h2>
                    <div className={styles.featureList}>
                        <div className={styles.featureItem}>
                            <h3>Customizable Forms</h3>
                            <p>Create forms tailored to your needs with ease.</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>Instant Preview</h3>
                            <p>See how your form looks instantly as you create it.</p>
                        </div>
                        <div className={styles.featureItem}>
                            <h3>AI-Powered</h3>
                            <p>Leverage OpenAI to generate accurate and functional forms.</p>
                        </div>
                    </div>
                </section>
                <section className={styles.callToAction}>
                    <h2>Ready to create your form?</h2>
                    <Link legacyBehavior href="/form-generator">
                        <a className={styles.button}>Try It Out Now</a>
                    </Link>
                </section>
            </main>
            <footer className={styles.footer}>
                <p>&copy; 2024 AI Form Generator. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
