/**
 * When to hide or show the load more button.
 *
 * https://gomakethings.com/serializing-form-data-with-the-vanilla-js-formdata-object/
 * https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json?rq=1
 *
 * @param {Object} formData Form data.
 */
function serializeForm(formData) {
    const dataValues = {};
    formData.forEach((value, key) => {
        // Reflect.has in favor of dataValues.hasOwnProperty(key).
        if (!Reflect.has(dataValues, key)) {
            dataValues[key] = value;
            return;
        }

        // Checkboxes etc. where you can get multiple values, set them as array.
        if (!Array.isArray(dataValues[key])) {
            dataValues[key] = [dataValues[key]];
        }

        // And push to array.
        dataValues[key].push(value);
    });

    return dataValues;
}
export default serializeForm;
