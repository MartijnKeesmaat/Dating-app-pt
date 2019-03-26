
/* eslint-disable max-len */
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

// sources:
// https://stackoverflow.com/questions/8838648/onchange-event-handler-for-radio-button-input-type-radio-doesnt-work-as-one
// https://www.w3schools.com/jsref/met_form_submit.asp
const rad = document.filterOptions.sort;
for (let i = 0; i < rad.length; i++) {
  rad[i].addEventListener('change', function() {
    document.getElementById('filterOptions').submit();
  });
}