/* global Backbone, jquery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                DriftModel : Backbone.Model.extend({
                    defaults : {
                        ticks : 0
                    },
                    
                    initialize : function() {
                        
                    }
                })
            }
        }
    })
})(jQuery);