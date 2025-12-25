document.addEventListener('DOMContentLoaded', () => {
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));
  const grid = document.getElementById('writeupsGrid');
  const cards = grid ? Array.from(grid.querySelectorAll('.writeup-card')) : [];

  function setActive(btn) {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function filterBy(tag) {
    const t = tag.toLowerCase();
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(',');
      const has = t === 'all' || tags.includes(t);
      card.style.display = has ? '' : 'none';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActive(btn);
      filterBy(btn.dataset.filter || 'all');
    });
  });
});
