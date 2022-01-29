/* global kalaData, history, location, FormData */
/* eslint-disable @wordpress/no-unused-vars-before-return */

/* Import external depedencies. */
import { getQueryArgs } from '@wordpress/url';

/* Import internal depedencies. */
import buildQueryString from './helpers/buildQueryString';
import fetchPosts from './helpers/fetchPosts';
import serializeForm from './helpers/serializeForm';
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

        // Query for `post` post type.
        if (postType === 'post') {
            // Get data from form.
            const formData = new FormData(filtersForm);
            const dataValues = serializeForm(formData);

            // Loop tax_query from config.
            const taxQueries = config.tax_query;
            for (const taxQuery of taxQueries) {
                if (
                    dataValues[taxQuery.name] &&
                    dataValues[taxQuery.name].length > 0
                ) {
                    args.tax_query.push({
                        taxonomy: taxQuery.taxonomy,
                        field: 'slug',
                        terms: dataValues[taxQuery.name],
                    });

                    // Add URL query parameter.
                    urlObject[taxQuery.urlKey] = dataValues[taxQuery.name];
                }
            }

            // Handle order.
            const orderName = config.order.name;
            if (dataValues[orderName]) {
                // Latest first.
                if (dataValues[orderName] === 'newest-first') {
                    args.orderby = 'date';
                    args.order = 'DESC';
                }

                // Oldest first.
                if (dataValues[orderName] === 'oldest-first') {
                    args.orderby = 'date';
                    args.order = 'ASC';
                }

                // By title asc.
                if (dataValues[orderName] === 'title-asc') {
                    args.orderby = 'post_title';
                    args.order = 'ASC';
                }

                // By title desc.
                if (dataValues[orderName] === 'title-desc') {
                    args.orderby = 'post_title';
                    args.order = 'DESC';
                }

                // Default is the newest, we don't need any order for that.
                if (dataValues[orderName] !== 'newest-first') {
                    urlObject[config.order.urlKey] = dataValues[orderName];
                }
            }

            // Reset search (args.s) before setting new one so that old value is not there.
            args.s = '';

            // Add search if there is value.
            if (dataValues[config.search.name]) {
                args.s = dataValues[config.search.name];

                urlObject[config.search.urlKey] =
                    dataValues[config.search.name];
            }
        }

        // Add page number to fetch or reset to back to 1.
        if (append) {
            args.paged = 1 + args.paged;
        } else {
            args.paged = 1;
        }

        // Fetch posts based on args.
        fetchPosts(args, append, filtersForm);

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
     *
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
        filtersForm.reset();

        // Get state from the URL.
        const getStateFromUrl = getQueryArgs(document.location.href);

        // Check all checkboxes which match the URL query vars.
        // This way we can send the link to someone else or refresh the page.
        if (Object.entries(getStateFromUrl).length > 0) {
            // Loop tax_query from config.
            const taxQueries = config.tax_query;
            for (const taxQuery of taxQueries) {
                if (
                    getStateFromUrl[taxQuery.urlKey] &&
                    getStateFromUrl[taxQuery.urlKey].length > 0
                ) {
                    // Get all checkboxes based on name.
                    const allTaxCheckboxes = filtersForm.querySelectorAll(
                        `[name="${taxQuery.name}"]`
                    );

                    // Loop them over and check them if URL query string includes the value.
                    allTaxCheckboxes.forEach((checkbox) => {
                        if (
                            getStateFromUrl[`${taxQuery.urlKey}`].includes(
                                checkbox.value
                            )
                        ) {
                            checkbox.checked = true;
                        }
                    });
                }
            }

            // Select correct order.
            if (getStateFromUrl[config.order.urlKey]) {
                const selectOrder = document.querySelector(
                    `[name="${config.order.name}"] option[value="${
                        getStateFromUrl[config.order.urlKey]
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
        handleFetch(false);
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
