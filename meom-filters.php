<?php
/**
 * Plugin name: MEOM Filters
 * Author: MEOM
 * Author URI: https://www.meom.fi/
 * Description: Filter functionality.
 * Version: 1.0
 * License: GPL2 or later.
 * Text Domain: meom-filters
 * Domain Path: /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Load text domain.
function meom_filters_i18n() {
    load_plugin_textdomain(
        'meom-filters',
        false,
        basename( dirname( __FILE__ ) ) . '/languages'
    );
}
add_action( 'plugins_loaded', 'meom_filters_i18n', 2 );

require_once dirname( __FILE__ ) . '/inc/helpers.php';
require_once dirname( __FILE__ ) . '/inc/filters.php';
