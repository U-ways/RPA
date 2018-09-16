/* landing script
============================================================================= */

let closedSidebarIcon = sidebar.querySelector('#closed-sidebar-icon');
let chevronIcon = chevron.querySelector('i');

/** allow expanding sidebar from the closed-sidebar-icon */
closedSidebarIcon.addEventListener("click", toggleSidebar);

/** sidebar is expanded by default on landing page */
chevronIcon.classList.replace( "fa-chevron-right", "fa-chevron-left" )
