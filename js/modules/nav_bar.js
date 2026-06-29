export function initNavBar() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.sidebar-close-btn');
    const sidebar = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    const mobileNav = document.querySelector('.mobile-nav');
    const gnbList = document.querySelector('.gnb-list');

    if (gnbList && mobileNav) {
        const clonedMenu = gnbList.cloneNode(true);
        clonedMenu.className = 'm-gnb-list';

        clonedMenu.querySelectorAll('.gnb-item').forEach(item => item.className = 'm-gnb-item');
        clonedMenu.querySelectorAll('.gnb-link').forEach(link => link.className = 'm-gnb-link');
        clonedMenu.querySelectorAll('.dropdown-menu').forEach(drop => drop.className = 'm-dropdown');

        mobileNav.appendChild(clonedMenu);
    }

    const toggleSidebar = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    hamburgerBtn?.addEventListener('click', toggleSidebar);
    closeBtn?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);

    mobileNav?.addEventListener('click', (e) => {
        const trigger = e.target.closest('.m-gnb-link');
        if (!trigger) return;

        const nextDropdown = trigger.nextElementSibling;
        if (nextDropdown && nextDropdown.classList.contains('m-dropdown')) {
            e.preventDefault();

            trigger.classList.toggle('active');

            if (nextDropdown.style.display === 'block') {
                nextDropdown.style.display = 'none';
            } else {
                nextDropdown.style.display = 'block';
            }
        }
    });
}