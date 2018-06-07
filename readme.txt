=== Radish Concepts Cookie Consent ===
Contributors: __jester, acsnaterse
Donate link: https://www.radishconcepts.com/radish-cookie-consent/
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: Cookies, GDPR, AVG, Privacy
Requires at least: 4.9
Tested up to: 4.9.6
Stable tag: 1.0
Version: 1.0
Requires PHP: 5.2.4

== Description ==

### 'Radish Concepts Cookie Consent: they way to manage all types of cookies on your website


### Bug reports

Bug reports for 'Radish Concepts Cookie Consent are [welcomed on GitHub](https://github.com/radishconcepts/radish-cookie-consent). Please note GitHub is not a support forum, and issues that aren’t properly qualified as bugs will be closed.

== Installation ==

=== From within WordPress ===

1. Visit 'Plugins > Add New'
1. Search for 'Radish Concepts Cookie Consent'
1. Activate 'Radish Concepts Cookie Consent from your Plugins page.
1. Go to "after activation" below.

=== Manually ===

1. Upload the 'radish-cookie-consent' folder to the `/wp-content/plugins/` directory
1. Activate the Radish Concepts Cookie Consent plugin through the 'Plugins' menu in WordPress
1. Go to "after activation" below.

=== After activation ===

1. You should see a new menu item labeled 'Cookie Consent' in the wp-admin area.
1. Configure your settings
1. Configure your templates if necessary, you can override the cookie-bar HTML by adding the template to your theme folder: 'wp-content/themes/your-theme/rcc/cookiebar.php'
1. Customize the styles by adding CSS rules to the stylesheet of your own theme
1. Convert your script-tags to: <script class="cookie-type-{type}" data-src="https:///www.example-domain.com/script.js"></script>
1. Convert your objects/iframes-tags to: <iframe class="cookie-type-{type}" data-src="https:///www.example-domain.com/"></iframe>
1. Convert your link-tags to: <link class="cookie-type-{type}" data-href="https:///www.example-domain.com/style.css" rel="stylesheet" type="text/css">
1. Available cookie types are: 'functional', 'analytical', 'tracking', 'socialmedia' and 'advertising' But you could add your own groups
1. You're done!

== Changelog ==

= 1.0 =
Release Date: June 3rd, 2018

Initial release