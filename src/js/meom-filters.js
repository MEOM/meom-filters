/* eslint-disable @wordpress/no-unused-vars-before-return */

/* Import external depedencies. */
import { getQueryArgs } from '@wordpress/url';

/* Import internal depedencies. */
import handleFetch from './helpers/handleFetch';
import config from './../../filters-config.json';

/**
 * Filters.
 */
const filters = () => {
    // Filters form.
    const filtersForm = document.querySelector('[data-meom-filters="form"]');

    // Bail if there is no filters nor markup wrapper.
    if (!filtersForm) {
        return;
    }

    // Load more button.
    const loadMore = document.querySelector('[data-meom-filters="load-more"]');

    // Post type from data attribute `data-meom-filters-post-type`.
    const postType = filtersForm.getAttribute('data-meom-filters-post-type')
        ? filtersForm.getAttribute('data-meom-filters-post-type')
        : 'post';

    // Default filter arguments.
    const args = {
        post_type: postType,
        posts_per_page: 4,
        paged: 1,
    };

    // Let's pick what we put in to the URL.
    const urlObject = {};

    /**
     * Handle changes on form.
     */
    function handleChange() {
        handleFetch(false, args, urlObject, postType, filtersForm, config);
    }

    /**
     * Handle load more button click.
     *
     */
    function handleLoadMore() {
        // Do the fetch and append to existing posts.
        handleFetch(true, args, urlObject, postType, filtersForm, config);
    }

    /**
     * Init filters and load filters from URL query vars.
     */
    function initFilters() {
        // Clear all fields.
        filtersForm.reset();

        // Get state from the URL.
        const getStateFromUrl = getQueryArgs(document.location.href);

        // Check all checkboxes which match the URL query vars.
        // This way we can send the link to someone else or refresh the page.
        if (Object.entries(getStateFromUrl).length > 0) {
            // Loop tax_query from config.
            const taxQueries = config[postType].tax_query;
            if (taxQueries) {
                for (const taxQuery of taxQueries) {
                    const statesFromUrl = getStateFromUrl[taxQuery.urlKey];
                    if (statesFromUrl && statesFromUrl.length > 0) {
                        // Get all checkboxes based on name.
                        const allTaxCheckboxes = filtersForm.querySelectorAll(
                            `[name="${taxQuery.name}"]`
                        );

                        // Loop them over and check them if URL query parameter array includes the value.
                        const statesFromUrlValues = statesFromUrl.split(',');
                        allTaxCheckboxes.forEach((checkbox) => {
                            if (statesFromUrlValues.includes(checkbox.value)) {
                                checkbox.checked = true;
                            }
                        });
                    }
                }
            }

            // Select correct order.
            if (getStateFromUrl[config[postType].order.urlKey]) {
                const selectOrder = document.querySelector(
                    `[name="${config[postType].order.name}"] option[value="${
                        getStateFromUrl[config[postType].order.urlKey]
                    }"]`
                );

                if (selectOrder) {
                    selectOrder.selected = true;
                }
            }

            // Output search value.
            if (getStateFromUrl[config.search.urlKey]) {
                const search = document.querySelector(
                    `[name="${config.search.name}"]`
                );

                if (search) {
                    search.value = getStateFromUrl[config.search.urlKey];
                }
            }
        }

        // Do the fetch.
        handleFetch(false, args, urlObject, postType, filtersForm, config);
    }

    // Listen change and submit events on filters form.
    filtersForm.addEventListener('change', handleChange, false);
    filtersForm.addEventListener('submit', handleChange, false);

    // Listen load more clicks.
    if (loadMore) {
        loadMore.addEventListener('click', handleLoadMore, false);
    }

    // Listen history changes (browser back and forward button).
    // popstate have event.state which we could use but let's use the URL as source of truth.
    window.addEventListener('popstate', initFilters);

    // Init filters.
    initFilters();
};

export default filters;
