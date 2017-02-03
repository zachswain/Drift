/* global Backbone, Drift, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                PortView : Backbone.View.extend({
                    className : "PortView",
                    
                    initialize : function(parameters) {
                        this.port = parameters.port;
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-PortView-template").html() );
                        var html = template({ port : this.port.toJSON() });
                        this.$el.html(html);
                    }
                })
            }
        }    
    });
})(jQuery);