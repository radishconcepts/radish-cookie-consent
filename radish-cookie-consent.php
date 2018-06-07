<?php

/**
 * Plugin Name: Radish Concepts: Cookie Consent
 * Version: 1.0
 * Plugin URI: https://www.radishconcepts.com/radish-cookie-consent
 * Description: This plugin creates a cookie consent bar for your website
 * Author: Radish Concepts
 * Author URI: https://www.radishconcepts.com
 *
 **/


if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

define( 'RCC_DIRNAME', dirname( plugin_basename( __FILE__ ) ) );
define( 'RCC_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'RCC_CLASS_PATH', RCC_PLUGIN_PATH . '/classes/' );
define( 'RCC_TEMPLATES_PATH', RCC_PLUGIN_PATH . '/templates/' );
define( 'RCC_LANGUAGE_PATH', RCC_DIRNAME . '/languages' ); ///needs to be relative to the plugins-base-dir
define( 'RCC_PLUGIN_URI', WP_PLUGIN_URL . '/' . RCC_DIRNAME );

/**
 * Read the classes directory and include all php-files inside by 'require_once'.
 */
foreach ( glob( RCC_CLASS_PATH . '*.php' ) as $file ) {
	require_once( $file );
}

//if it exists, create it!
if ( class_exists( 'RCC_Frontend' ) ) {
	global $rcc_cookie_consent_frontend;
	$rcc_cookie_consent_frontend = new RCC_Frontend();
	$rcc_cookie_consent_frontend->init();
}

//if it exists, create it!
if ( class_exists( 'RCC_Admin' ) ) {
	global $rcc_cookie_consent_admin;
	$rcc_cookie_consent_admin = new RCC_Admin();
	$rcc_cookie_consent_admin->init();
}
