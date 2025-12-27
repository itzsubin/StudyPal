import styles from "./FooterStyles.module.css";
import logo from "../../../assets/logo.png";
import tree from "../../../assets/treee.png";
import person from "../../../assets/aipersonn.png";
function Footer() {
  return (
    <section id='footer' className={styles.container}>
      <div className={styles.logocontainer}>
        <img src={logo} alt="my logo" className={styles.logo} />
      </div>
      
      <div className={styles.brandcontainer}>  
        <h1 className={styles.brandName}>StudyPal</h1>
      </div>  
      
      <div className={styles.treecontainer}>
        <img src={tree} alt="AI tree" className={styles.tree} />
      </div>

      <div className={styles.personcontainer}>
        <img src={person} alt="AI person" className={styles.person} />
      </div>


<div className={styles.copyright}>
  <span>© StudyPal</span>
</div>
    </section>
  );
}
export default Footer;
