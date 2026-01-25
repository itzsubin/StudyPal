import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavbarStyles.module.css';
import logo from '../../../assets/logo.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (path) => (e) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo(0, 0);
      window.location.reload();
    }
  };

  const handletitleClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className={styles.container}>
      <Link
        to="/"
        className={styles.logocontainer}
        onClick={handletitleClick}
      >
        <img
          src={logo}
          alt="StudyPal logo"
          className={styles.logo}
        />
      </Link>
      <div className={styles.info}>
        <Link
          to="/"
          className={`${styles.navlink} ${location.pathname === '/' ? styles.active : ''}`}
          onClick={handleLinkClick('/')}
        >
          Home
        </Link>

        <Link
          to="/flashcard"
          className={`${styles.navlink} ${location.pathname === '/flashcard' ? styles.active : ''}`}
          onClick={handleLinkClick('/flashcard')}
        >
          Flashcard Generator
        </Link>

        <Link
          to="/quiz"
          className={`${styles.navlink} ${location.pathname === '/quiz' ? styles.active : ''}`}
          onClick={handleLinkClick('/quiz')}
        >
          Quiz Generator
        </Link>
      </div>
      <div className={styles.buttoncontainer}>
        <Link to="/login"
          className={styles.loginbtn}
        >
          Login
        </Link>

        <Link to="/signup"
          className={styles.signupbtn}
        >
          Sign Up
        </Link>


      </div>
      <hr className={styles.line} />
    </nav>
  );
}

export default Navbar;


