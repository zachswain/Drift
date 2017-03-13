/* global Backbone, Drift, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                MapView : Backbone.View.extend({
                    className : "Map",
                    
                    events : {
                    },
                    
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
                        this.model = new Backbone.Model({
                            zoomed : false,
                            zoomedOn : null,
                            locked : false,
                            showUnexploredNeighbors : true
                        });
                        this.isMousedown = false;
                        this.isDragging = false;
                        this.x = 0;
                        this.y = 0;
                        this.lastTouchX = null;
                        this.lastTouchY = null;
                        this.scale = 1.0;
                        
                        parameters = $.extend({ sectors: [] }, parameters);
                        var sectors = parameters.sectors;
                        
                        var self=this;
                        self.sectors = {};
                        
                        $.each(sectors, function(index, sector) {
                            self.sectors[sector.getId()] = sector;
                        });
                        
                        self.sectorTiles = {};
                        
                        this.tilesDiv = $("<div id='tilesDiv'></div>");
                        
                        this.listenTo(Drift, "change:sector", this.onSectorChange);
                        this.listenTo(Drift, "set:sector", this.onSectorSet);
                        this.listenTo(this.model, "change:zoomed", this.onZoomedChange);
                    },
                    
                    render : function() {
                        this.$el.html("");
                        
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
                    
                    getWidth : function() {
                        return this.$el.parent().width();
                    },
                    
                    getHeight : function() {
                        return this.$el.parent().height();
                    },
                    
                    centerOnSector : function(sectorId, scale) {
                        scale = scale || this.scale;
                        var sector = this.sectors[sectorId];

                        var sectorTile = this.sectorTiles[sectorId];
                        
                        if( sectorTile ) {
                            var center = sectorTile.getCenter();
                            
                            this.x = this.getWidth() / 2 - center.left * scale;
                            this.y = this.getHeight() / 2 - center.top * scale;
                        } else {
                            this.x = this.getWidth() / 2;
                            this.y = this.getHeight() / 2;
                        }

                        this.tilesDiv.css({
                            "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + scale + ")",
                            "transition-duration" : ".1s"
                        });
                        
                        this.updateBackground();
                    },
                    
                    centerOnPlanet : function(planetId, scale) {
                        var self=this;
                        
                        Drift.getPlanetById(planetId)
                            .then(function(planet) {
                                scale = scale || self.scale;
                                var sector = self.sectors[planet.getSectorId()];
        
                                var sectorTile = self.sectorTiles[sector.getId()];
                                
                                var sectorCenter = sectorTile.getCenter();
                                var planetCenter = planet.getRelativeCenter();
                                
                                this.x = self.getWidth() / 2 - (sectorCenter.left + planetCenter.left) * scale;
                                this.y = self.getHeight() / 2 - (sectorCenter.top + planetCenter.top) * scale;
                                
                                console.log("x=" + this.x + ", y=" + this.y + ", scale=" + scale);
        
                                self.tilesDiv.css({
                                    "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + scale + ")",
                                    "transition-duration" : ".1s"
                                });
                                
                                this.updateBackground();
                            })
                            .fail(function() {
                                console.log("centerOnPlanet fail NYI");
                            })
                    },
                    
                    centerOnPoint : function(x, y, scale, duration) {
                        this.x = x;
                        this.y = y;
                        this.scale = scale;
                        
                        if( duration ) {
                            this.tilesDiv.css({
                                "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")",
                                "transition-duration" : ".1s"
                            });
                        } else {
                            this.tilesDiv.css({
                                "transition-duration" : "unset",
                                "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")"
                            });
                        }
                        
                        this.updateBackground();
                    },
                    
                    centerOnCurrentSector : function() {
                        var sector = Drift.getSector();
                        if( sector ) {
                            this.centerOnSector(sector.getId());
                        }
                    },
                    
                    addSector : function(sector) {
                        var self=this;
                        
                        console.log("add sector " + sector.getId());
                        
                        if( !this.sectors[sector.getId()] ) {
                            this.sectors[sector.getId()] = sector;                            
                        }
                        
                        if( !this.sectorTiles[sector.getId()] ) {
                            var sectorTile = new Drift.Views.SectorTileView({
                                sector : sector
                            });
                            sectorTile.render();
                            //this.$el.append(sectorTile.$el);
                            this.tilesDiv.append(sectorTile.$el);
                            this.sectorTiles[sector.getId()] = sectorTile;
                            
                            this.listenTo(sectorTile, "doubletap", function(e) {
                                var target=$(e.target);
                                if( $(target).hasClass("Planet") ) {
                                    self.trigger("doubletap:planet", $(target).attr("data-id"));
                                } else if( $(target).hasClass("SectorTileHex") ) {
                                    self.trigger("doubletap:sector", $(target).attr("data-id"));
                                }
                            });
                            
                            this.listenTo(sectorTile, "tap", function(e) {
                                var target=$(e.target);
                                if( $(target).hasClass("Planet") ) {
                                    self.trigger("tap:planet", $(target).attr("data-id"));
                                } else if( $(target).hasClass("SectorTileHex") ) {
                                    self.trigger("tap:sector", $(target).attr("data-id"));
                                }
                            })
                        }
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
                        if( this.isLocked() ) return;
                        
                        //console.log("map:mousemove");
                        if( this.isMousedown ) {
                            var deltaX = e.originalEvent.movementX;
                            var deltaY = e.originalEvent.movementY;
                            var currentPosition = $(this.tilesDiv).position();
                            
                            this.y = (parseFloat(this.y) + deltaY);
                            this.x = (parseFloat(this.x) + deltaX);
                            
                            this.tilesDiv.css({
                                "transition-duration" : "unset",
                                "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")",
                            });
                            
                            this.updateBackground();
                        }
                    },
                    
                    updateBackground : function() {
                        var bx = this.x / 3;
                        var by = this.y / 3;
                            
                        this.$el.css({
                            "background-position" : bx + "px " + by + "px"
                        });
                    },
                    
                    onTouchmove : function(e) {
                        if( this.isLocked() ) return;
                        
                        if( this.isMousedown ) {
                            var deltaX = e.originalEvent.touches[0].clientX - this.lastTouchX;
                            var deltaY = e.originalEvent.touches[0].clientY - this.lastTouchY;
                            this.lastTouchX = e.originalEvent.touches[0].clientX;
                            this.lastTouchY = e.originalEvent.touches[0].clientY;
                            var currentPosition = $(this.tilesDiv).position();
                            
                            this.y = (parseFloat(this.y) + deltaY);
                            this.x = (parseFloat(this.x) + deltaX);
                            
                            this.tilesDiv.css({
                                "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")",
                                "transition-duration" : "unset"
                            });
                            
                            this.updateBackground();
                        }
                    },
                    
                    onMousewheel : function(e) {
                        var dir = e.originalEvent.wheelDelta / Math.abs(e.originalEvent.wheelDelta);
                        
                        if( this.isLocked() ) {
                            if( dir>0 ) {
                                this.zoomOff();
                            }
                            return;
                        }
                        //console.log("map:mousewheel");
                        
                        var oldScale = this.scale;
                        if( dir > 0 ) {
                            this.scale = 1.1 * this.scale;
                            if( this.scale > 5 ) this.scale = 5;
                        } else {
                            this.scale = this.scale / 1.1;
                            if( this.scale < .5 ) this.scale = .5;
                        }
                        
                        var mouseX = (e.originalEvent.clientX - this.$el.offset().left);
                        var mouseY = (e.originalEvent.clientY - this.$el.offset().top);
                        
                        var deltaX = (mouseX - this.x)/oldScale;
                        var deltaY = (mouseY - this.y)/oldScale;
                        
                        this.x -= (deltaX) * (this.scale - oldScale);
                        this.y -= (deltaY) * (this.scale - oldScale);

                        this.tilesDiv.css({
                            "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")",
                            "transition-duration" : "none !important"
                        });
                        
                        this.updateBackground();
                    },
                    
                    onPinchstart : function(e) {
                        this.pinchScale = this.scale;
                    },
                    
                    onPinchmove : function(e) {
                        if( this.isLocked() ) {
                            if( e.scale < 1 ) {
                                this.zoomOff();
                            }
                            return;
                        }
                        
                        var oldScale = this.scale;
                        this.scale = this.pinchScale * e.scale;
                        
                        if( this.scale > 5 ) this.scale=5;
                        
                        var mouseX = (e.center.x - this.$el.offset().left);
                        var mouseY = (e.center.y - this.$el.offset().top);
                        
                        var deltaX = (mouseX - this.x)/oldScale;
                        var deltaY = (mouseY - this.y)/oldScale;
                        
                        this.x -= (deltaX) * (this.scale - oldScale);
                        this.y -= (deltaY) * (this.scale - oldScale);

                        this.tilesDiv.css({
                            "transition-duration" : "unset",
                            "transform" : "translate(" + this.x + "px," + this.y + "px) scale(" + this.scale + ")",
                        });
                        
                        this.updateBackground();
                    },
                    
                    onTouchstart : function(e) {
                        if( this.isLocked() ) return;
                        
                        // console.log("map:touchstart");
                        this.lastTouchX = e.originalEvent.touches[0].clientX;
                        this.lastTouchY = e.originalEvent.touches[0].clientY;
                        this.isMousedown = true;
                    },
                    
                    onTouchend : function(e) {
                        if( this.isLocked() ) return;
                        
                        // console.log("map:touchend");
                        this.lastTouchX = null;
                        this.lastTouchY = null;
                        this.isMousedown = false;
                    },
                    
                    onCenterBtnClicked : function(e) {
                        if( this.isLocked() ) return;
                        
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        console.log("center");
                        
                        this.centerOnCurrentSector();
                        
                        return false;
                    },
                    
                    onSectorChange : function(sector) {
                        console.log("map:sectorchange");
                        
                        if( this.isZoomed() ) {
                            this.zoomOff();
                        }

                        this.addSector(sector);
                        
                        var currentSector = Drift.getSector();
                        
                        var sectorTile = this.sectorTiles[currentSector.getId()];
                        sectorTile.updateView();

                        sectorTile = this.sectorTiles[currentSector.getId()];
                        sectorTile.updateView();
                        
                        this.highlightCurrentSector();
                        
                        this.showNeighboringSectors();
                        
                        this.centerOnCurrentSector();
                    },
                    
                    onSectorSet : function(sector) {
                        console.log("map:sectorset");
                        if( this.isZoomed() ) {
                            this.zoomOff();
                        }

                        this.addSector(sector);
                        
                        this.highlightCurrentSector();
                        
                        this.showNeighboringSectors();
                        
                        this.centerOnCurrentSector();
                    },
                    
                    highlightCurrentSector : function() {
                        var sector = Drift.getSector();
                        
                        if( sector ) {
                            this.$el.find("polygon").removeClass("currentSector");
                            
                            var selector = "polygon[data-id=" + sector.getId() + "]";
                            this.$el.find(selector).addClass("currentSector");
                        }
                    },
                    
                    showNeighboringSectors : function() {
                        var self=this;
                        
                        var currentSector = Drift.getSector();
                        
                        for( var index in Drift.Globals.Direction ) {
                            var direction = Drift.Globals.Direction[index];
                            var coords = currentSector.getNeighbor(direction);
                            Drift.getSectorByXY(coords)
                                .then(function(sector) {
                                    self.addSector(sector);
                                })
                                .fail(function() {
                                    console.log("getSectorByXY fail NYI")
                                })
                        }
                    },
                    
                    zoomOnSector : function(sectorId) {
                        console.log("map:zoomon");
                        var mapWidth = this.getWidth();
                        var mapHeight = this.getHeight();
                        
                        // store old x, y and scale
                        if( !this.isZoomed() ) {
                            this.oldX = this.x;
                            this.oldY = this.y;
                            this.oldScale = this.scale;
                        }
                        
                        var tileWidth = Drift.Globals.SectorTile.width;
                        var tileHeight = Drift.Globals.SectorTile.height;
                        
                        var heightWidthRatio = mapHeight / mapWidth;
                        
                        if( heightWidthRatio > 1 ) {
                            var scale = mapWidth / tileWidth;
                        } else {
                            var scale = mapHeight / tileHeight;
                        }
                        
                        this.centerOnSector(sectorId, scale);
                        
                        var sectorTile = this.sectorTiles[sectorId];
                        
                        sectorTile.showFeatures();
                        
                        this.lock();
                        
                        this.model.set({
                            zoomed : true,
                            zoomedOn : sectorId
                        });
                    },
                    
                    zoomOnPlanet : function(planetId) {
                        var self=this;
                        
                        if( !this.isZoomed() ) {
                            this.oldX = this.x;
                            this.oldY = this.y;
                            this.oldScale = this.scale;
                        }
                        
                        this.centerOnPlanet(planetId, 40);
                        
                        this.lock();
                        
                        this.model.set({
                            zoomed : true
                        });
                    },
                    
                    lock : function() {
                        this.model.set({
                            locked : true
                        });
                    },
                    
                    unlock : function() {
                        this.model.set({
                            locked : false
                        })
                    },
                    
                    isLocked : function() {
                        return this.model.get("locked");
                    },
                    
                    isZoomed : function() {
                        return this.model.get("zoomed");
                    },
                    
                    zoomOff : function() {
                        console.log("map:zoomoff");
                        var sectorId = this.model.get("zoomedOn");
                        if( sectorId ) {
                            var sectorTile = this.sectorTiles[sectorId];
                            if( sectorTile ) {
                                sectorTile.hideFeatures();
                            }
                        }
                        
                        this.unlock();
                        this.model.set({
                            zoomed : false,
                            locked : false,
                            zoomedOn : null
                        });
                        this.centerOnPoint(this.oldX, this.oldY, this.oldScale, true);
                    },
                    
                    onZoomedChange : function() {
                        this.trigger("change:zoomed", this.model.get("zoomed"));
                    }
                })
            }
        }
    });
})(jQuery);