// App.jsx — Router + Nav + Theme
const { useState, useEffect } = React;

function App() {
  const [theme, setTheme] = useState(() => Storage.getTheme());
  const [currentUser, setCurrentUser] = useState(() => Storage.getCurrentUser());
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('trv_page');
    return saved ? JSON.parse(saved) : { name: 'home' };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('trv_page', JSON.stringify(page));
  }, [page]);

  function navigate(name, params = {}) {
    setPage({ name, ...params });
    window.scrollTo(0, 0);
  }

  function handleLogin(user) {
    setCurrentUser(user);
    navigate('home');
  }

  function handleLogout() {
    Storage.logout();
    setCurrentUser(null);
    navigate('home');
  }

  function handleEditBooking(booking) {
    const restaurant = RESTAURANTS.find(r => r.id === booking.restaurantId);
    if (!restaurant) return;
    navigate('restaurant', { restaurantId: booking.restaurantId, editBookingData: booking });
  }

  const requireAuth = (fn) => {
    if (!currentUser) { navigate('auth'); return; }
    fn();
  };

  return (
    <div className="app">
      <Navbar
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onNavigate={navigate}
        onLogout={handleLogout}
        currentPage={page.name}
      />

      <main className="main">
        {page.name === 'auth' && (
          <AuthPage onLogin={handleLogin} initialMode={page.mode || 'login'} />
        )}
        {page.name === 'home' && (
          <HomePage onSelectRestaurant={id => requireAuth(() => navigate('restaurant', { restaurantId: id }))} />
        )}
        {page.name === 'restaurant' && (
          <RestaurantPage
            restaurantId={page.restaurantId}
            currentUser={currentUser}
            onBack={() => navigate('home')}
            onGoProfile={() => navigate('profile')}
            editBookingData={page.editBookingData || null}
            onEditDone={() => navigate('profile')}
          />
        )}
        {page.name === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            onLogout={handleLogout}
            onEditBooking={handleEditBooking}
            onNavigate={navigate}
          />
        )}
        {page.name === 'profile' && !currentUser && (
          <AuthPage onLogin={handleLogin} />
        )}
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-brand">Tischreservierung</span>
          <span className="footer-copy">© 2026 · Сеть ресторанов Москвы</span>
        </div>
      </footer>
    </div>
  );
}

function Navbar({ currentUser, theme, onToggleTheme, onNavigate, onLogout, currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="nav-brand" onClick={() => onNavigate('home')}>
          Tischreservierung
        </button>

        <nav className="nav-links desktop-only">
          <button className={`nav-link${currentPage==='home'?' active':''}`} onClick={() => onNavigate('home')}>Рестораны</button>
          {currentUser && (
            <button className={`nav-link${currentPage==='profile'?' active':''}`} onClick={() => onNavigate('profile')}>Мои брони</button>
          )}
        </nav>

        <div className="nav-actions">
          <button className="icon-btn" onClick={onToggleTheme} title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'} aria-label="Сменить тему">
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            )}
          </button>

          {currentUser ? (
            <div className="nav-user">
              <button className="user-avatar-btn" onClick={() => onNavigate('profile')}>
                {currentUser.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
              </button>
            </div>
          ) : (
            <button className="btn-primary sm" onClick={() => onNavigate('auth')}>Войти</button>
          )}

          <button className="icon-btn mobile-only" onClick={() => setMenuOpen(o => !o)} aria-label="Меню">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-menu-item" onClick={() => { onNavigate('home'); setMenuOpen(false); }}>Рестораны</button>
          {currentUser && <button className="mobile-menu-item" onClick={() => { onNavigate('profile'); setMenuOpen(false); }}>Мои брони</button>}
          {currentUser && <button className="mobile-menu-item danger" onClick={() => { onLogout(); setMenuOpen(false); }}>Выйти</button>}
          {!currentUser && <button className="mobile-menu-item" onClick={() => { onNavigate('auth'); setMenuOpen(false); }}>Войти</button>}
        </div>
      )}
    </header>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
