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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicmFkaXNoLWNvb2tpZS1jb25zZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvb2tpZSBjb25zZW50IGZyb250ZW5kIGFwcGxpY2F0aW9uXHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uIChkb2N1bWVudCwgJCwgdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBSQ0MgPSB7fTtcclxuXHJcbiAgICBSQ0MuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy9maXJzdCB3ZSBiaW5kIGFsbCB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudHMgKGJ1dHRvbnMpXHJcbiAgICAgICAgdGhpcy5iaW5kX2VsZW1lbnRzKCk7XHJcblxyXG4gICAgICAgIC8vY2hlY2sgZm9yIHRoZSBiYXNlIGNvb2tpZSwgYXJlIHRoZXJlIGFueSBwcmVmZXJuY2VzIHNldD9cclxuICAgICAgICB2YXIgY29va2llX3NldHRpbmdzID0gdGhpcy5nZXRfY29va2llKCdyY2MtY29va2llLXNldHRpbmdzJyk7XHJcblxyXG4gICAgICAgIGlmIChjb29raWVfc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgJCgnLnJhZGlzaC1jb29raWUtc2V0dGluZ3MtdG9nZ2xlJykuc2hvdygpOyAgICAgLy95ZXMsIHNob3cgdGhlIHNldHRpbmdzLXRvZ2dsZS1idG5cclxuICAgICAgICAgICAgdGhpcy51bmxlYXNoKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHdlIHVubGVhc2ggdGhlIHNjcmlwdHMgZm9yIHRoaXMgY29va2llIHR5cGVcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkKCcucmFkaXNoLWNvb2tpZS1iYXInKS5zaG93KCk7ICAgICAgICAgICAgICAgICAvL25vLCBzaG93IHRoZSBjb29raWUtYmFyXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFJDQy51bmxlYXNoID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgY29va2llX3R5cGVzID0gd2luZG93LnJhZGlzaF9jb29raWVfY29uc2VudC5jb29raWVfdHlwZXM7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llX3R5cGVzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAvL2RlZmluZSB0aGUgY29va2llIHR5cGVcclxuICAgICAgICAgICAgdmFyIGNvb2tpZV90eXBlID0gY29va2llX3R5cGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgLy9nZXQgc3RvcmVkIHZhbHVlIGZvciB0aGlzIHZpc2l0b3JcclxuICAgICAgICAgICAgdmFyIGNvb2tpZV92YWx1ZSA9IHRoaXMuZ2V0X2Nvb2tpZSgncmNjLWNvb2tpZS10eXBlLScgKyBjb29raWVfdHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvL2lmIHRoZSB2aXNpdG9yIGhhcyBhbGxvd2VkIGNvb2tpZXMgZm9yIHRoaXMgdHlwZS4uLlxyXG4gICAgICAgICAgICBpZiAoJ3RydWUnID09PSBjb29raWVfdmFsdWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVW5sZWFzaW5nICcgKyBjb29raWVfdHlwZSArICcgc2NyaXB0cyBhbmQgb2JqZWN0cycpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vc2V0IHRoZSBwcm9wZXIgdmFsdWUgaW4gb3VyIHNldHRpbmdzIGZvcm1cclxuICAgICAgICAgICAgICAgICQoJyNyY2MtYWxsb3ctJyArIGNvb2tpZV90eXBlKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9maW5kIGFsbCB0aGUgc2NyaXB0cywgbGlua3MobGlrZSBjc3MgZmlsZXMpLCBpZnJhbWVzIGFuZCBvYmplY3RzIHRoYXQgYXJlIG1hcmtlZCB3aXRoIHRoaXMgY29va2llIHR5cGVcclxuICAgICAgICAgICAgICAgICQoJy5jb29raWUtdHlwZS0nICsgY29va2llX3R5cGUpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY29udmVydCBhbGwgZGF0YS1zcmMncyB0byBzcmMnc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5hdHRyKCdkYXRhLXNyYycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmF0dHIoJ3NyYycsICR0aGlzLmF0dHIoJ2RhdGEtc3JjJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnZlcnQgYWxsIGRhdGEtaHJlZidzIHRvIGhyZWYnc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5hdHRyKCdkYXRhLWhyZWYnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5hdHRyKCdocmVmJywgJHRoaXMuYXR0cignZGF0YS1ocmVmJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHsgLy9pZiB0aGUgdmlzaXRvciBoYXMgbm90IGFsbG93ZWQgY29va2llcyBmb3IgdGhpcyB0eXBlXHJcblxyXG4gICAgICAgICAgICAgICAgLy9zZXQgdGhlIHByb3BlciB2YWx1ZSBpbiBvdXIgc2V0dGluZ3MgZm9ybVxyXG4gICAgICAgICAgICAgICAgJCgnI3JjYy1hbGxvdy0nICsgY29va2llX3R5cGUpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgUkNDLmJpbmRfZWxlbWVudHMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIC8vYmluZCB0aGUgY29va2llLWFwcHJvdmUgYnV0dG9uXHJcbiAgICAgICAgJCgnLmNvb2tpZS1hcHByb3ZlJykub24oJ2NsaWNrJywgdGhpcy5zdG9yZV9zZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIC8vYmluZCB0aGUgY29va2llLWFwcHJvdmUgYnV0dG9uXHJcbiAgICAgICAgJCgnLmNvb2tpZS1zZXR0aW5ncy10b2dnbGUnKS5vbignY2xpY2snLCB0aGlzLnRvZ2dsZV9zZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIC8vYnkgZGVmYXVsdCB3ZSBhbHdheXMgYWxsb3cgZnVuY3Rpb25hbCBjb29raWVzLCBzbyBkaXNhYmxlIHRoYXQgY2hlY2tib3hcclxuICAgICAgICAvLyQoJyNyY2MtYWxsb3ctZnVuY3Rpb25hbCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgUkNDLnRvZ2dsZV9zZXR0aW5ncyA9IGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgICAgIC8vcHJldmVudCBkZWZhdWx0IGJlaGF2aW9yXHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAvLyBoaWRlIHRoZSBzZXR0aW5ncyB0b2dnbGVzXHJcbiAgICAgICAgJCgnLnJhZGlzaC1jb29raWUtc2V0dGluZ3MtdG9nZ2xlJykuaGlkZSgpO1xyXG4gICAgICAgIC8vc2hvdyB0aGUgY29va2llLWJhclxyXG4gICAgICAgICQoJy5yYWRpc2gtY29va2llLWJhcicpLnNob3coKTtcclxuXHJcbiAgICAgICAgdmFyICRjb29raWVfYmFyX3NldHRpbmdzID0gJCgnLmNvb2tpZS1iYXItc2V0dGluZ3MnKTtcclxuXHJcbiAgICAgICAgaWYgKCRjb29raWVfYmFyX3NldHRpbmdzLmlzKCc6dmlzaWJsZScpKSB7XHJcblxyXG4gICAgICAgICAgICAvL2FuZCBoaWRlIHRoZSBzZXR0aW5ncyBpbnNpZGUgdGhlIGNvb2tpZSBiYXJcclxuICAgICAgICAgICAgJGNvb2tpZV9iYXJfc2V0dGluZ3MuaGlkZSgpO1xyXG4gICAgICAgICAgICAvL2FuZCB3ZSBzaG93IHRoZSBmaXJ0IHJvdyBvZiBidXR0b25zXHJcbiAgICAgICAgICAgICQoJy5jb29raWUtYmFyLWZvb3RlciA+IC5jb29raWUtYmFyLWJ1dHRvbnMnKS5zaG93KCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvL2FuZCBzaG93IHRoZSBzZXR0aW5ncyBpbnNpZGUgdGhlIGNvb2tpZSBiYXJcclxuICAgICAgICAgICAgJGNvb2tpZV9iYXJfc2V0dGluZ3Muc2hvdygpO1xyXG4gICAgICAgICAgICAvL2FuZCB3ZSBoaWRlIHRoZSBmaXJ0IHJvdyBvZiBidXR0b25zXHJcbiAgICAgICAgICAgICQoJy5jb29raWUtYmFyLWZvb3RlciA+IC5jb29raWUtYmFyLWJ1dHRvbnMnKS5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL2FnYWluIHByZXZlbnQgZGVmYXVsdCBiZWhhdmlvclxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBSQ0Muc3RvcmVfc2V0dGluZ3MgPSBmdW5jdGlvbiAoZSkge1xyXG5cclxuICAgICAgICAvL3ByZXZlbnQgZGVmYXVsdCBiZWhhdmlvclxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLy9zZXQgdGhlIGJhc2UgY29va2llIGZvciBvbmUgeWVhclxyXG4gICAgICAgIFJDQy5zZXRfY29va2llKCdyY2MtY29va2llLXNldHRpbmdzJywgJ3RydWUnLCAzNjUpO1xyXG5cclxuICAgICAgICAvL2xvb3AgdGhyb3VnaCBhbGwgdGhlIHNldHRpbmdzXHJcbiAgICAgICAgJCgnLnJjYy1hbGxvdy1jb29raWUtdHlwZScpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyIHNldHRpbmcgPSAnZmFsc2UnO1xyXG4gICAgICAgICAgICB2YXIgY29va2llX3R5cGUgPSAkdGhpcy5kYXRhKCdjb29raWV0eXBlJyk7XHJcblxyXG4gICAgICAgICAgICAvL2lmIHRoZSBjaGVja2JveCBpcyBzZXQsIHdlIGFsbG93IHRoZSBjb29raWUgdHlwZVxyXG4gICAgICAgICAgICBpZiAoJHRoaXMuaXMoJzpjaGVja2VkJykpIHtcclxuICAgICAgICAgICAgICAgIHNldHRpbmcgPSAndHJ1ZSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vc3RvcmUgdGhlIHZhbHVlIGZvciB0aGlzIGNvb2tpZSB0eXBlXHJcbiAgICAgICAgICAgIFJDQy5zZXRfY29va2llKCdyY2MtY29va2llLXR5cGUtJyArIGNvb2tpZV90eXBlLCBzZXR0aW5nLCAzNjUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL3JlbG9hZCBwYWdlXHJcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcblxyXG4gICAgICAgIC8vYWdhaW4gcHJldmVudCBkZWZhdWx0IGJlaGF2aW9yXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIFJDQy5zZXRfY29va2llID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCBkYXlzKSB7XHJcbiAgICAgICAgdmFyIGV4cGlyZXMgPSBcIlwiO1xyXG4gICAgICAgIGlmIChkYXlzKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7XHJcbiAgICAgICAgICAgIGV4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgKHZhbHVlIHx8IFwiXCIpICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcclxuICAgIH1cclxuXHJcbiAgICBSQ0MuZ2V0X2Nvb2tpZSA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgdmFyIG5hbWVFUSA9IG5hbWUgKyBcIj1cIjtcclxuICAgICAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjID0gY2FbaV07XHJcbiAgICAgICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgUkNDLmluaXQoKTtcclxuICAgIH0pO1xyXG5cclxufSkoZG9jdW1lbnQsIGpRdWVyeSk7Il19
