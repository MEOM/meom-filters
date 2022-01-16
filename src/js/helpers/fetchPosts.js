/* global kalaData, fetch */
/* eslint-disable @wordpress/no-unused-vars-before-return */

/* Import external depedencies. */
import { speak } from '@wordpress/a11y';
import { addQueryArgs } from '@wordpress/url';

/* Import internal depedencies. */
import loadMoreMarkup from './loadMoreMarkup';

/**
 * Fetch data based on args.
 *
 * @param {Object}  args   Arguments for query.
 * @param {boolean} append Append markup or not.
 */
function fetchPosts(args, append = false) {
    // Where to populate markup.
    const filtersItems = document.querySelector(
        '[data-meom-filters="items-content"]'
    );

    // Bail if there is no filters nor markup wrapper.
    if (!filtersItems) {
        return;
    }

    // Spinner.
    const spinner = document.querySelector('[data-meom-filters="spinner"]');

    // Load more button.
    const loadMore = document.querySelector('[data-meom-filters="load-more"]');

    if (!args) {
        return;
    }

    // Animations.
    filtersItems.classList.add('is-loading');

    // Start showing spinner.
    if (spinner) {
        spinner.removeAttribute('hidden');
    }

    // Fetch the data based on args.
    fetch(addQueryArgs('/wp-json/wp_query/args/', args))
        .then(function (response) {
            // The API call was succesful.
            if (response.ok) {
                // Add total amount of pages to the state.
                const pages = parseInt(
                    response.headers.get('x-wp-totalpages'),
                    10
                );
                args.pages = pages;

                // Add total count of results to the state.
                const count = parseInt(response.headers.get('x-wp-total'), 10);
                args.count = count;

                // And to HTML.
                const countWrapper = document.querySelector(
                    '[data-meom-filters="submit-count"]'
                );
                if (countWrapper) {
                    countWrapper.innerHTML = ` (${count})`;
                }

                // Handle load more button visibility.
                loadMoreMarkup(pages, loadMore, args);

                return response.json();
            }
            return Promise.reject(response);
        })
        .then(function (data) {
            // `data.html` has markup already.
            const markup = data.html
                ? data.html
                : `<p>${data.messages.empty}</p>`;

            // Append to existing markup if we are loading more content.
            if (append) {
                filtersItems.innerHTML += markup;
            } else {
                // Reset content first.
                filtersItems.innerHTML = '';

                filtersItems.innerHTML = markup;
            }

            // End animation and hide the spinner.
            filtersItems.classList.remove('is-loading');
            if (spinner) {
                spinner.setAttribute('hidden', '');
            }

            // Announce screen readers and other AT base info on the fly.
            const announceText = data.html
                ? kalaData.filtersApplied // From where to translate?
                : data.messages.empty;

            speak(announceText);
        })
        .catch(function (err) {
            // There was an error.
            console.warn('Something went wrong.', err); // eslint-disable-line

            filtersItems.classList.remove('is-loading');
            if (spinner) {
                spinner.setAttribute('hidden', '');
            }
        });
}

export default fetchPosts;
