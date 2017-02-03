/* global Backbone, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                ShipContentPaneView : Backbone.View.extend({
                    className : "ShipContentPane ContentPane",
                    
                    selectors : {
                        ModulesList : "[data-role=modulesList]",  
                    },
                    
                    initialize : function(parameters) {
                        this.model = parameters.model;
                        this.ship = parameters.ship;
                        
                        this.listenTo(this.ship, "attach:module", this.onModuleAttached);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-ShipContentPaneView-template").html() );
                        var html = template({ model : this.model.toJSON(), ship : this.ship.toJSON() });
                        this.$el.html(html);
                        
                        this.updateView();
                    },
                    
                    onModuleAttached : function(module) {
                        this.updateModulesInfo();
                        this.updateModulesList();
                    },
                    
                    updateView : function() {
                        this.updateModulesInfo();
                        this.updateModulesList();
                    },
                    
                    updateModulesInfo : function() {
                        this.$el.find("[data-role=occupiedModulesSpan]").html(this.ship.getModuleCount());
                        this.$el.find("[data-role=maxModulesSpan]").html(this.ship.getMaxModules());
                    },
                    
                    clearModulesList : function() {
                        this.$el.find(this.selectors.ModulesList + " li").remove();  
                    },
                    
                    updateModulesList : function() {
                        this.clearModulesList();
                        
                        var list = this.$el.find(this.selectors.ModulesList);
                        var modules = this.ship.getModules();
                        
                        for( var i=0 ; i<this.ship.getMaxModules() ; i++ ) {
                            if( modules[i] ) {
                                var li = $("<li></li>").html(
                                    (i+1) + ". " + modules[i].getName()
                                );
                                $(list).append(li);
                            } else {
                                var li = $("<li></li>").html((i+1) + ". --EMPTY--");
                                $(list).append(li);
                            }
                        }
                    }
                })
            }
        }    
    });
})(jQuery);