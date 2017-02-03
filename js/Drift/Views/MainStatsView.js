/* global Drift, jQuery, numeral */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                MainStatsView : Backbone.View.extend({
                    className : "MainStatsView",
                    
                    initialize : function(parameters) {
                        this.model = parameters.model;
                        this.ship = parameters.ship;
                        
                        this.listenTo(this.ship, "change:resource:" + Drift.Resources.Scrap, this.onScrapChange);
                        this.listenTo(this.ship, "change:resource:" + Drift.Resources.Ore, this.onOreChange);
                        this.listenTo(this.ship, "attach:module", this.onAttachModule);
                        this.listenTo(this.ship, "change:resources", this.onResourcesChange);
                        this.listenTo(this.model, "change:ticks", this.onTicksChange);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-MainStatsView-template").html() );
                        var html = template({ model : this.model.toJSON() });
                        this.$el.html(html);
                        
                        this.updateView();
                    },
                    
                    updateView : function() {
                        this.updateTotalCargoHolds();
                    },
                    
                    onCurrentEnergyChange : function() {
                        this.$el.find("[data-role=currentEnergySpan]").html(this.model.get("currentEnergy"));
                    },
                    
                    onScrapChange : function() {
                        this.$el.find("[data-role=scrapSpan]").html(
                            numeral(this.ship.get("resources")[Drift.Resources.Scrap]).format("0,0.0")
                        );
                    },
                    
                    onOreChange : function(ore) {
                        this.$el.find("[data-role=oreSpan]").html(
                            numeral(ore).format("0,0.000")
                        );
                    },
                    
                    onTicksChange : function() {
                        this.$el.find("[data-role=ticksSpan]").html(
                            numeral(this.model.get("ticks")).format("0")
                        );
                    },
                    
                    onAttachModule : function(module) {
                        if( module.isType(Drift.Modules.ShipCargoBay) ) {
                            this.updateTotalCargoHolds();
                        }
                    },
                    
                    onResourcesChange : function() {
                        this.updateOccupiedCargoHolds();
                    },
                    
                    updateOccupiedCargoHolds : function() {
                        var occupiedCargoHolds = this.ship.getOccupiedCargoHolds();
                        this.$el.find("[data-role=occupiedCargoHoldsSpan]").html(
                            numeral(occupiedCargoHolds).format("0")
                        );    
                    },
                    
                    updateTotalCargoHolds : function() {
                        var totalCargoHolds = this.ship.getTotalCargoHolds();
                        this.$el.find("[data-role=totalCargoHoldsSpan]").html(
                            numeral(totalCargoHolds).format("0")
                        );
                    }
                })
            }
        }    
    });
})(jQuery);