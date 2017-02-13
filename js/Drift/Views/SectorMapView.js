/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                SectorMapView : Backbone.View.extend({
                    className : "SectorMap",
                    
                    events : {
                        "click" : "onClick",
                        "mousedown" : "onMousedown",
                        "mouseup" : "onMouseup",
                        "mouseenter" : "onMouseenter",
                        "mouseleave" : "onMouseleave",
                        "mousemove" : "onMousemove",
                        "mousewheel" : "onMousewheel",
                        "touchstart" : "onTouchstart",
                        "touchmove" : "onTouchmove",
                        "touchend" : "onTouchend",
                        "pinch" : "onPinch",
                        "click [data-role=centerBtn]" : "onCenterBtnClicked",
                    },
                    
                    initialize : function(parameters) {
                        this.isMousedown = false;
                        this.isDragging = false;
                        this.x = 0;
                        this.y = 0;
                        this.lastTouchX = null;
                        this.lastTouchY = null;
                        this.scale = 2.0;
                        
                        parameters = $.extend({ sectors: [] }, parameters);
                        var sectors = parameters.sectors;
                        
                        var self=this;
                        self.sectors = {};
                        
                        $.each(sectors, function(index, sector) {
                            self.sectors[index] = sector;
                        });
                        
                        self.sectorTiles = {};
                        
                        this.listenTo(Drift, "change:sector", this.onSectorChange);
                    },
                    
                    render : function() {
                        this.$el.html("");
                        
                        this.tilesDiv = $("<div></div>");
                        this.$el.append(this.tilesDiv);
                        
                        this.$el.append(
                            $("<button></button>")
                                .addClass("Button")
                                .html("C")
                                .attr("data-role", "centerBtn")
                        )
                        
                        var self=this;
                        
                        setTimeout(function() {
                            // draw sectors
                            
                            var hammertime = new Hammer(self.$el[0], {});
                            
                            hammertime.get('pinch').set({ enable: true });
                            
                            hammertime.on("pinchstart", function(e) {
                               self.onPinchstart(e); 
                            });
                            
                            hammertime.on("pinchmove", function(e) {
                                self.onPinchmove(e);
                            });
                            
                            //console.log("drawing " + Object.keys(self.sectors).length + " sectors");
                            
                            $.each(self.sectors, function(index, sector) {
                                self.addSector(sector);
                            });
                            
                            self.centerOnCurrentSector();
                            self.highlightCurrentSector();
                        },0);
                    },
                    
                    centerOn : function(sector) {
                        
                    },
                    
                    centerOnCurrentSector : function() {
                        var width = this.$el.parent().width();
                        var height = this.$el.parent().height();
                        
                        var sector = Drift.getSector();
                        
                        //this.x = width / 2;
                        //this.y = height / 2;
                        var x = sector.getX();
                        var y = sector.getY();
                        var tileHeight = Math.sqrt(3) / 2 * 50 + 1;
                        var tileWidth = 50;
                        
                        console.log("x=" + x + ", y=" + y);
                        
                        this.x = width / 2;
                        this.y = height / 2;
                        
                        console.log("x=" + this.x + ", y=" + this.y);
                        
                        this.tilesDiv.css({
                            "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")"
                        })
                    },
                    
                    addSector : function(sector) {
                        this.sectors[sector.getId()] = sector;
                        var sectorTile = new Drift.Views.SectorTileView({
                            sector : sector
                        });
                        sectorTile.render();
                        //this.$el.append(sectorTile.$el);
                        this.tilesDiv.append(sectorTile.$el);
                        this.sectorTiles[sector.getId()] = sectorTile;
                        
                        this.listenTo(sectorTile, "doubletap", function() {
                            this.trigger("doubletap:sector", sector.getId());
                        });
                    },
                    
                    onClick : function(e) {
                        // console.log("map:onclick");
                    },
                    
                    onMousedown : function(e) {
                        // console.log("map:mousedown");
                        this.isMousedown = true;
                    },
                    
                    onMouseup : function(e) {
                        //console.log("map:mouseup");
                        this.isMousedown = false;  
                    },
                    
                    onMouseenter : function(e) {
                        //console.log("map:mouseenter");
                        this.isDragging = false;
                        this.isMousedown = false;
                    },
                    
                    onMouseleave : function(e) {
                        // console.log("map:mouseleave");
                        this.isDragging = false;
                        this.isMousedown = false;
                    },
                    
                    onMousemove : function(e) {
                        //console.log("map:mousemove");
                        if( this.isMousedown ) {
                            var deltaX = e.originalEvent.movementX;
                            var deltaY = e.originalEvent.movementY;
                            var currentPosition = $(this.tilesDiv).position();
                            
                            this.y = (parseFloat(this.y) + deltaY);
                            this.x = (parseFloat(this.x) + deltaX);
                            
                            this.tilesDiv.css({
                                "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")"
                            })
                        }
                    },
                    
                    onTouchmove : function(e) {
                        if( this.isMousedown ) {
                            var deltaX = e.originalEvent.touches[0].clientX - this.lastTouchX;
                            var deltaY = e.originalEvent.touches[0].clientY - this.lastTouchY;
                            this.lastTouchX = e.originalEvent.touches[0].clientX;
                            this.lastTouchY = e.originalEvent.touches[0].clientY;
                            var currentPosition = $(this.tilesDiv).position();
                            
                            this.y = (parseFloat(this.y) + deltaY);
                            this.x = (parseFloat(this.x) + deltaX);
                            
                            this.tilesDiv.css({
                                "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")"
                            })
                        }
                    },
                    
                    onMousewheel : function(e) {
                        // console.log("map:mousewheel");
                        var dir = e.originalEvent.wheelDelta / Math.abs(e.originalEvent.wheelDelta);
                        if( dir > 0 ) {
                            this.scale = 1.1 * this.scale;
                            if( this.scale > 5 ) this.scale = 5;
                        } else {
                            this.scale = this.scale / 1.1;
                            if( this.scale < .5 ) this.scale = .5;
                        }
                        
                        this.tilesDiv.css({
                            "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")"
                        })
                    },
                    
                    onPinchstart : function(e) {
                        this.pinchScale = this.scale;
                    },
                    
                    onPinchmove : function(e) {
                        // console.log("map:pinchmove");
                        
                        this.scale = this.pinchScale * e.scale;
                        
                        this.tilesDiv.css({
                            "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")"
                        })
                    },
                    
                    onTouchstart : function(e) {
                        // console.log("map:touchstart");
                        this.lastTouchX = e.originalEvent.touches[0].clientX;
                        this.lastTouchY = e.originalEvent.touches[0].clientY;
                        this.isMousedown = true;
                    },
                    
                    onTouchend : function(e) {
                        // console.log("map:touchend");
                        this.lastTouchX = null;
                        this.lastTouchY = null;
                        this.isMousedown = false;
                    },
                    
                    onCenterBtnClicked : function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        console.log("center");
                        
                        this.centerOnCurrentSector();
                        
                        return false;
                    },
                    
                    onSectorChange : function(sector) {
                        console.log("map:sectorchange");
                        
                        this.highlightCurrentSector();
                    },
                    
                    highlightCurrentSector : function() {
                        var sector = Drift.getSector();
                        
                        this.$el.find("polygon").removeClass("currentSector");
                        
                        var selector = "polygon[data-id=" + sector.getId() + "]";
                        this.$el.find(selector).addClass("currentSector");
                    }
                })
            }
        }
    })
})(jQuery);