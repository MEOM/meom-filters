/**
 * Get all checked checkboxes for different filters.
 *
 * @param {Object} elements Elements to loop.
 */
function getCheckedCheckboxes(elements) {
    // Get all checkboxes.
    const checkboxes = document.querySelectorAll(elements);

    // Collect checked ones in array.
    const allChecked = [];

    // Collect checked ones and add value (taxonomy slug) to array.
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            allChecked.push(checkbox.value);
        }
    });

    // Return checked ones.
    return allChecked;
}

export default getCheckedCheckboxes;
