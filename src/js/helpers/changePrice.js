/**
 * Change price based on location.
 *
 */
function changePrice() {
    const priceArea = document.querySelector('.js-filters-prices');

    if (priceArea) {
        priceArea.options[priceArea.options.selectedIndex].selected = true;
        // Get all prices in house cards
        const prices = document.querySelectorAll('.js-model-item-info-price');

        // Get selected price area, this is numeric value (1 or 2 etc.).
        let priceAreaValue = priceArea.value;

        // Loop all prices and update the price based on data-price-x attribute.
        prices.forEach(function (price) {
            // If value is the default (0), let's set it to priceValue 1.
            if (priceAreaValue === '0') {
                priceAreaValue = 1;
            }

            const priceFromArea = price.getAttribute(
                `data-price-${priceAreaValue}`
            );
            price.innerHTML = `${priceFromArea} &euro;`;
        });
    }
}

export default changePrice;
