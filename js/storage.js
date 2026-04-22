// js/storage.js — localStorage helpers

const KEYS = {
  USERS: 'trv_users',
  CURRENT: 'trv_current_user',
  BOOKINGS: 'trv_bookings',
  THEME: 'trv_theme',
};

function getUsers() {
  try { return JSON.parse(localStorage.getItem(KEYS.USERS)) || []; } catch { return []; }
}
function saveUsers(users) { localStorage.setItem(KEYS.USERS, JSON.stringify(users)); }

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(KEYS.CURRENT)) || null; } catch { return null; }
}
function setCurrentUser(user) { localStorage.setItem(KEYS.CURRENT, JSON.stringify(user)); }
function logout() { localStorage.removeItem(KEYS.CURRENT); }

function getBookings() {
  try { return JSON.parse(localStorage.getItem(KEYS.BOOKINGS)) || []; } catch { return []; }
}
function saveBookings(bookings) { localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings)); }

function addBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
}
function updateBooking(id, updates) {
  const bookings = getBookings().map(b => b.id === id ? { ...b, ...updates } : b);
  saveBookings(bookings);
}
function deleteBooking(id) {
  saveBookings(getBookings().filter(b => b.id !== id));
}

function isTableBooked(tableId, date, time, excludeBookingId = null) {
  return getBookings().some(b =>
    b.tableId === tableId &&
    b.date === date &&
    b.time === time &&
    b.status !== 'cancelled' &&
    b.id !== excludeBookingId
  );
}

function getTheme() { return localStorage.getItem(KEYS.THEME) || 'light'; }
function saveTheme(t) { localStorage.setItem(KEYS.THEME, t); }

// Seed demo user + bookings on first run
function initStorage() {
  const users = getUsers();
  if (!users.find(u => u.email === 'demo@example.com')) {
    users.push({ id: 'demo', name: 'Иванов Алексей', phone: '+7 (999) 111-22-33', email: 'demo@example.com', password: 'demo123' });
    saveUsers(users);
  }
  const bookings = getBookings();
  if (bookings.length === 0) {
    saveBookings(window.SEED_BOOKINGS || []);
  }
}

function generateId() {
  return 'b_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

Object.assign(window, {
  Storage: {
    getUsers, saveUsers, getCurrentUser, setCurrentUser, logout,
    getBookings, saveBookings, addBooking, updateBooking, deleteBooking,
    isTableBooked, getTheme, saveTheme, initStorage, generateId,
  }
});
