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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicmFkaXNoLWNvb2tpZS1jb25zZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb29raWUgY29uc2VudCBmcm9udGVuZCBhcHBsaWNhdGlvblxuICovXG5cbihmdW5jdGlvbiAoZG9jdW1lbnQsICQsIHVuZGVmaW5lZCkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIFJDQyA9IHt9O1xuXG4gICAgUkNDLmluaXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy9maXJzdCB3ZSBiaW5kIGFsbCB0aGUgaW50ZXJhY3RpdmUgZWxlbWVudHMgKGJ1dHRvbnMpXG4gICAgICAgIHRoaXMuYmluZF9lbGVtZW50cygpO1xuXG4gICAgICAgIC8vY2hlY2sgZm9yIHRoZSBiYXNlIGNvb2tpZSwgYXJlIHRoZXJlIGFueSBwcmVmZXJuY2VzIHNldD9cbiAgICAgICAgdmFyIGNvb2tpZV9zZXR0aW5ncyA9IHRoaXMuZ2V0X2Nvb2tpZSgncmNjLWNvb2tpZS1zZXR0aW5ncycpO1xuXG4gICAgICAgIGlmIChjb29raWVfc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICQoJy5yYWRpc2gtY29va2llLXNldHRpbmdzLXRvZ2dsZScpLnNob3coKTsgICAgIC8veWVzLCBzaG93IHRoZSBzZXR0aW5ncy10b2dnbGUtYnRuXG4gICAgICAgICAgICB0aGlzLnVubGVhc2goKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgd2UgdW5sZWFzaCB0aGUgc2NyaXB0cyBmb3IgdGhpcyBjb29raWUgdHlwZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLnJhZGlzaC1jb29raWUtYmFyJykuc2hvdygpOyAgICAgICAgICAgICAgICAgLy9ubywgc2hvdyB0aGUgY29va2llLWJhclxuICAgICAgICB9XG4gICAgfVxuXG4gICAgUkNDLnVubGVhc2ggPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGNvb2tpZV90eXBlcyA9IHdpbmRvdy5yYWRpc2hfY29va2llX2NvbnNlbnQuY29va2llX3R5cGVzO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llX3R5cGVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgIC8vZGVmaW5lIHRoZSBjb29raWUgdHlwZVxuICAgICAgICAgICAgdmFyIGNvb2tpZV90eXBlID0gY29va2llX3R5cGVzW2ldO1xuXG4gICAgICAgICAgICAvL2dldCBzdG9yZWQgdmFsdWUgZm9yIHRoaXMgdmlzaXRvclxuICAgICAgICAgICAgdmFyIGNvb2tpZV92YWx1ZSA9IHRoaXMuZ2V0X2Nvb2tpZSgncmNjLWNvb2tpZS10eXBlLScgKyBjb29raWVfdHlwZSk7XG5cbiAgICAgICAgICAgIC8vaWYgdGhlIHZpc2l0b3IgaGFzIGFsbG93ZWQgY29va2llcyBmb3IgdGhpcyB0eXBlLi4uXG4gICAgICAgICAgICBpZiAoJ3RydWUnID09PSBjb29raWVfdmFsdWUpIHtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVbmxlYXNpbmcgJyArIGNvb2tpZV90eXBlICsgJyBzY3JpcHRzIGFuZCBvYmplY3RzJyk7XG5cbiAgICAgICAgICAgICAgICAvL3NldCB0aGUgcHJvcGVyIHZhbHVlIGluIG91ciBzZXR0aW5ncyBmb3JtXG4gICAgICAgICAgICAgICAgJCgnI3JjYy1hbGxvdy0nICsgY29va2llX3R5cGUpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIC8vZmluZCBhbGwgdGhlIHNjcmlwdHMsIGxpbmtzKGxpa2UgY3NzIGZpbGVzKSwgaWZyYW1lcyBhbmQgb2JqZWN0cyB0aGF0IGFyZSBtYXJrZWQgd2l0aCB0aGlzIGNvb2tpZSB0eXBlXG4gICAgICAgICAgICAgICAgJCgnLmNvb2tpZS10eXBlLScgKyBjb29raWVfdHlwZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jb252ZXJ0IGFsbCBkYXRhLXNyYydzIHRvIHNyYydzXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGhpcy5hdHRyKCdkYXRhLXNyYycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5hdHRyKCdzcmMnLCAkdGhpcy5hdHRyKCdkYXRhLXNyYycpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL2NvbnZlcnQgYWxsIGRhdGEtaHJlZidzIHRvIGhyZWYnc1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHRoaXMuYXR0cignZGF0YS1ocmVmJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmF0dHIoJ2hyZWYnLCAkdGhpcy5hdHRyKCdkYXRhLWhyZWYnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHsgLy9pZiB0aGUgdmlzaXRvciBoYXMgbm90IGFsbG93ZWQgY29va2llcyBmb3IgdGhpcyB0eXBlXG5cbiAgICAgICAgICAgICAgICAvL3NldCB0aGUgcHJvcGVyIHZhbHVlIGluIG91ciBzZXR0aW5ncyBmb3JtXG4gICAgICAgICAgICAgICAgJCgnI3JjYy1hbGxvdy0nICsgY29va2llX3R5cGUpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBSQ0MuYmluZF9lbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvL2JpbmQgdGhlIGNvb2tpZS1hcHByb3ZlIGJ1dHRvblxuICAgICAgICAkKCcuY29va2llLWFwcHJvdmUnKS5vbignY2xpY2snLCB0aGlzLnN0b3JlX3NldHRpbmdzKTtcblxuICAgICAgICAvL2JpbmQgdGhlIGNvb2tpZS1hcHByb3ZlIGJ1dHRvblxuICAgICAgICAkKCcuY29va2llLXNldHRpbmdzLXRvZ2dsZScpLm9uKCdjbGljaycsIHRoaXMudG9nZ2xlX3NldHRpbmdzKTtcblxuICAgICAgICAvL2J5IGRlZmF1bHQgd2UgYWx3YXlzIGFsbG93IGZ1bmN0aW9uYWwgY29va2llcywgc28gZGlzYWJsZSB0aGF0IGNoZWNrYm94XG4gICAgICAgIC8vJCgnI3JjYy1hbGxvdy1mdW5jdGlvbmFsJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBSQ0MudG9nZ2xlX3NldHRpbmdzID0gZnVuY3Rpb24gKGUpIHtcblxuICAgICAgICAvL3ByZXZlbnQgZGVmYXVsdCBiZWhhdmlvclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy8gaGlkZSB0aGUgc2V0dGluZ3MgdG9nZ2xlc1xuICAgICAgICAkKCcucmFkaXNoLWNvb2tpZS1zZXR0aW5ncy10b2dnbGUnKS5oaWRlKCk7XG4gICAgICAgIC8vc2hvdyB0aGUgY29va2llLWJhclxuICAgICAgICAkKCcucmFkaXNoLWNvb2tpZS1iYXInKS5zaG93KCk7XG5cbiAgICAgICAgdmFyICRjb29raWVfYmFyX3NldHRpbmdzID0gJCgnLmNvb2tpZS1iYXItc2V0dGluZ3MnKTtcblxuICAgICAgICBpZiAoJGNvb2tpZV9iYXJfc2V0dGluZ3MuaXMoJzp2aXNpYmxlJykpIHtcblxuICAgICAgICAgICAgLy9hbmQgaGlkZSB0aGUgc2V0dGluZ3MgaW5zaWRlIHRoZSBjb29raWUgYmFyXG4gICAgICAgICAgICAkY29va2llX2Jhcl9zZXR0aW5ncy5oaWRlKCk7XG4gICAgICAgICAgICAvL2FuZCB3ZSBzaG93IHRoZSBmaXJ0IHJvdyBvZiBidXR0b25zXG4gICAgICAgICAgICAkKCcuY29va2llLWJhci1mb290ZXIgPiAuY29va2llLWJhci1idXR0b25zJykuc2hvdygpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vYW5kIHNob3cgdGhlIHNldHRpbmdzIGluc2lkZSB0aGUgY29va2llIGJhclxuICAgICAgICAgICAgJGNvb2tpZV9iYXJfc2V0dGluZ3Muc2hvdygpO1xuICAgICAgICAgICAgLy9hbmQgd2UgaGlkZSB0aGUgZmlydCByb3cgb2YgYnV0dG9uc1xuICAgICAgICAgICAgJCgnLmNvb2tpZS1iYXItZm9vdGVyID4gLmNvb2tpZS1iYXItYnV0dG9ucycpLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vYWdhaW4gcHJldmVudCBkZWZhdWx0IGJlaGF2aW9yXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBSQ0Muc3RvcmVfc2V0dGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgIC8vcHJldmVudCBkZWZhdWx0IGJlaGF2aW9yXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvL3NldCB0aGUgYmFzZSBjb29raWUgZm9yIG9uZSB5ZWFyXG4gICAgICAgIFJDQy5zZXRfY29va2llKCdyY2MtY29va2llLXNldHRpbmdzJywgJ3RydWUnLCAzNjUpO1xuXG4gICAgICAgIC8vbG9vcCB0aHJvdWdoIGFsbCB0aGUgc2V0dGluZ3NcbiAgICAgICAgJCgnLnJjYy1hbGxvdy1jb29raWUtdHlwZScpLmVhY2goZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNldHRpbmcgPSAnZmFsc2UnO1xuICAgICAgICAgICAgdmFyIGNvb2tpZV90eXBlID0gJHRoaXMuZGF0YSgnY29va2lldHlwZScpO1xuXG4gICAgICAgICAgICAvL2lmIHRoZSBjaGVja2JveCBpcyBzZXQsIHdlIGFsbG93IHRoZSBjb29raWUgdHlwZVxuICAgICAgICAgICAgaWYgKCR0aGlzLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZyA9ICd0cnVlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zdG9yZSB0aGUgdmFsdWUgZm9yIHRoaXMgY29va2llIHR5cGVcbiAgICAgICAgICAgIFJDQy5zZXRfY29va2llKCdyY2MtY29va2llLXR5cGUtJyArIGNvb2tpZV90eXBlLCBzZXR0aW5nLCAzNjUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL3JlbG9hZCBwYWdlXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuXG4gICAgICAgIC8vYWdhaW4gcHJldmVudCBkZWZhdWx0IGJlaGF2aW9yXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBSQ0Muc2V0X2Nvb2tpZSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSwgZGF5cykge1xuICAgICAgICB2YXIgZXhwaXJlcyA9IFwiXCI7XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICAgICAgICAgIGV4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyAodmFsdWUgfHwgXCJcIikgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiO1xuICAgIH1cblxuICAgIFJDQy5nZXRfY29va2llID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIG5hbWVFUSA9IG5hbWUgKyBcIj1cIjtcbiAgICAgICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgICAgICAgaWYgKGMuaW5kZXhPZihuYW1lRVEpID09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICBSQ0MuaW5pdCgpO1xuICAgIH0pO1xuXG59KShkb2N1bWVudCwgalF1ZXJ5KTsiXX0=
