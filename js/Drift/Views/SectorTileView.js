/* global Backbone, jQuery, Drift */
/* 
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="<%= tileWidth %>" height="<%= tileHeight %>" viewbox="0 0 300 300" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g>
            <polygon class="SectorTileHex" data-id="<%= sector.id %>" data-x="<%= sector.x %>" data-y="<%= sector.y %>" points="300,150 225,280 75,280 0,150 75,20 225,20" ></polygon>
            <text data-role="id" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-family="Verdana" font-size="35" fill="blue"></text>
            <circle class="Feature Star" cx="150" cy="150" r="10"/>
            <circle class="Feature Orbit" cx="150" cy="150" r="40"/>
            <circle class="Feature Planet" cx="110" cy="150" r="10" />
        </g>
    </svg>
    */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                SectorTileView : Backbone.View.extend({
                    className : "SectorTile",
                    
                    events : {
                        //"mousedown" : "onMousedown",
                        //"mousemove" : "onMousemove",
                        //"mouseup" : "onMouseup"
                    },
                    
                    initialize : function(parameters) {
                        parameters = $.extend({ sector: {}}, parameters);
                        this.sector = parameters.sector; 
                        this.mousemoves = null;
                        
                        var height = this.getHeight() ;
                        var width = this.getWidth();
                        
                        var heightCorrectionFactor = 40/300 * Drift.Globals.SectorTile.height;
                        
                        this.top = 
                            (height - heightCorrectionFactor + 1) * -this.sector.getY() // due to Y
                            +
                            1/2 * (height - heightCorrectionFactor + 1)  * this.sector.getX() // due to X
                            ;
                        this.left = 
                            (width + 1) * 3/4 * this.sector.getX() // due to X
                            ;
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-SectorTileView-template").html() );
                        var html = template({ sector : this.sector.toJSON(), tileWidth : this.getWidth(), tileHeight : this.getHeight() });
                        this.$el.html(html);
                      
                        this.$el.css({
                            top : this.top +"px",
                            left : this.left + "px"
                        });
                        
                        this.$el.find("text[data-role=id]").html(this.sector.getId());

                        var self=this;
                        
                        setTimeout(function() {
                            // var hammertime = new Hammer(self.$el[0], {});
                            
                            // hammertime.on("tap", function(e) {
                            //   self.onTap(e);
                            // });
                            
                            // hammertime.on("press", function(e) {
                            //     self.onPress(e);
                            // });
                            
                            self.updateView();
                        },0);
                    },
                    
                    getHeight : function() {
                        return Drift.Globals.SectorTile.height; //Math.sqrt(3) / 2 * Drift.Globals.SectorTile.height;
                    },
                    
                    getWidth : function() {
                        return Drift.Globals.SectorTile.width;
                    },
                    
                    getTop : function() {
                        return this.top;
                    },
                    
                    getLeft : function() {
                        return this.left;
                    },
                    
                    getCenter : function() {
                        return {
                            top : this.getTop() + this.getHeight() / 2,
                            left : this.getLeft() + this.getWidth() / 2
                        }  
                    },
                    
                    updateView : function() {
                        var self=this;
                        var player = Drift.getPlayer();
                        var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + this.getWidth() + '" height="' + this.getHeight() + '" viewbox="0 0 ' + Drift.Globals.SectorTile.viewBoxWidth + ' ' + Drift.Globals.SectorTile.viewBoxHeight + '" xmlns:xlink="http://www.w3.org/1999/xlink">';
                        svg += '<g>';
                        svg += '<polygon class="SectorTileHex ' + (player.hasVisited(this.sector.getId()) ? ' Visited' : ' Unvisited') + '" data-type="SectorTile" data-id="' + this.sector.getId() + '" data-x="' + this.sector.getX() + '" data-y="' + this.sector.getY() + '" points="300,150 225,280 75,280 0,150 75,20 225,20" ></polygon>';
                        svg += '<text data-role="id" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" font-family="Verdana" font-size="35" fill="blue">' + this.sector.getId() + '</text>';
                        svg += '<circle class="Feature Star" cx="150" cy="150" r="10"/>';
                        
                        var promises = [];

                        var planets = this.sector.get("planets");                        

                        $.each(planets, function(index, planetId) {
                            var promise = $.Deferred();
                            promises.push(promise);
                            Drift.getPlanetById(planetId)
                                .then(function(planet) {
                                    var orbitDistance = planet.getOrbitDistance() / 100 * .8 * self.getWidth() + .2 * self.getWidth();
                                    svg += '<circle class="Feature Orbit" data-type="Orbit" data-id="' + planetId + '" cx="150" cy="150" r="' + orbitDistance + '"/>';
                                    
                                    var position = planet.getOrbitPosition();
                                    
                                    var cx = orbitDistance * Math.cos( position * Math.PI / 180 ) + Drift.Globals.SectorTile.viewBoxWidth / 2;
                                    var cy = orbitDistance * Math.sin( position * Math.PI/ 180 ) + Drift.Globals.SectorTile.viewBoxHeight / 2;
                                    var planetaryRadius = Math.log(planet.getRadius());
                                    svg += '<circle class="Feature Planet" data-type="Planet" data-id="' + planetId + '" cx="' + cx + '" cy="' + cy + '" r="' + planetaryRadius + '" />';
                                    promise.resolve();
                                })
                                .fail(function() {
                                    console.log("get planet fail NYI");
                                });
                        });
                        
                        $.when.apply($, promises).then(function() {
                            svg += '</g>';
                            svg += '</svg>';
                        
                            self.$el.html(svg);
                            
                            setTimeout(function() {
                                if( self.hammer ) {
                                    self.hammer.stop(true);
                                    self.hammer.destroy();
                                }
                                self.hammer = new Hammer.Manager(self.$el[0], {});
                                
                                var singleTap = new Hammer.Tap({ event: 'singletap' });
                                var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });
                                
                                self.hammer.add([doubleTap, singleTap]);
                                
                                doubleTap.recognizeWith(singleTap);
                                
                                singleTap.requireFailure([doubleTap]);
                                
                                self.hammer.on("tap singletap doubletap", function(e) {
                                    self.onTap(e);
                                });
                            });
                        });
                    },
                    
                    onMousedown : function(e) {
                        this.mousemoves = 0;
                    },
                    
                    onMousemove : function(e) {
                        if( null!=this.mousemoves) {
                            this.mousemoves += Math.abs(parseFloat(e.originalEvent.movementX)) + Math.abs(parseFloat(e.originalEvent.movementY));
                            //console.log(this.mousemoves);
                        }
                    },
                    
                    onMouseup : function(e) {
                        console.log("tile:mouseup");
                        if( this.mousemoves>3 ) {
                            // assume it was a drag
                        } else {
                            //this.onTapped();
                        }
                        
                        this.mousemoves = null;
                    },
                    
                    onTap : function(e) {
                        e.preventDefault();

                        this.onTapped(e);
                    },
                    
                    onPress : function(e) {
                        console.log("tile:press");    
                    },
                    
                    onTapped : function(e) {
                        console.log(e);
                        if( e.tapCount>=2 ) {
                            console.log("tile:doubletap");
                            this.trigger("doubletap", e);
                        } else {
                            console.log("tile:tapped");
                            this.trigger("tap", e);
                        }
                    },
                    
                    showFeatures : function() {
                        this.$el.addClass("ShowFeatures");
                    },
                    
                    hideFeatures : function() {
                        this.$el.removeClass("ShowFeatures");
                    }
                })
            }
        }
    })
})(jQuery);