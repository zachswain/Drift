/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                SectorTileView : Backbone.View.extend({
                    className : "SectorTile",
                    
                    events : {
                        "click svg" : "onClick"
                    },
                    
                    initialize : function(parameters) {
                        parameters = $.extend({ sector: {}}, parameters);
                        this.sector = parameters.sector;
                        
                        
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-SectorTileView-template").html() );
                        var html = template({ sector : this.sector.toJSON() });
                        this.$el.html(html);

                        var height = Math.sqrt(3) / 2 * 50 + 1;
                        var width = 50;
                        
                        var top = 
                            height * this.sector.getY() // due to Y
                            +
                            1/2 * height * this.sector.getX() // due to X
                            -
                            height / 2;
                        var left = 
                            width * 3/4 * this.sector.getX() // due to X
                            -
                            width / 2;

                        this.$el.css({
                            top : top +"px",
                            left : left + "px"
                        });
                        
                        this.$el.find("text[data-role=id]").html(this.sector.getId());

                        var self=this;
                        
                        setTimeout(function() {
                            self.$el.find("svg").on('mousedown touchstart', function( e ) {
                                //e.stopImmediatePropagation();
                                self.onClick(e);
                            });
                            self.updateView();
                        },0);
                    },
                    
                    updateView : function() {
                        
                    },
                    
                    onClick : function(e) {
                        console.log("click");
                    }
                })
            }
        }
    })
})(jQuery);