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
                        var ship = Drift.getShip();
                        
                        this.listenTo(this.ship, "attach:module", this.onModuleAttached);
                    },
                    
                    render : function() {
                        var ship = Drift.getShip();
                        var template = _.template( $("#Drift-ShipContentPaneView-template").html() );
                        var html = template({ ship : ship.toJSON() });
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
                        var ship = Drift.getShip();
                        this.$el.find("[data-role=occupiedModulesSpan]").html(ship.getModuleCount());
                        this.$el.find("[data-role=maxModulesSpan]").html(ship.getMaxModules());
                    },
                    
                    clearModulesList : function() {
                        this.$el.find(this.selectors.ModulesList + " li").remove();  
                    },
                    
                    updateModulesList : function() {
                        var ship = Drift.getShip();
                        this.clearModulesList();
                        
                        var list = this.$el.find(this.selectors.ModulesList);
                        var modules = ship.getModules();
                        
                        for( var i=0 ; i<ship.getMaxModules() ; i++ ) {
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