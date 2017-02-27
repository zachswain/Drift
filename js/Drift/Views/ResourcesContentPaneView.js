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
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-ResourcesContentPaneView-template").html() );
                        var html = template();
                        this.$el.html(html);
                    },
                    
                    onScrapBtnClicked : function(e) {
                        e.preventDefault();
                        var ship = Drift.getShip();
                        ship.addResources(Drift.Resources.Scrap, 1);
                    }
                })
            }
        }    
    });
})(jQuery);