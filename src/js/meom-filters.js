/* global kalaData, history, location */
/* eslint-disable @wordpress/no-unused-vars-before-return */

/* Import external depedencies. */
import { getQueryArgs } from '@wordpress/url';

/* Import internal depedencies. */
import buildQueryString from './helpers/buildQueryString';
import getCheckedCheckboxes from './helpers/getCheckedCheckboxes';
import clearFields from './helpers/clearFields';
import fetchPosts from './helpers/fetchPosts';

/**
 * Filters.
 */
const filters = () => {
    // Filters terms form.
    const filtersTerms = document.querySelector('.js-filters-terms');

    // Bail if there is no filters nor markup wrapper.
    if (!filtersTerms) {
        return;
    }

    // Filter order form.
    const filtersOrder = document.querySelector('.js-filters-order');

    // Search field.
    const searchField = document.querySelector('.js-filters-search-field');

    // Load more button.
    const loadMore = document.querySelector('.js-filters-items-load-more');

    // All checkboxes.
    const allCheckboxes = filtersTerms.querySelectorAll(
        'input[type="checkbox"]'
    );

    // All input fields.
    const allInputFields = filtersTerms.querySelectorAll(
        'input[type="text"]',
        'input[type="number"]'
    );

    const allCategoryCheckboxes = filtersTerms.querySelectorAll(
        'input[type="checkbox"].js-filters-tax-category'
    );

    // Post type to query.
    const postType =
        typeof kalaData !== 'undefined' && kalaData.postType
            ? kalaData.postType
            : 'post';

    // Default filter arguments.
    const args = {
        post_type: postType,
        posts_per_page: 4,
        paged: 1,
    };

    // Let's pick what we put in to the URL.
    let urlObject = {};

    // Add default state for history.
    const stateFromUrl = getQueryArgs(document.location.href);

    if (Object.entries(stateFromUrl).length > 0) {
        history.replaceState(
            stateFromUrl,
            document.title,
            document.location.href
        );
    }

    /**
     * Handle fetching data.
     *
     * @param {boolean} append Append to markup or not.
     */
    function handleFetch(append = false) {
        // Reset filter state at first.
        args.tax_query = [];
        args.meta_query = [];

        // Reset urlObject first.
        urlObject = {};

        // Query for ``post` post type.
        if (postType === 'post') {
            // Add tax_query if we have checked checkboxes.
            // Get all category checked checkboxes.
            const allCategories = getCheckedCheckboxes(
                'input[type="checkbox"].js-filters-tax-category'
            );

            const allCategoriesLength = allCategories.length;

            if (allCategoriesLength > 0) {
                args.tax_query.push({
                    taxonomy: 'category',
                    field: 'slug',
                    terms: allCategories,
                });

                urlObject.category = allCategories;
            }

            // Handle order.
            const orderSelect = document.querySelector(
                '.js-filters-order-select'
            );
            if (orderSelect) {
                // Order value.
                const orderValue = orderSelect.value;

                // Latest first.
                if (orderValue === 'oldest-first') {
                    args.order = 'ASC';
                }

                // By title asc.
                if (orderValue === 'title-asc') {
                    args.orderby = 'post_title';
                    args.order = 'ASC';
                }

                // By title desc.
                if (orderValue === 'title-desc') {
                    args.orderby = 'post_title';
                    args.order = 'DESC';
                }

                // Default is the newest, we don't need any order for that.
                if (orderValue !== 'newest-first') {
                    urlObject.order = orderValue;
                }
            }
        }

        // Reset args.s before setting new one so that old value is not there.
        args.s = '';

        // Add search if there is value.
        if (searchField && searchField.value) {
            args.s = searchField.value;
        }

        // Add page number to fetch or reset to back to 1.
        if (append) {
            args.paged = 1 + args.paged;
        } else {
            args.paged = 1;
        }

        // Fetch posts based on args.
        fetchPosts(args, append);

        // Build query string if we have urlObject. Else remove query string from the URL.
        const updatedUrl =
            Object.entries(urlObject).length > 0
                ? '?' + buildQueryString(urlObject)
                : `${location.protocol}//${location.host}${location.pathname}`;

        // Add state to the history and update URL.
        history.pushState(args, document.title, updatedUrl);
    }

    /**
     * Handle changes on form.
     *
     * @param {Object} event Event object.
     */
    function handleChange(event) {
        event.preventDefault();
        handleFetch(false);
    }

    /**
     * Handle load more button click.
     */
    function handleLoadMore() {
        // Do the fetch and append to existing posts.
        handleFetch(true);
    }

    /**
     * Init filters and load filters from URL query vars.
     */
    function initFilters() {
        // Clear all fields.
        clearFields(allCheckboxes, allInputFields, searchField);

        // Get state from the URL.
        const getStateFromUrl = getQueryArgs(document.location.href);

        // Check all checkboxes which match the URL query vars.
        // This way we can send the link to someone else or refresh the page.
        if (Object.entries(getStateFromUrl).length > 0) {
            // Check all checkboxes found from category array.
            if (
                getStateFromUrl.category &&
                getStateFromUrl.category.length > 0
            ) {
                allCategoryCheckboxes.forEach((checkbox) => {
                    if (getStateFromUrl.category.includes(checkbox.value)) {
                        checkbox.checked = true;
                    }
                });
            }

            // Select correct order.
            if (getStateFromUrl.order) {
                const selectOrder = document.querySelector(
                    `.js-filters-order-select option[value="${getStateFromUrl.order}"]`
                );

                if (selectOrder) {
                    selectOrder.selected = true;
                }
            }
        }

        // Do the fetch.
        handleFetch(false);
    }

    // Listen change events in filters order form.
    if (filtersOrder) {
        filtersOrder.addEventListener('change', handleChange, false);
    }

    // Listen change and submit events on filters form.
    filtersTerms.addEventListener('change', handleChange, false);
    filtersTerms.addEventListener('submit', handleChange, false);

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
