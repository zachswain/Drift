/* global Backbone, Drift, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                MapContentPaneView : Backbone.View.extend({
                    className : "MapContentPane ContentPane",
                    
                    events : {
                    },
                    
                    initialize : function() {
                        this.sector = Drift.getSector();
                        
                        this.views = {
                            MapView : new Drift.Views.MapView({
                                sectors : [ Drift.Sectors[0], Drift.Sectors[1], Drift.Sectors[2], Drift.Sectors[3], Drift.Sectors[4] ]
                            })
                        };
                        
                        this.listenTo(Drift, "change:sector", this.onSectorChange);
                        this.listenTo(this.views.MapView, "doubletap:sector", this.onSectorDoubleTapped);
                        this.listenTo(this.views.MapView, "doubletap:planet", this.onPlanetDoubleTapped);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-MapContentPaneView-template").html() );
                        var html = template();
                        this.$el.html(html);
                        
                        var self=this;
                        
                        setTimeout(function() {
                            self.views.MapView.render();
                            self.$el.append(self.views.MapView.$el);
                        }, 0);
                    },
                    
                    // onSectorDoubleTapped : function(sectorId) {
                    //     Drift.moveToSector(sectorId);
                    // },
                    
                    onSectorChange : function(sector) {
                        this.sector = sector;
                        this.updateView();
                    },
                    
                    updateView : function() {
                        this.$el.find("[data-role=sectorIdSpan]").html(this.sector.get("id"));
                    },
                    
                    onSectorDoubleTapped : function(sectorId) {
                        if( this.views.MapView.isZoomed() ) {
                            this.views.MapView.zoomOff();
                        } else {
                            this.views.MapView.zoomOnSector(sectorId);
                        }
                    },
                    
                    onPlanetDoubleTapped : function(planetId) {
                        this.views.MapView.zoomOnPlanet(planetId);
                    }
                })
            }
        }    
    });
})(jQuery);