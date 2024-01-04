/*!
    * Inline to dropdown v2.0.0
    * Automatically add/remove overflown inline items into a dropdown.
    *
    * Copyright 2024 Marshall Crosby
    * https://marshallcrosby.com
*/

(function() {
    const inlineToDropdownEl = document.querySelectorAll('.inline-to-dropdown');

    if (inlineToDropdownEl.length) {
        inlineToDropdownEl.forEach(item => {
            reflowItems(item);
            item.classList.add('js-inline-to-dropdown--loaded')
        });

        const windowElement = document.documentElement;
        let windowWidth = window.innerWidth;
        
        window.addEventListener('resize', () => {
            let newWindowWidth = window.innerWidth;
            if (windowWidth !== newWindowWidth) {
                windowElement.classList.add('js-window-resizing');
            }
            windowWidth = newWindowWidth;
        });
        
        let windowWidthDebounce = window.innerWidth;
        window.addEventListener('resize', itdDebounce(() => {
            let newWindowWidthDebounce = window.innerWidth;
            if (windowWidthDebounce !== newWindowWidthDebounce) {
                inlineToDropdownEl.forEach(item => {
                    reflowItems(item);
                });
                windowElement.classList.remove('js-window-resizing');
            }
            windowWidthDebounce = newWindowWidthDebounce;
        }));
        
        function reflowItems(el) {
            const container = el.querySelector('.inline-to-dropdown__group');
            const dropdown = el.querySelector('.inline-to-dropdown__menu');
            const dropdownChildren = dropdown.querySelectorAll('.inline-to-dropdown__item');

            for (const item of dropdownChildren) {
                container.appendChild(item);
            }
            
            while (isOverflown(container) === true) {
                const dropdownChildItem = container.querySelectorAll('.inline-to-dropdown__item');
                const lastDropdownChildItem = dropdownChildItem[dropdownChildItem.length - 1];
                dropdown.prepend(lastDropdownChildItem);
            }
        }

        function isOverflown(element) {
            return Math.floor(element.scrollWidth) > Math.floor(element.clientWidth);
        }

        function itdDebounce(func) {
            let timer;
            return function(event) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(func, 200, event);
            };
        }
    }
}());