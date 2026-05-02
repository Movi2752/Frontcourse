// components/Home.jsx
const { useState, useMemo } = React;

function HomePage({ onSelectRestaurant }) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('Все');

  const allTags = ['Все', 'Русская кухня', 'Европейская кухня', 'Узбекская кухня', 'Интернациональная', 'Домашняя кухня'];

  const filtered = useMemo(() => {
    return RESTAURANTS.filter(r => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
        r.address.toLowerCase().includes(search.toLowerCase());
      const matchTag = activeTag === 'Все' || r.cuisine === activeTag ||
        r.tags.some(t => t.toLowerCase().includes(activeTag.toLowerCase()));
      return matchSearch && matchTag;
    });
  }, [search, activeTag]);

  return (
    <div className="page-content">
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Забронируйте столик<br/>в лучших ресторанах Москвы</h1>
          <p className="hero-sub">Выберите ресторан, дату и время — мы сохраним ваше место</p>
          <div className="search-wrap">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              className="search-input"
              placeholder="Ресторан, кухня или адрес..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="tags-row">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-chip${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >{tag}</button>
          ))}
        </div>

        <p className="results-count">{filtered.length} {noun(filtered.length, ['ресторан', 'ресторана', 'ресторанов'])}</p>

        <div className="restaurants-grid">
          {filtered.length === 0 && (
            <div className="empty-state">
              <span style={{fontSize:48}}>🍽</span>
              <p>Ничего не найдено</p>
              <button className="btn-ghost" onClick={() => { setSearch(''); setActiveTag('Все'); }}>Сбросить фильтры</button>
            </div>
          )}
          {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={() => onSelectRestaurant(r.id)} />)}
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant: r, onClick }) {
  return (
    <div className="restaurant-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key==='Enter'&&onClick()}>
      <div className="card-image" style={{ background: `linear-gradient(135deg, ${r.color}22 0%, ${r.color}44 100%)` }}>
        {r.image ? (
          <picture style={{ display: 'contents' }}>
            <source srcSet={r.image.replace(/\.(jpe?g|png)$/i, '.webp')} type="image/webp" />
            <img 
              src={r.image} 
              alt={r.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              loading="lazy"
              onError={(e) => e.target.style.display = 'none'}
            />
          </picture>
        ) : (
          <div className="card-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.5" opacity="0.6">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
            </svg>
            <span style={{color: r.color, opacity:0.5, fontSize:11, marginTop:6, fontFamily:'monospace'}}>фото ресторана</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="card-top">
          <h3 className="card-name">{r.name}</h3>
          <div className="card-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {r.rating}
          </div>
        </div>
        <p className="card-cuisine">{r.cuisine}</p>
        <p className="card-address">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {r.metro} · {r.address.split(',')[0]}
        </p>
        <div className="card-tags">
          {r.tags.map(t => <span key={t} className="card-tag">{t}</span>)}
        </div>
        <div className="card-footer">
          <span className="card-hours">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {r.hours}
          </span>
          <button className="btn-accent-sm" onClick={e => { e.stopPropagation(); onClick(); }}>Забронировать</button>
        </div>
      </div>
    </div>
  );
}

function noun(n, forms) {
  const abs = Math.abs(n) % 100;
  const mod = abs % 10;
  if (abs >= 11 && abs <= 19) return `${n} ${forms[2]}`;
  if (mod === 1) return `${n} ${forms[0]}`;
  if (mod >= 2 && mod <= 4) return `${n} ${forms[1]}`;
  return `${n} ${forms[2]}`;
}

Object.assign(window, { HomePage, RestaurantCard, noun });
