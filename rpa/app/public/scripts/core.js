/* core script
  - core const elemnts will be shared and used globally with other scripts
============================================================================= */

const sidebar = document.querySelector('#sidebar');
const chevron = document.querySelector('#chevron');

chevron.addEventListener('click', toggleSidebar);

// used by lnading.js
function toggleSidebar () {
  let icon = chevron.querySelector('i');

  icon.classList.toggle('fa-chevron-right');
  icon.classList.toggle('fa-chevron-left');

  sidebar.classList.toggle('open');
  sidebar.classList.toggle('close');
}

let flashMsg = document.querySelector('#flash-message')

flashMsg.addEventListener('click', () => {
  flashMsg.classList.toggle('hide');
});

function toggleFlashIcons () {
  let icon = flashMsg.querySelector('i');
  icon.classList.toggle('fa-times-circle');
  icon.classList.toggle('fa-exclamation-circle');
}

flashMsg.addEventListener('mouseenter', toggleFlashIcons);
flashMsg.addEventListener('mouseleave', toggleFlashIcons);
