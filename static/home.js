var links = document.querySelectorAll("a.nav-link");
console.log(links);
for (i=0; i<links.length; i++) {
    links[i].classList.add("nav-link-white");
}

var title = document.querySelector(".nav-title");
title.classList.add("nav-title-white");
