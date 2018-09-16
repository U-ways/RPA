/* core script
  - core const elemnts will be shared and used globally with other scripts
============================================================================= */

const sidebar = document.querySelector('#sidebar');
const chevron = document.querySelector('#chevron');

chevron.addEventListener("click", toggleSidebar);

function toggleSidebar () {
  let icon = chevron.querySelector('i');

  icon.classList.toggle("fa-chevron-right");
  icon.classList.toggle("fa-chevron-left");

  sidebar.classList.toggle("open");
  sidebar.classList.toggle("close");
}
