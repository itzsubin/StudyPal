import styles from "./FooterStyles.module.css";
import logo from "../../../assets/logo.png";
function Footer() {
  return (
    <section id='footer' className={styles.container}>
      <div className={styles.logocontainer}>
        <img src={logo} alt="my logo" className={styles.logo} />
      </div>
    </section>
  );
}
export default Footer;
