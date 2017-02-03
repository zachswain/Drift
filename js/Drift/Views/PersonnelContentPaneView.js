/* global Backbone, _, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                PersonnelContentPaneView : Backbone.View.extend({
                    className : "PersonnelContentPane ContentPane",
                    
                    selectors : {
                        TotalBotsSpan : "[data-role=totalBotsSpan]"  ,
                        MaxBotsSpan : "[data-role=maxBotsSpan]"
                    },
                    
                    events : {
                        "click [data-role=buildBotBtn]" : "onClickBuildBotBtn",
                        "click [data-role=assignBotBtn]" : "onClickAssignBotBtn",
                        "click [data-role=unassignBotBtn]" : "onUnassignBotBtnClick"
                    },
                    
                    initialize : function(parameters) {
                        this.model = parameters.model;
                        this.ship = parameters.ship;
                        
                        this.listenTo(this.ship, "change:resource:" + Drift.Resources.Scrap, this.onScrapChange);
                        this.listenTo(this.ship, "change:bots", this.onBotsChange);
                        this.listenTo(this.ship, "change:bots:" + Drift.Bots.Unassigned, this.onUnassignedBotsChange);
                        this.listenTo(this.ship, "change:bots:" + Drift.Bots.ScrapCollectors, this.onScrapCollectorsChange);
                        this.listenTo(this.ship, "change:bots:" + Drift.Bots.PlanetaryMiners, this.onPlanetaryMinersChange);
                        this.listenTo(this.ship, "attach:module:" + Drift.Modules.ShipMiningBay, this.onAddMiningBay);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-PersonnelContentPaneView-template").html() );
                        var html = template({ model : this.model.toJSON(), ship : this.ship.toJSON() });
                        this.$el.html(html);
                        
                        this.updateView();
                    },
                    
                    updateView : function() {
                        this.$el.find(this.selectors.TotalBotsSpan).html(this.ship.getBotCount());
                        this.$el.find(this.selectors.MaxBotsSpan).html(this.ship.getMaxBots());
                        
                        this.checkCanUnassignBots(Drift.Bots.ScrapCollectors);
                        this.checkCanAssignScrapCollectors();
                        this.checkCanUnassignBots(Drift.Bots.PlanetaryMiners);
                        this.checkCanAssignPlanetaryMiners();
                    },
                    
                    onScrapChange : function() {
                        this.updateBuildBotBtn();
                    },
                    
                    updateBuildBotBtn : function() {
                        var ship = Drift.getShip();
                        
                        if( ship.getResource(Drift.Resources.Scrap) >= 10 ) {
                            if( ship.getBotCount() < ship.getMaxBots() ) {
                                this.enableBuildBotBtn();
                            }
                        } else {
                            this.disabledBuildBotBtn();
                        }    
                    },
                    
                    onBotsChange : function() {
                        this.updateBuildBotBtn();
                        this.updateTotalBots();
                    },
                    
                    updateTotalBots : function() {
                        this.$el.find("[data-role=totalBotsSpan]").html(this.ship.getBotCount());
                    },
                    
                    onUnassignedBotsChange : function(amount) {
                        this.$el.find("[data-role=unassignedBotsSpan]").html(this.ship.getBotCount(Drift.Bots.Unassigned));
                        
                        this.checkCanAssignScrapCollectors();
                        this.checkCanAssignPlanetaryMiners();
                    },
                    
                    onScrapCollectorsChange : function(amount) {
                        this.$el.find("[data-role=scrapCollectorBotsSpan]").html(this.ship.getBotCount(Drift.Bots.ScrapCollectors));
                        
                        if( amount>0 ) {
                            this.$el.find("[data-role=unassignBotBtn][data-type=" + Drift.Bots.ScrapCollectors + "]").removeAttr("disabled").removeClass("Disabled");
                        } else {
                            this.$el.find("[data-role=unassignBotBtn][data-type=" + Drift.Bots.ScrapCollectors + "]").attr("disabled", "disabled").addClass("Disabled");
                        }
                    },
                    
                    onPlanetaryMinersChange : function(amount) {
                        var ship = Drift.getShip();
                        this.$el.find("[data-role=planetaryMinersBotsSpan]").html(ship.getBotCount(Drift.Bots.PlanetaryMiners));
                        
                        this.checkCanUnassignBots(Drift.Bots.PlanetaryMiners);
                    },
                    
                    checkCanUnassignBots : function(type) {
                        var ship = Drift.getShip();
                        var amount = ship.getBotCount(type);
                        
                        if( amount>0 ) {
                            this.$el.find("[data-role=unassignBotBtn][data-type=" + type + "]").removeAttr("disabled").removeClass("Disabled");
                        } else {
                            this.$el.find("[data-role=unassignBotBtn][data-type=" + type + "]").attr("disabled", "disabled").addClass("Disabled");
                        }
                    },
                    
                    checkCanAssignScrapCollectors : function() {
                        if( this.ship.getBotCount(Drift.Bots.Unassigned)>=1 ) {
                            this.$el.find("[data-role=assignBotBtn][data-type=" + Drift.Bots.ScrapCollectors + "]").removeAttr("disabled").removeClass("Disabled");
                        } else {
                            this.$el.find("[data-role=assignBotBtn][data-type=" + Drift.Bots.ScrapCollectors + "]").attr("disabled", "disabled").addClass("Disabled");
                        }
                    },
                    
                    checkCanAssignPlanetaryMiners : function() {
                        if( this.canAssignPlanetaryMiners() ) {
                            this.$el.find("[data-role=assignBotBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").removeAttr("disabled").removeClass("Disabled");
                        } else {
                            this.$el.find("[data-role=assignBotBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                        }
                    },
                    
                    canAssignPlanetaryMiners : function() {
                        var ship = Drift.getShip();
                        
                        if( !ship.hasModule(Drift.Modules.ShipMiningBay) ) return false;
                        if( ship.getBotCount(Drift.Bots.Unassigned)<=0 ) return false;
                        
                        return true;
                    },
                    
                    enableBuildBotBtn : function() {
                        this.$el.find("[data-role=buildBotBtn]").removeAttr("disabled").removeClass("Disabled");
                    },
                    
                    disabledBuildBotBtn : function() {
                        this.$el.find("[data-role=buildBotBtn]").attr("disabled", "disabled").addClass("Disabled");
                    },
                    
                    onClickBuildBotBtn : function(e) {
                        e.preventDefault();
                        
                        if( this.ship.removeResources(Drift.Resources.Scrap, 10) ) {
                            this.ship.addBots(Drift.Bots.Unassigned, 1);
                        }
                    },
                    
                    onClickAssignBotBtn : function(e) {
                        e.preventDefault();
                        var type = $(e.currentTarget).attr('data-type');
                        this.ship.assignBots(type, 1);
                    },
                    
                    onUnassignBotBtnClick : function(e) {
                        e.preventDefault();
                        var type = $(e.currentTarget).attr("data-type");
                        this.ship.unassignBots(type, 1);
                    },
                    
                    onAddMiningBay : function() {
                        this.checkCanAssignPlanetaryMiners();
                    },
                })
            }
        }    
    });
})(jQuery);