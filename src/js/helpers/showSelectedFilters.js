import selectedFilterButton from './selectedFilterButton';

/**
 * Show selected filters.
 *
 * @param {Object} args Fetch arguments.
 */
function showSelectedFilters(args) {
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
}

export default showSelectedFilters;
