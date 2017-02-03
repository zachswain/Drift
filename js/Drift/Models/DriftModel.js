/* global Backbone, jquery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                DriftModel : Backbone.Model.extend({
                    defaults : {
                        currentEnergy : 0,
                        scrap : 0,
                        ticks : 0
                    },
                    
                    initialize : function() {
                        
                    }
                })
            }
        }
    })
})(jQuery);