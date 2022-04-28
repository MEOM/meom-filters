/**
 * Markup for the button holding the selected filter.
 *
 * @param {string} key   Name for the key.
 * @param {string} value Name for the value
 */
function selectedFilterButton(key, value) {
    // Value is weird for number value 0.
    if (!key || (!value && value !== 0)) {
        return;
    }

    const selectedFilter = document.querySelector(
        `input[data-meom-filters="${key}"][value="${value}"]`
    );

    if (!selectedFilter) {
        return;
    }

    const label = selectedFilter.getAttribute('data-meom-filters-label');

    if (!label) {
        return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-meom-filters', 'remove-filter');
    button.setAttribute('data-meom-filters-key', key);
    button.setAttribute('data-meom-filters-value', value);
    button.className = 'filters__remove-filter';
    button.innerHTML =
        label +
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z" /></svg>';

    return button;
}
export default selectedFilterButton;
