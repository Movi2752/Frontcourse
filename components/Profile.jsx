// components/Profile.jsx
const { useState, useMemo } = React;

function ProfilePage({ currentUser, onLogout, onEditBooking, onNavigate }) {
  const [tab, setTab] = useState('upcoming');
  const [editingUser, setEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({ name: currentUser.name, phone: currentUser.phone, email: currentUser.email });
  const [userErrors, setUserErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const allBookings = useMemo(() => {
    return Storage.getBookings()
      .filter(b => b.userId === currentUser.id)
      .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
  }, [refreshKey]);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();

  function classifyBooking(b) {
    const bDate = new Date(b.date + 'T' + b.time);
    if (b.status === 'cancelled') return 'cancelled';
    return bDate >= now ? 'upcoming' : 'past';
  }

  const grouped = useMemo(() => ({
    upcoming: allBookings.filter(b => classifyBooking(b) === 'upcoming'),
    past: allBookings.filter(b => classifyBooking(b) === 'past'),
    cancelled: allBookings.filter(b => classifyBooking(b) === 'cancelled'),
  }), [allBookings]);

  const displayed = grouped[tab];

  function handleCancelBooking(id) {
    Storage.updateBooking(id, { status: 'cancelled' });
    setDeleteConfirm(null);
    setRefreshKey(k => k + 1);
  }

  function handleDeleteBooking(id) {
    Storage.deleteBooking(id);
    setDeleteConfirm(null);
    setRefreshKey(k => k + 1);
  }

  const setUF = (k, v) => { setUserForm(f => ({ ...f, [k]: v })); setUserErrors(e => ({ ...e, [k]: '' })); };

  function saveUserProfile(e) {
    e.preventDefault();
    const errs = {};
    if (!userForm.name.trim()) errs.name = 'Введите ФИО';
    if (!userForm.phone.trim()) errs.phone = 'Введите телефон';
    else if (!/^\+?[\d\s\-()]{10,}$/.test(userForm.phone)) errs.phone = 'Неверный формат';
    if (!userForm.email.trim()) errs.email = 'Введите e-mail';
    else if (!/\S+@\S+\.\S+/.test(userForm.email)) errs.email = 'Неверный формат';
    if (Object.keys(errs).length) { setUserErrors(errs); return; }

    const users = Storage.getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], name: userForm.name.trim(), phone: userForm.phone.trim(), email: userForm.email.trim() };
      Storage.saveUsers(users);
      Storage.setCurrentUser(users[idx]);
      Object.assign(currentUser, users[idx]);
    }
    setEditingUser(false);
  }

  const TABS = [
    { key: 'upcoming', label: 'Предстоящие', count: grouped.upcoming.length },
    { key: 'past',     label: 'Прошедшие',   count: grouped.past.length },
    { key: 'cancelled',label: 'Отменённые',  count: grouped.cancelled.length },
  ];

  return (
    <div className="page-content">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-avatar">
              {currentUser.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
            </div>
            {!editingUser ? (
              <>
                <h3 className="profile-name">{currentUser.name}</h3>
                <p className="profile-contact">{currentUser.email}</p>
                <p className="profile-contact">{currentUser.phone}</p>
                <button className="btn-ghost w-full mt16" onClick={() => setEditingUser(true)}>Редактировать профиль</button>
                <button className="btn-danger w-full mt8" onClick={onLogout}>Выйти из аккаунта</button>
              </>
            ) : (
              <form onSubmit={saveUserProfile} noValidate className="profile-edit-form">
                <Field label="ФИО" type="text" value={userForm.name} onChange={v => setUF('name', v)} placeholder="Иванов Иван" error={userErrors.name} />
                <Field label="Телефон" type="tel" value={userForm.phone} onChange={v => setUF('phone', v)} placeholder="+7 (999) …" error={userErrors.phone} />
                <Field label="E-mail" type="email" value={userForm.email} onChange={v => setUF('email', v)} placeholder="you@example.com" error={userErrors.email} />
                <button type="submit" className="btn-primary w-full mt8">Сохранить</button>
                <button type="button" className="btn-ghost w-full mt8" onClick={() => setEditingUser(false)}>Отмена</button>
              </form>
            )}
          </aside>

          {/* Bookings */}
          <div className="profile-main">
            <h2 className="profile-section-title">Мои брони</h2>

            <div className="profile-tabs">
              {TABS.map(t => (
                <button key={t.key} className={`profile-tab${tab===t.key?' active':''}`} onClick={() => setTab(t.key)}>
                  {t.label}
                  {t.count > 0 && <span className="tab-badge">{t.count}</span>}
                </button>
              ))}
            </div>

            {displayed.length === 0 && (
              <div className="empty-state">
                <span style={{fontSize:40}}>📋</span>
                <p>Нет {tab === 'upcoming' ? 'предстоящих' : tab === 'past' ? 'прошедших' : 'отменённых'} бронирований</p>
                {tab === 'upcoming' && (
                  <button className="btn-primary mt8" onClick={() => onNavigate('home')}>Найти ресторан</button>
                )}
              </div>
            )}

            <div className="bookings-list">
              {displayed.map(b => {
                const restaurant = RESTAURANTS.find(r => r.id === b.restaurantId);
                const table = (TABLES[b.restaurantId] || []).find(t => t.id === b.tableId);
                const isUpcoming = classifyBooking(b) === 'upcoming';
                return (
                  <div key={b.id} className={`booking-card ${b.status === 'cancelled' ? 'cancelled' : ''}`}>
                    <div className="booking-card-accent" style={{ background: restaurant?.color || '#999' }} />
                    <div className="booking-card-body">
                      <div className="booking-card-top">
                        <div>
                          <h4 className="booking-rest-name">{restaurant?.name}</h4>
                          <p className="booking-cuisine">{restaurant?.cuisine}</p>
                        </div>
                        <div className={`booking-status ${b.status}`}>
                          {b.status === 'confirmed' ? 'Подтверждено' : b.status === 'cancelled' ? 'Отменено' : 'Прошло'}
                        </div>
                      </div>
                      <div className="booking-details">
                        <span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {formatDate(b.date)}, {b.time}
                        </span>
                        <span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {b.guests} {noun(b.guests, ['гость','гостя','гостей'])}
                        </span>
                        {table && (
                          <span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="3" rx="1"/><line x1="5" y1="10" x2="5" y2="20"/><line x1="19" y1="10" x2="19" y2="20"/></svg>
                            Стол №{table.number} · {table.zone}
                          </span>
                        )}
                      </div>
                      {b.comment && <p className="booking-comment">💬 {b.comment}</p>}
                      {isUpcoming && b.status !== 'cancelled' && (
                        <div className="booking-actions">
                          <button className="btn-ghost-sm" onClick={() => onEditBooking(b)}>Изменить</button>
                          <button className="btn-danger-sm" onClick={() => setDeleteConfirm({ id: b.id, type: 'cancel' })}>Отменить</button>
                        </div>
                      )}
                      {b.status === 'cancelled' && (
                        <div className="booking-actions">
                          <button className="btn-danger-sm" onClick={() => setDeleteConfirm({ id: b.id, type: 'delete' })}>Удалить</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>{deleteConfirm.type === 'cancel' ? 'Отменить бронирование?' : 'Удалить запись?'}</h3>
            <p>{deleteConfirm.type === 'cancel' ? 'Это действие нельзя отменить.' : 'Запись будет удалена навсегда.'}</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>Назад</button>
              <button className="btn-danger" onClick={() =>
                deleteConfirm.type === 'cancel' ? handleCancelBooking(deleteConfirm.id) : handleDeleteBooking(deleteConfirm.id)
              }>{deleteConfirm.type === 'cancel' ? 'Да, отменить' : 'Удалить'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ProfilePage });
