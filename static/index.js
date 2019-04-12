let remove = document.getElementById('js-remove');
let loginForm = document.querySelector('.login-tile');
let mainRegister = document.querySelector('main.register');
let registerForm = document.querySelector('main.register section.login-tile');
window.addEventListener('load', showLogin);
document.addEventListener('DOMContentLoaded', hideLogin);

if (remove) {
  remove.addEventListener('click', onremove);
}

function onremove(ev) {
  let node = ev.target;
  let id = node.dataset.id;
  let res = new XMLHttpRequest();

  res.open('DELETE', '/' + id);
  res.onload = onload;
  res.send();

  function onload() {
    if (res.status !== 200) {
      throw new Error('Can\'t remove user');
    }
    window.location = '/';
  }
}

function showLogin() {
  if (mainRegister) {
    registerForm.classList.add('show');
  }
  else {
    loginForm.classList.add('show');
  }
}

function hideLogin() {
  let lastTwoNavLinks = document.querySelectorAll('nav div a');
  for (let a of lastTwoNavLinks) {
    // source: https://christopheraue.net/design/fading-pages-on-load-and-unload
    a.addEventListener('click', function(event) {
      let link = event.currentTarget;
      let listener = function() {
        window.location = link.href;
        loginForm.removeEventListener('animationend', listener);
      };
      loginForm.addEventListener('animationend', listener);
      event.preventDefault();
      if (mainRegister) {
        registerForm.classList.remove('show');
        registerForm.classList.add('hide');
      }
      else {
        loginForm.classList.remove('show');
        loginForm.classList.add('hide');
      }
    });
  }
}
