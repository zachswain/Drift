/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Ports : {
                1 : new Drift.Models.PortModel({
                    id : 1
                })
            }
        }
    })
})(jQuery);