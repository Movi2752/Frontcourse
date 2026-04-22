// components/Auth.jsx
const { useState } = React;

function AuthPage({ onLogin, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); setServerError(''); };

  function validateLogin() {
    const e = {};
    if (!form.email.trim()) e.email = 'Введите e-mail';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Неверный формат e-mail';
    if (!form.password) e.password = 'Введите пароль';
    return e;
  }
  function validateRegister() {
    const e = {};
    if (!form.name.trim()) e.name = 'Введите ФИО';
    if (!form.phone.trim()) e.phone = 'Введите телефон';
    else if (!/^\+?[\d\s\-()]{10,}$/.test(form.phone)) e.phone = 'Неверный формат телефона';
    if (!form.email.trim()) e.email = 'Введите e-mail';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Неверный формат e-mail';
    if (!form.password) e.password = 'Введите пароль';
    else if (form.password.length < 6) e.password = 'Минимум 6 символов';
    if (form.password !== form.confirm) e.confirm = 'Пароли не совпадают';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'login') {
      const errs = validateLogin();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      const users = Storage.getUsers();
      const user = users.find(u => u.email === form.email && u.password === form.password);
      if (!user) { setServerError('Неверный e-mail или пароль'); return; }
      Storage.setCurrentUser(user);
      onLogin(user);
    } else {
      const errs = validateRegister();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      const users = Storage.getUsers();
      if (users.find(u => u.email === form.email)) { setServerError('Пользователь с таким e-mail уже существует'); return; }
      const user = { id: 'u_' + Date.now(), name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), password: form.password };
      users.push(user);
      Storage.saveUsers(users);
      Storage.setCurrentUser(user);
      onLogin(user);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Tischreservierung</div>
        <p className="auth-sub">{mode === 'login' ? 'Войдите в аккаунт' : 'Создайте аккаунт'}</p>

        <div className="auth-tabs">
          <button className={`auth-tab${mode==='login'?' active':''}`} onClick={() => { setMode('login'); setErrors({}); setServerError(''); }}>Вход</button>
          <button className={`auth-tab${mode==='register'?' active':''}`} onClick={() => { setMode('register'); setErrors({}); setServerError(''); }}>Регистрация</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <>
              <Field label="ФИО" type="text" value={form.name} onChange={v => set('name', v)} placeholder="Иванов Иван Иванович" error={errors.name} />
              <Field label="Телефон" type="tel" value={form.phone} onChange={v => set('phone', v)} placeholder="+7 (999) 123-45-67" error={errors.phone} />
            </>
          )}
          <Field label="E-mail" type="email" value={form.email} onChange={v => set('email', v)} placeholder="you@example.com" error={errors.email} />
          <Field label="Пароль" type="password" value={form.password} onChange={v => set('password', v)} placeholder="••••••" error={errors.password} />
          {mode === 'register' && (
            <Field label="Подтвердите пароль" type="password" value={form.confirm} onChange={v => set('confirm', v)} placeholder="••••••" error={errors.confirm} />
          )}

          {serverError && <div className="form-error-banner">{serverError}</div>}

          <button type="submit" className="btn-primary w-full mt16">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="auth-hint">Демо-аккаунт: <code>demo@example.com</code> / <code>demo123</code></p>
        )}
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, error }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        className={`field-input${error ? ' has-error' : ''}`}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : undefined}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

Object.assign(window, { AuthPage, Field });
