const getPageToc = () => document.getElementsByClassName('pagetoc')[0];

const pageToc = getPageToc();
const pageTocChildren = [...pageToc.children];
const headers = [...document.getElementsByClassName('header')];


// Select highlighted item in ToC when clicking an item
pageTocChildren.forEach(child => {
    child.addEventHandler('click', () => {
        pageTocChildren.forEach(child => {
            child.classList.remove('active');
        });
        child.classList.add('active');
    });
});


/**
 * Test whether a node is in the viewport
 */
function isInViewport(node) {
    const rect = node.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}


/**
 * Set a new ToC entry.
 * Clear any previously highlighted ToC items, set the new one,
 * and adjust the ToC scroll position.
 */
function setTocEntry() {
    let activeEntry;
    const pageTocChildren = [...getPageToc().children];

    // Calculate which header is the current one at the top of screen
    headers.forEach(header => {
        if (window.pageYOffset >= header.offsetTop) {
            activeEntry = header;
        }
    });

    // Update selected item in ToC when scrolling
    pageTocChildren.forEach(child => {
        if (activeEntry.href.localeCompare(child.href) === 0) {
            child.classList.add('active');
        } else {
            child.classList.remove('active');
        }
    });

    let tocEntryForLocation = document.querySelector(`nav a[href="${activeEntry.href}"]`);
    if (tocEntryForLocation) {
        const headingForLocation = document.querySelector(activeEntry.hash);
        if (headingForLocation && isInViewport(headingForLocation)) {
            // Update ToC scroll
            const nav = getPageToc();
            const content = document.querySelector('html');
            if (content.scrollTop !== 0) {
                nav.scrollTo({
                    top: tocEntryForLocation.offsetTop - 100,
                    left: 0,
                    behavior: 'smooth',
                });
            } else {
                nav.scrollTop = 0;
            }
        }
    }
}


/**
 * Populate sidebar on load
 */
window.addEventListener('load', () => {
    // Only create table of contents if there is more than one header on the page
    if (headers.length > 1) {
        headers.forEach(header => {
            const link = document.createElement('a');

            // Indent shows hierarchy
            let indent = '0px';
            switch (header.parentElement.tagName) {
                case 'H2':
                    indent = '20px';
                    break;
                case 'H3':
                    indent = '30px';
                    break;
                case 'H4':
                    indent = '40px';
                    break;
                case 'H5':
                    indent = '50px';
                    break;
                case 'H6':
                    indent = '60px';
                    break;
                default:
                    break;
            }

            link.appendChild(document.createTextNode(header.text));
            link.style.paddingLeft = indent;
            link.href = header.href;
            pageToc.appendChild(link);
        });
        setTocEntry.call();
    }
});


// Handle active headers on scroll, if there is more than one header on the page
if (headers.length > 1) {
    window.addEventListener('scroll', setTocEntry);
}
