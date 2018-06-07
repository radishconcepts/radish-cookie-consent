/**
 * Cookie consent frontend application
 */

(function (document, $, undefined) {

    'use strict';

    var RCC = {};

    RCC.init = function () {

        //first we bind all the interactive elements (buttons)
        this.bind_elements();

        //check for the base cookie, are there any prefernces set?
        var cookie_settings = this.get_cookie('rcc-cookie-settings');

        if (cookie_settings) {
            $('.radish-cookie-settings-toggle').show();     //yes, show the settings-toggle-btn
            this.unleash();                                 // and we unleash the scripts for this cookie type
        } else {
            $('.radish-cookie-bar').show();                 //no, show the cookie-bar
        }
    }

    RCC.unleash = function () {

        var cookie_types = window.radish_cookie_consent.cookie_types;

        for (var i = 0; i < cookie_types.length; i++) {

            //define the cookie type
            var cookie_type = cookie_types[i];

            //get stored value for this visitor
            var cookie_value = this.get_cookie('rcc-cookie-type-' + cookie_type);

            //if the visitor has allowed cookies for this type...
            if ('true' === cookie_value) {

                console.log('Unleasing ' + cookie_type + ' scripts and objects');

                //set the proper value in our settings form
                $('#rcc-allow-' + cookie_type).prop('checked', true);

                //find all the scripts, links(like css files), iframes and objects that are marked with this cookie type
                $('.cookie-type-' + cookie_type).each(function () {
                    var $this = $(this);

                    //convert all data-src's to src's
                    if ($this.attr('data-src')) {
                        $this.attr('src', $this.attr('data-src'));
                    }
                    //convert all data-href's to href's
                    if ($this.attr('data-href')) {
                        $this.attr('href', $this.attr('data-href'));
                    }
                });

            } else { //if the visitor has not allowed cookies for this type

                //set the proper value in our settings form
                $('#rcc-allow-' + cookie_type).prop('checked', false);
            }
        }
    }

    RCC.bind_elements = function () {

        //bind the cookie-approve button
        $('.cookie-approve').on('click', this.store_settings);

        //bind the cookie-approve button
        $('.cookie-settings-toggle').on('click', this.toggle_settings);

        //by default we always allow functional cookies, so disable that checkbox
        //$('#rcc-allow-functional').prop('disabled', true);
    }

    RCC.toggle_settings = function (e) {

        //prevent default behavior
        e.preventDefault();

        // hide the settings toggles
        $('.radish-cookie-settings-toggle').hide();
        //show the cookie-bar
        $('.radish-cookie-bar').show();

        var $cookie_bar_settings = $('.cookie-bar-settings');

        if ($cookie_bar_settings.is(':visible')) {

            //and hide the settings inside the cookie bar
            $cookie_bar_settings.hide();
            //and we show the firt row of buttons
            $('.cookie-bar-footer > .cookie-bar-buttons').show();

        } else {

            //and show the settings inside the cookie bar
            $cookie_bar_settings.show();
            //and we hide the firt row of buttons
            $('.cookie-bar-footer > .cookie-bar-buttons').hide();
        }

        //again prevent default behavior
        return false;
    }

    RCC.store_settings = function (e) {

        //prevent default behavior
        e.preventDefault();

        //set the base cookie for one year
        RCC.set_cookie('rcc-cookie-settings', 'true', 365);

        //loop through all the settings
        $('.rcc-allow-cookie-type').each(function () {

            var $this = $(this);
            var setting = 'false';
            var cookie_type = $this.data('cookietype');

            //if the checkbox is set, we allow the cookie type
            if ($this.is(':checked')) {
                setting = 'true';
            }

            //store the value for this cookie type
            RCC.set_cookie('rcc-cookie-type-' + cookie_type, setting, 365);
        });

        //reload page
        location.reload();

        //again prevent default behavior
        return false;
    }

    RCC.set_cookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    RCC.get_cookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    $(document).ready(function () {
        RCC.init();
    });

})(document, jQuery);