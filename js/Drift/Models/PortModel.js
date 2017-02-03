/* global Drift, Backbone, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                PortModel : Backbone.Model.extend({
                    defaults : {
                        id : null,
                    },
                    
                    initialize : function() {
                    }
                })
            }
        }
    });
})(jQuery);