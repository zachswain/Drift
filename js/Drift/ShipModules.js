/* global Drift, Backbone, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            ShipModules : {
                CargoBay : Drift.Models.ModuleModel.extend({
                    initialize : function() {
                        Drift.ShipModules.CargoBay.__super__.initialize.apply(this, arguments);
                       
                        this.set({
                            name : "Cargo Bay",
                            type : Drift.Modules.ShipCargoBay
                        });
                    },
                    
                    onAttach : function() {
                    }
                }),
                BotControl : Drift.Models.ModuleModel.extend({
                    initialize : function() {
                        Drift.ShipModules.CargoBay.__super__.initialize.apply(this, arguments);
                       
                        this.set({
                            name : "Bot Control",
                            type : Drift.Modules.ShipBotControl
                        });
                    },
                    
                    onAttach : function() {
                        
                    }
                }),
                MiningBay : Drift.Models.ModuleModel.extend({
                    initialize : function() {
                        Drift.ShipModules.CargoBay.__super__.initialize.apply(this, arguments);
                       
                        this.set({
                            name : "Mining Bay",
                            type : Drift.Modules.ShipMiningBay
                        });
                    }
                })
            }
        }
    });
})(jQuery);