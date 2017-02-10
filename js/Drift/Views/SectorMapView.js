/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                SectorMapView : Backbone.View.extend({
                    className : "SectorMap",
                    
                    initialize : function(parameters) {
                        parameters = $.extend({ sectors: [] }, parameters);
                        var sectors = parameters.sectors;
                        
                        var self=this;
                        self.sectors = {};
                        $.each(sectors, function(index, sector) {
                            self.sectors[sector.getId()] = sector;
                        });
                        
                        self.sectorTiles = {};
                    },
                    
                    render : function() {
                        this.$el.html("");
                        
                        var self=this;
                        
                        setTimeout(function() {
                            // draw sectors
                            console.log("drawing " + Object.keys(self.sectors).length + " sectors");
                            
                            $.each(self.sectors, function(index, sector) {
                                self.addSector(sector);
                            });
                            
                            var width = self.$el.parent().width();
                            var height = self.$el.parent().height();
                            
                            var panzoom = self.$el.panzoom({
                                linearZoom : true,
                                transition : false
                            });
                            
                            panzoom.panzoom("pan", width / 2, height / 2);
                            
                            panzoom.parent().on("mousewheel.focal", function(e) {
                                e.preventDefault();
                                var delta = e.delta || e.originalEvent.wheelDelta;
                                var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                                panzoom.panzoom('zoom', zoomOut, {
                                  increment: 0.1,
                                  animate: false,
                                  focal: e
                                });
                            });
                        },0);
                    },
                    
                    addSector : function(sector) {
                        this.sectors[sector.getId()] = sector;
                        var sectorTile = new Drift.Views.SectorTileView({
                            sector : sector
                        });
                        sectorTile.render();
                        this.$el.append(sectorTile.$el);
                        this.sectorTiles[sector.getId()] = sectorTile;
                    }
                })
            }
        }
    })
})(jQuery);