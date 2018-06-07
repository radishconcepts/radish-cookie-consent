<?php

global $rcc_settings_labels, $rcc_settings_cookies;

$html = '';

$html .= '<div class="radish-cookie-bar">';
$html .= '<div class="wrap">';

//header
$html .= '<header class="cookie-bar-header"><span class="cookie-bar-title">' . apply_filters( 'the_title', $rcc_settings_labels['title'] ) . '</span></header>';

//content
$html .= '<div class="cookie-bar-content">' . apply_filters( 'the_content', stripslashes( $rcc_settings_labels['content'] ) ) . '</div>';

//footer (which holds all functionality)
$html .= '<footer class="cookie-bar-footer">';

$html .= '<ul class="cookie-bar-buttons">';
$html .= '<li><a href="#" class="button button-primary cookie-approve" title="' . esc_attr( $rcc_settings_labels['approve-btn-label'] ) . '">' . $rcc_settings_labels['approve-btn-label'] . '</a></li>';
$html .= '<li><a href="#" class="button button-secondary cookie-settings-toggle" title="' . esc_attr( $rcc_settings_labels['settings-btn-label'] ) . '">' . $rcc_settings_labels['settings-btn-label'] . '</a></li>';
$html .= '</ul>';

$html .= '<div class="cookie-bar-settings">';

if ( isset( $rcc_settings_cookies ) && is_array( $rcc_settings_cookies ) ) {
	$html .= '<ul class="cookie-bar-options">';
	foreach ( $rcc_settings_cookies as $type ) {
		if( $type['enabled'] ) {
			$html .= '<li>';
			$html .= '<input type="checkbox" ' . checked( 'true', $type['checked-by-default'], false ) . ' class="rcc-allow-cookie-type" data-cookietype="' . $type['slug'] . '" id="rcc-allow-' . $type['slug'] . '" ' . checked( true, $type['checked-by-default'], false ) . ' /><label for="rcc-allow-' . $type['slug'] . '">' . $type['label'] . '</label>';
			$html .= '<div class="cookie-description">' . apply_filters( 'the_content', $type['description'] ) . '</div>';
			$html .= '</li>';
		}
	}
	$html .= '</ul><!-- .cookie-bar-options -->';
}

$html .= '<ul class="cookie-bar-buttons">';
$html .= '<li><a href="#" class="button button-secondary cookie-settings-toggle" title="' . esc_attr( $rcc_settings_labels['cancel-btn-label'] ) . '">' . $rcc_settings_labels['cancel-btn-label'] . '</a></li>';
$html .= '<li><a href="#" class="button button-primary cookie-approve" title="' . esc_attr( $rcc_settings_labels['approve-btn-label'] ) . '">' . $rcc_settings_labels['approve-btn-label'] . '</a></li>';
$html .= '</ul>';

$html .= '</div><!-- .cookie-bar-settings -->';

$html .= '<p class="cookie-read-more"><a href="' . esc_url( $rcc_settings_labels['read-more-link'] ) . '" title="' . esc_attr( $rcc_settings_labels['read-more-text'] ) . '">' . $rcc_settings_labels['read-more-text'] . '</a></p>';

$html .= '</footer>';
$html .= '</div><!-- .wrap -->';
$html .= '</div><!-- .radish-cookie-bar -->';

$html .= '<div class="radish-cookie-settings-toggle">';
$html .= '<a href="#" class="cookie-settings-toggle button button-secondary" title="' . esc_attr( $rcc_settings_labels['toggle-settings-btn-label'] ) . '">' . $rcc_settings_labels['toggle-settings-btn-label'] . '</a>';
$html .= '</div><!-- .radish-cookie-settings-toggle -->';

echo $html;