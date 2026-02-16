import StaggeredMenu from '../Sidebar/StaggeredMenu';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();

    return (
        <StaggeredMenu
            items={[
                { id: 'dashboard', label: 'Dashboard', link: '/dashboard' },
                { id: 'timed-session', label: 'Time-based Session', link: '#' },
                { id: 'your-notes', label: 'Your Notes', link: '#' },
            ]}
            onNavigate={(id) => {
                console.log('Navigate to:', id);
                if (id === 'dashboard') {
                    navigate('/dashboard');
                } else {
                    navigate('/' + id);
                }

            }}
            onSignOut={() => {
                window.location.href = '/';
            }}
            logoUrl={null}
            isFixed={false}
            menuButtonColor="#000"
            openMenuButtonColor="#000"
            className="navbar-staggered-menu"
        />
    );
};

export default Menu;