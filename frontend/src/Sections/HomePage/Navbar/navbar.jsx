import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavbarStyles.module.css';
import logo from '../../../assets/logo.png';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLinkClick = (path) => (e) => {
    if (location.pathname === path) {
        e.preventDefault();
        window.scrollTo(0,0);
        window.location.reload();
    }
  };

  const handletitleClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({top:0, behavior: "smooth"});
    } else {
      navigate("/");
    }
};

  return (
    <nav className={styles.container}>
      <div className={styles.logocontainer}>
        <img 
          src={logo}
          alt="StudyPal logo"
          className={styles.logo}
        />
      </div>
      
      <div className={styles.name}>
          <h1 className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              onClick={handletitleClick}
              style = {{ cursor: "pointer "}}
          >StudyPal</h1> 

      </div>

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
      </div>
      
      <hr className={styles.line} />
    </nav> 
  );
}

export default Navbar;


