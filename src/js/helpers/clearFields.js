/**
 * Clear all fields.
 *
 * @param {Object} allCheckboxes
 * @param {Object} allInputFields
 * @param {Object} searchField
 */
function clearFields(allCheckboxes, allInputFields, searchField) {
    // Un-check all checkboxes on page load.
    allCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Empty fields on page load.
    allInputFields.forEach((field) => {
        field.value = '';
    });

    // Empty search field on page load.
    if (searchField) {
        searchField.value = '';
    }
}
export default clearFields;
