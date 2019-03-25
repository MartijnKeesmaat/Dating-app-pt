/* eslint-disable require-jsdoc */

document.querySelector('.filter-button').addEventListener('click', openFilters);

function openFilters() {
  const filters = document.querySelector('.filter-options');
  if (filters.style.display === 'none') {
    filters.style.display = 'flex';
  } else {
    filters.style.display = 'none';
  }
}
