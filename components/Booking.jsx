// components/Booking.jsx — Restaurant detail + floor plan + booking form

const TIMES = ['11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

function RestaurantPage({ restaurantId, currentUser, onBack, onGoProfile, editBookingData, onEditDone }) {
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
  const tables = TABLES[restaurantId] || [];

  const today = new Date().toISOString().split('T')[0];
  const isEditing = !!editBookingData;

  const [date, setDate] = useState(isEditing ? editBookingData.date : today);
  const [time, setTime] = useState(isEditing ? editBookingData.time : '19:00');
  const [guests, setGuests] = useState(isEditing ? editBookingData.guests : 2);
  const [selectedTable, setSelectedTable] = useState(isEditing ? tables.find(t => t.id === editBookingData.tableId) : null);
  const [step, setStep] = useState(isEditing ? 'form' : 'plan'); // 'plan' | 'form' | 'done'

  const [form, setForm] = useState({
    name: isEditing ? editBookingData.name : (currentUser?.name || ''),
    phone: isEditing ? editBookingData.phone : (currentUser?.phone || ''),
    email: isEditing ? editBookingData.email : (currentUser?.email || ''),
    comment: isEditing ? editBookingData.comment : '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const setF = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFormErrors(e => ({ ...e, [k]: '' })); };

  function getTableStatus(table) {
    const booked = Storage.isTableBooked(table.id, date, time, isEditing ? editBookingData.id : null);
    if (booked) return 'booked';
    if (table.capacity < guests) return 'small';
    return 'free';
  }

  function handleSelectTable(table) {
    const status = getTableStatus(table);
    if (status === 'booked') return;
    setSelectedTable(table);
  }

  function validateForm() {
    const e = {};
    if (!form.name.trim()) e.name = 'Введите ФИО';
    if (!form.phone.trim()) e.phone = 'Введите телефон';
    else if (!/^\+?[\d\s\-()]{10,}$/.test(form.phone)) e.phone = 'Неверный формат';
    if (!form.email.trim()) e.email = 'Введите e-mail';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Неверный формат';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    if (isEditing) {
      Storage.updateBooking(editBookingData.id, { date, time, guests, tableId: selectedTable.id, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), comment: form.comment.trim() });
      onEditDone && onEditDone();
      return;
    }

    const booking = {
      id: Storage.generateId(),
      userId: currentUser.id,
      restaurantId,
      tableId: selectedTable.id,
      date, time,
      guests: Number(guests),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      comment: form.comment.trim(),
      status: 'confirmed',
      createdAt: Date.now(),
    };
    Storage.addBooking(booking);
    setConfirmedBooking(booking);
    setStep('done');
  }

  if (step === 'done' && confirmedBooking) {
    return <ConfirmScreen booking={confirmedBooking} restaurant={restaurant} table={selectedTable} onProfile={onGoProfile} onBack={onBack} />;
  }


  return (
    <div className="page-content">
      <div className="container">
        <button className="back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Назад
        </button>

        {/* Restaurant header */}
        <div className="rest-header">
          <div className="rest-header-image" style={!restaurant.image ? { background: `linear-gradient(135deg, ${restaurant.color}18, ${restaurant.color}35)` } : {}}>
            {restaurant.image ? (
              <img src={restaurant.image} alt={restaurant.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px'}} />
            ) : (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={restaurant.color} strokeWidth="1.2" opacity="0.4">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
              </svg>
            )}
          </div>
          <div className="rest-header-info">
            <h2 className="rest-name">{restaurant.name}</h2>
            <p className="rest-cuisine">{restaurant.cuisine} · {restaurant.priceLevel}</p>
            <p className="rest-desc">{restaurant.description}</p>
            <div className="rest-meta">
              <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {restaurant.address}</span>
              <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {restaurant.hours}</span>
              <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> {restaurant.phone}</span>
            </div>
          </div>
        </div>

        {/* Date/time/guests picker */}
        {step !== 'form' && (
          <div className="picker-bar">
            <div className="picker-group">
              <label className="picker-label">Дата</label>
              <input className="picker-input" type="date" value={date} min={today} onChange={e => { setDate(e.target.value); setSelectedTable(null); }} />
            </div>
            <div className="picker-group">
              <label className="picker-label">Время</label>
              <select className="picker-input" value={time} onChange={e => { setTime(e.target.value); setSelectedTable(null); }}>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="picker-group">
              <label className="picker-label">Гостей</label>
              <div className="guests-ctrl">
                <button onClick={() => { setGuests(g => Math.max(1,g-1)); setSelectedTable(null); }}>−</button>
                <span>{guests}</span>
                <button onClick={() => { setGuests(g => Math.min(10,g+1)); setSelectedTable(null); }}>+</button>
              </div>
            </div>
          </div>
        )}

        {step === 'plan' && (
          <>
            <h3 className="section-title">Выберите столик</h3>
            <div className="floor-legend">
              <span className="legend-item"><span className="legend-dot free"></span>Свободен</span>
              <span className="legend-item"><span className="legend-dot booked"></span>Занят</span>
              <span className="legend-item"><span className="legend-dot small"></span>Мест недостаточно</span>
              <span className="legend-item"><span className="legend-dot selected"></span>Выбран</span>
            </div>

            <FloorPlanSVG tables={tables} getStatus={getTableStatus} selectedTable={selectedTable} onSelect={handleSelectTable} restaurantId={restaurantId} />

            {selectedTable && (
              <div className="selected-info">
                <div>
                  <strong>Стол №{selectedTable.number}</strong> · {selectedTable.zone} · до {selectedTable.capacity} гостей
                </div>
                <button className="btn-primary" onClick={() => setStep('form')}>
                  Продолжить →
                </button>
              </div>
            )}
            {!selectedTable && (
              <p className="plan-hint">Нажмите на свободный столик для выбора</p>
            )}
          </>
        )}

        {step === 'form' && (
          <div className="booking-form-wrap">
            <div className="booking-summary">
              <h3 className="section-title">{isEditing ? 'Редактировать бронь' : 'Оформление брони'}</h3>
              <div className="summary-row">
                <span>{restaurant.name}</span>
                <span>Стол №{selectedTable?.number}, {selectedTable?.zone}</span>
              </div>
              <div className="summary-row">
                <span>{formatDate(date)}, {time}</span>
                <span>{noun(guests, ['гость','гостя','гостей'])}</span>
              </div>
              {!isEditing && <button className="btn-ghost-sm" onClick={() => setStep('plan')}>← Изменить столик</button>}
            </div>

            <form onSubmit={handleSubmit} noValidate className="booking-form">
              <div className="form-row-2">
                <Field label="ФИО" type="text" value={form.name} onChange={v => setF('name', v)} placeholder="Иванов Иван Иванович" error={formErrors.name} />
                <Field label="Телефон" type="tel" value={form.phone} onChange={v => setF('phone', v)} placeholder="+7 (999) 123-45-67" error={formErrors.phone} />
              </div>
              <Field label="E-mail" type="email" value={form.email} onChange={v => setF('email', v)} placeholder="you@example.com" error={formErrors.email} />
              <div className="field">
                <label className="field-label">Пожелания (необязательно)</label>
                <textarea className="field-input" rows={3} value={form.comment} onChange={e => setF('comment', e.target.value)} placeholder="Аллергии, особые пожелания, повод..." />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={() => isEditing ? (onEditDone && onEditDone()) : setStep('plan')}>Отмена</button>
                <button type="submit" className="btn-primary">{isEditing ? 'Сохранить изменения' : 'Подтвердить бронь'}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmScreen({ booking, restaurant, table, onProfile, onBack }) {
  return (
    <div className="page-content">
      <div className="container confirm-wrap">
        <div className="confirm-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2 className="confirm-title">Бронь подтверждена!</h2>
        <div className="confirm-card">
          <div className="confirm-row"><span>Ресторан</span><strong>{restaurant.name}</strong></div>
          <div className="confirm-row"><span>Столик</span><strong>№{table.number} · {table.zone}</strong></div>
          <div className="confirm-row"><span>Дата и время</span><strong>{formatDate(booking.date)}, {booking.time}</strong></div>
          <div className="confirm-row"><span>Гостей</span><strong>{booking.guests}</strong></div>
          <div className="confirm-row"><span>Имя</span><strong>{booking.name}</strong></div>
          <div className="confirm-row"><span>Телефон</span><strong>{booking.phone}</strong></div>
        </div>
        <div className="confirm-actions">
          <button className="btn-ghost" onClick={onBack}>На главную</button>
          <button className="btn-primary" onClick={onProfile}>Мои брони</button>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
}

Object.assign(window, { RestaurantPage, formatDate });
