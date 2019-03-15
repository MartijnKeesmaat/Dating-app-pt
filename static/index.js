var remove = document.getElementById('js-remove')

if (remove) {
  remove.addEventListener('click', onremove)
}

function onremove(ev) {
  var node = ev.target
  var id = node.dataset.id

  // returns a promise
  fetch('/' + id, {method: 'delete'})
    .then(onresponse)
    .then(onload, onfail)

  function onresponse(res) {
    return res.json()
  }

  function onload() {
    window.location = '/'
  }

  function onfail() {
    throw new Error('Could not delete!')
    var error = document.getElementById('js-error');
    error.classList.add('display');
    }
}