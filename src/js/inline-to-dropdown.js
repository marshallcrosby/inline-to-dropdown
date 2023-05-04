(function() {
    const inlineToDropdownEl = document.querySelectorAll('.inline-to-dropdown');

    if (inlineToDropdownEl.length) {
        let container;
        let dropdown;
        let dropdownChildren;
        let dropdownChildItem;
        let lastDropdownChildItem;

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

        window.addEventListener('resize', debounce(() => {
            inlineToDropdownEl.forEach(item => {
                reflowItems(item);
            });
            windowElement.classList.remove('js-window-resizing');
        }));
        
        function reflowItems(el) {
            el.classList.add('js-dropdown-has-children');
            container = el.querySelector('.inline-to-dropdown__group');
            dropdown = el.querySelector('.inline-to-dropdown__menu');
            dropdownChildren = dropdown.querySelectorAll('.inline-to-dropdown__item');

            dropdownChildren.forEach((item) => {
                container.appendChild(item);
            });
            
            while (isOverflown(container) === true) {
                dropdownChildItem = container.querySelectorAll('.inline-to-dropdown__item');
                lastDropdownChildItem = dropdownChildItem[dropdownChildItem.length - 1];
                dropdown.prepend(lastDropdownChildItem);
            }

            if (dropdown.children.length > 0) {
                el.classList.add('js-dropdown-has-children');
            } else {
                el.classList.remove('js-dropdown-has-children');
            }
        }

        function isOverflown(element) {
            return element.scrollWidth > element.clientWidth;
        }

        function debounce(func) {
            let timer;

            return function(event){
                if (timer) clearTimeout(timer);
                timer = setTimeout(func, 100, event);
            };
        }
    }
}());