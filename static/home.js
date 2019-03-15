// var links = document.querySelectorAll("a.nav-link");
// console.log(links);
// for (i=0; i<links.length; i++) {
//     links[i].classList.add("nav-link-white");
// }

// var title = document.querySelector(".nav-title");
// title.classList.add("nav-title-white");

document.querySelector(".filter-button").addEventListener("click", openFilters);

function openFilters() {
    let filters = document.querySelector(".filter-options")
    if (filters.style.display === "none") {
        filters.style.display = "flex";
      } else {
        filters.style.display = "none";
      }
  }
