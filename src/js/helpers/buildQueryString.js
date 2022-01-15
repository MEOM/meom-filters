/*
 * Build a query string from an object of data
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com/how-to-build-a-query-string-from-an-object-of-data-with-vanilla-js/
 * @param  {Object} data The data to turn into a query string
 * @return {String}      The query string
 */
function buildQueryString(data) {
    return new URLSearchParams(data).toString();
}
export default buildQueryString;
