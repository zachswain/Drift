/* global Backbone, Drift, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                PortsContentPaneView : Backbone.View.extend({
                    className : "PortsContentPane ContentPane",
                    
                    initialize : function(parameters) {
                        this.views = [];
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-PortsContentPaneView-template").html() );
                        var html = template();
                        this.$el.html(html);
                        
                        this.updateView();
                    },
                    
                    setSector : function(sector) {
                        this.sector = sector;
                    },
                    
                    clearPorts : function() {
                        while(this.views.length>0) {
                            var view = this.views.pop();
                            view.dispose();
                        }
                        
                        this.$el.find("ul[data-role=portsList] li").remove();
                    },
                    
                    updateView : function() {
                        this.clearPorts();
                        
                        if( !this.sector ) return;
                        
                        var ports = this.sector.getPorts();
                        
                        if( !ports || ports.length==0 ) return;
                        
                        var self=this;
                        
                        $.each(ports, function(index, port) {
                            var view = new Drift.Views.PortView({ port : port });
                            var li = $("<li></li>").append( view.$el );
                            self.$el.find("ul[data-role=portsList]").append(li);
                            view.render();
                        });
                    }
                })
            }
        }    
    });
})(jQuery);