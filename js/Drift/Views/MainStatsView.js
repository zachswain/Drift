/* global _, Backbone, Drift, jQuery, numeral */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                MainStatsView : Backbone.View.extend({
                    className : "MainStatsView",
                    
                    initialize : function(parameters) {
                        this.ship = Drift.getShip();
                        this.player = Drift.getPlayer();
                        
                        this.listenTo(this.ship, "change:resource:" + Drift.Resources.Scrap, this.onScrapChange);
                        this.listenTo(this.ship, "change:resource:" + Drift.Resources.Ore, this.onOreChange);
                        this.listenTo(this.ship, "attach:module", this.onAttachModule);
                        this.listenTo(this.ship, "change:resources", this.onResourcesChange);
                        this.listenTo(Drift, "change:ticks", this.onTicksChange);
                        this.listenTo(this.player, "change:credits", this.onCreditsChange);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-MainStatsView-template").html() );
                        var html = template();
                        this.$el.html(html);
                        
                        this.updateView();
                    },
                    
                    updateView : function() {
                        this.updateTotalCargoHolds();
                        this.updateCredits();
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
                    
                    onTicksChange : function(ticks) {
                        this.$el.find("[data-role=ticksSpan]").html(
                            numeral(ticks).format("0")
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
                    
                    onCreditsChange : function() {
                        this.updateCredits();  
                    },
                    
                    updateCredits : function() {
                        this.$el.find("[data-role=creditsSpan]").html(this.player.getCredits());
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