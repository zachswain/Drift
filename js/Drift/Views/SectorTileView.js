/* global Backbone, jQuery, Drift */
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
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-SectorTileView-template").html() );
                        var html = template({ sector : this.sector.toJSON() });
                        this.$el.html(html);
                        
                        var height = this.getHeight();
                        var width = this.getWidth();
                        
                        this.top = 
                            height * -this.sector.getY() // due to Y
                            +
                            1/2 * height * this.sector.getX() // due to X
                            -
                            height / 2;
                        this.left = 
                            width * 3/4 * this.sector.getX() // due to X
                            -
                            width / 2;

                        this.$el.css({
                            top : this.top +"px",
                            left : this.left + "px"
                        });
                        
                        this.$el.find("text[data-role=id]").html(this.sector.getId());

                        var self=this;
                        
                        setTimeout(function() {
                            var hammertime = new Hammer(self.$el[0], {});
                            
                            hammertime.on("tap", function(e) {
                               self.onTap(e);
                            });
                            
                            hammertime.on("press", function(e) {
                                self.onPress(e);
                            });
                            
                            self.updateView();
                        },0);
                    },
                    
                    getHeight : function() {
                        return Math.sqrt(3) / 2 * 50 + 1;
                    },
                    
                    getWidth : function() {
                        return 50;
                    },
                    
                    getTop : function() {
                        return this.top;
                    },
                    
                    getLeft : function() {
                        return this.left;
                    },
                    
                    updateView : function() {
                        
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
                        
                        console.log("tile:tap");
                        this.onTapped(e);
                    },
                    
                    onPress : function(e) {
                        console.log("tile:press");    
                    },
                    
                    onTapped : function(e) {
                        if( e.tapCount>=2 ) {
                            console.log("tile:doubletap");
                        } else {
                            console.log("tile:tapped");
                        }
                    },
                })
            }
        }
    })
})(jQuery);