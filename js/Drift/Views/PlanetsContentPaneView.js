/* global Backbone, Drift, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                PlanetsContentPaneView : Backbone.View.extend({
                    className : "PlanetsContentPane ContentPane",
                    
                    initialize : function(parameters) {
                        this.views = [];
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-PlanetsContentPaneView-template").html() );
                        var html = template();
                        this.$el.html(html);
                        
                        this.updateView();
                    },
                    
                    setSector : function(sector) {
                        this.sector = sector;
                    },
                    
                    clearPlanets : function() {
                        while(this.views.length>0) {
                            var view = this.views.pop();
                            view.dispose();
                        }
                        
                        this.$el.find("ul[data-role=planetsList] li").remove();
                    },
                    
                    updateView : function() {
                        this.clearPlanets();
                        
                        if( !this.sector ) return;
                        
                        var planets = this.sector.getPlanets();
                        
                        if( !planets || planets.length==0 ) return;
                        
                        var self=this;
                        
                        $.each(planets, function(index, planet) {
                            var view = new Drift.Views.PlanetView({ planet : planet });
                            var li = $("<li></li>").append( view.$el );
                            self.$el.find("ul[data-role=planetsList]").append(li);
                            view.render();
                            self.views.push(view);
                        });
                    }
                })
            }
        }    
    });
})(jQuery);