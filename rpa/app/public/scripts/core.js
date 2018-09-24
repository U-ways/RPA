/* core script
  - core const elemnts will be shared and used globally with other scripts
============================================================================= */

const head    = document.querySelector('#head');
const main    = document.querySelector('#sub-container');
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

/* navigate
============================================================================= */

async function navigate (section) {
  try {
    /** fetch section html */
    let data = await fetch(`./app/${section}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      return response.json()
      .then(data => {
        if (response.ok) return data;
        else             return Promise.reject({ status: response.status, data });
      });
    });

    /** update window title */
    let title  = head.querySelector('title');
    title.innerHTML = `RPA | ${section}`;

    /** update section content */
    main.innerHTML = data.html;

    /** update section heading */
    let heading = document.querySelector('#topbar h1');
    heading.innerHTML = section;

    /* update section stylesheets */
    let styles = head.querySelectorAll('link[data-type=section-style]');
    if (styles !== null) {
      styles.forEach(style => {
        style.remove();
      })
    }
    data.meta.stylesheets.forEach(href => {
      let style  = document.createElement('link');
      style.rel  = 'stylesheet';
      style.href = href;
      style.dataset.type = 'section-style';
      head.appendChild(style);
    });

    /* update section scripts */
    let scripts = head.querySelectorAll('script[data-type=section-script]');
    if (scripts !== null) {
      scripts.forEach(script => {
        script.remove();
      })
    }
    data.meta.scripts.forEach(src => {
      let script   = document.createElement('script');
      script.type  = 'text/javascript';
      script.src   = src;
      script.defer = 'defer';
      script.dataset.type = 'section-script';
      head.appendChild(script);
    });

    return true;
  }
  catch (error) {
    // TODO: add a better error handler
    main.innerHTML = 'Not found, sorry...'
    console.log('Unable to fetch content:');
    console.error(error);

    return false;
  }
}
