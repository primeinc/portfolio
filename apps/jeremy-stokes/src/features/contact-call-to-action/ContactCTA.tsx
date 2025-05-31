import styles from './styles.module.css'

const ContactCTA = () => (
  <section className={styles.cta}>
    <h2 className={styles.title}>Get in Touch</h2>
    <a className={styles.link} href="mailto:hello@jeremystokes.com">
      hello@jeremystokes.com
    </a>
  </section>
)

export default ContactCTA
