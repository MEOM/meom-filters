/* global history, location, FormData */

/* Import internal depedencies. */
import buildQueryString from './buildQueryString';
import fetchPosts from './fetchPosts';
import showSelectedFilters from './showSelectedFilters';
import serializeForm from './serializeForm';

/**
 * Handle fetching data.
 *
 * @param {boolean} append      Append to markup or not.
 * @param {Object}  args        Arguments.
 * @param {Object}  urlObject   URL object, what to show in URL.
 * @param {string}  postType    Which post type.
 * @param {Object}  filtersForm Which form.
 * @param {Object}  config      JSON-config for filters.
 */
function handleFetch(
    append = false,
    args,
    urlObject,
    postType,
    filtersForm,
    config
) {
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
        const taxQueries = config[postType].tax_query;

        if (taxQueries) {
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
        }

        // Handle order.
        const orderName = config[postType].order.name;
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
                urlObject[config.post.order.urlKey] = dataValues[orderName];
            }
        }

        // Reset search (args.s) before setting new one so that old value is not there.
        args.s = '';

        // Add search if there is value.
        if (dataValues[config.search.name]) {
            args.s = dataValues[config.search.name];

            urlObject[config.search.urlKey] = dataValues[config.search.name];
        }
    }

    // Query for `page` post type.
    if (postType === 'page') {
        // Get data from form.
        const formData = new FormData(filtersForm);
        const dataValues = serializeForm(formData);

        // Handle order.
        const orderName = config[postType].order.name;
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
            if (dataValues[orderName] !== 'title-asc') {
                urlObject[config.page.order.urlKey] = dataValues[orderName];
            }
        }

        // Reset search (args.s) before setting new one so that old value is not there.
        args.s = '';

        // Add search if there is value.
        if (dataValues[config.search.name]) {
            args.s = dataValues[config.search.name];

            urlObject[config.search.urlKey] = dataValues[config.search.name];
        }
    }

    // Language code to show right string translations.
    const languageCode = document.querySelector('input[name="language_code"]');
    if (languageCode) {
        args.language_code = languageCode.value;
    }

    // Language slug to get items only from current language.
    const lang = document.querySelector('input[name="lang"]');
    if (lang) {
        args.lang = lang.value;
    }

    // Add page number to fetch or reset to back to 1.
    if (append) {
        args.paged = 1 + args.paged;
    } else {
        args.paged = 1;
    }

    // Fetch posts based on args.
    fetchPosts(args, append, filtersForm);

    // Add buttons which match the selected filters.
    // By clicking them it will remove that filter.
    showSelectedFilters(append, args, urlObject, postType, filtersForm, config);

    // Build query string if we have urlObject. Else remove query string from the URL.
    const updatedUrl =
        Object.entries(urlObject).length > 0
            ? '?' + buildQueryString(urlObject)
            : `${location.protocol}//${location.host}${location.pathname}`;

    // Add state to the history and update URL.
    history.pushState(args, document.title, updatedUrl);
}

export default handleFetch;
