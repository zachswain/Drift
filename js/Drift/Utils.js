/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Utils : {
                calculatePricePerUnit : function(type, rate) {
                    return Drift.Globals.Resources[type].pricePerUnit * rate;
                }
            }
        }
    })
})(jQuery);