/**
 * When to hide or show the load more button.
 *
 * @param {number} pages    Total count of pages.
 * @param {Object} loadMore Loadmore element.
 * @param {Object} args     Arguments.
 */
function loadMoreMarkup(pages, loadMore, args) {
    if (!loadMore) {
        return;
    }

    if (args.paged >= pages) {
        loadMore.setAttribute('hidden', '');
    } else {
        loadMore.removeAttribute('hidden');
    }
}
export default loadMoreMarkup;
