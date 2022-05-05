import selectedFilterButton from './selectedFilterButton';
import handleFetch from './handleFetch';

/**
 * Show selected filters.
 *
 * @param {boolean} append      Append to markup or not.
 * @param {Object}  args        Arguments.
 * @param {Object}  urlObject   URL object, what to show in URL.
 * @param {string}  postType    Which post type.
 * @param {Object}  filtersForm Which form.
 * @param {Object}  config      JSON-config for filters.
 */
function showSelectedFilters(
    append = false,
    args,
    urlObject,
    postType,
    filtersForm,
    config
) {
    // Where to populate the selected items.
    const filtersSelected = document.querySelector(
        '[data-meom-filters="selected"]'
    );

    // Bail if there is no filters nor markup wrapper.
    if (!filtersSelected) {
        return;
    }

    filtersSelected.innerHTML = '';

    // Taxonomies.
    if (args.tax_query.length > 0) {
        const taxArgs = args.tax_query;

        for (const taxKey of taxArgs) {
            // If we have array of terms, let's loop them over.
            // And create a button to remote the same filter.
            if (Array.isArray(taxKey.terms)) {
                for (const taxValue of taxKey.terms) {
                    const buttonMarkup = selectedFilterButton(
                        taxKey.taxonomy,
                        taxValue
                    );

                    if (buttonMarkup) {
                        filtersSelected.appendChild(buttonMarkup);
                    }
                }
            } else {
                const buttonMarkup = selectedFilterButton(
                    taxKey.taxonomy,
                    taxKey.terms
                );

                if (buttonMarkup) {
                    filtersSelected.appendChild(buttonMarkup);
                }
            }
        }
    }

    /**
     * Handle selected filter button click.
     *
     * @param {Object} event
     */
    function handleSelectedFilters(event) {
        const target = event.target;
        // Use .closest because there can be SVG inside the button.
        const removeFilterButton = target.closest(
            '[data-meom-filters="remove-filter"]'
        );

        // If the clicked element doesn't have the correct data attribute, bail.
        if (!removeFilterButton) {
            return;
        }

        const key = removeFilterButton.getAttribute('data-meom-filters-key');
        const value = removeFilterButton.getAttribute(
            'data-meom-filters-value'
        );

        const selectedFilter = document.querySelector(
            'input[data-meom-filters="' + key + '"][value="' + value + '"]'
        );

        if (selectedFilter) {
            selectedFilter.checked = false;

            // Do the fetch.
            handleFetch(append, args, urlObject, postType, filtersForm, config);
        }
    }

    // Listen remove filter chips click.
    document.addEventListener('click', handleSelectedFilters, false);
}

export default showSelectedFilters;
