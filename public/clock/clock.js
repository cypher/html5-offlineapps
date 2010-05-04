function clock() {
  document.getElementById('clock').textContent = new Date();
  setTimeout(clock, 100);
}
