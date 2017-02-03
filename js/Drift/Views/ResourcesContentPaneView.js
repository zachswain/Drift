/* global Backbone, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                ResourcesContentPaneView : Backbone.View.extend({
                    className : "ResourcesContentPane ContentPane",
                    
                    events : {
                        "click [data-role=scrapBtn]" : "onScrapBtnClicked"
                    },
                    
                    initialize : function(parameters) {
                        this.model = parameters.model;
                        this.ship = parameters.ship;
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-ResourcesContentPaneView-template").html() );
                        var html = template({ model : this.model.toJSON() });
                        this.$el.html(html);
                    },
                    
                    onScrapBtnClicked : function(e) {
                        e.preventDefault();
                        this.ship.addResources(Drift.Resources.Scrap, 1);
                    }
                })
            }
        }    
    });
})(jQuery);