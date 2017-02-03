/* global Backbone, Drift, _, jQuery, numeral */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                PlanetView : Backbone.View.extend({
                    className : "PlanetView",
                    
                    events : {
                        "click [data-role=orbitBtn]" : "onOrbitBtnClicked",
                        "click [data-role=deorbitBtn]" : "onDeorbitBtnClicked",
                        "click [data-role=unassignAllBtn]" : "onUnassignAllBtnClicked",
                        "click [data-role=unassignBtn]" : "onUnassignBtnClicked",
                        "click [data-role=assignBtn]" : "onAssignBtnClicked",
                        "click [data-role=assignAllBtn]" : "onAssignAllBtnClicked"
                    },
                    
                    selectors : {
                        ResourcesTable : "[data-role=resourcesTable]",
                        ResourcesDiv : "[data-role=resourcesDiv]",
                        ActionsDiv : "[data-role=actionsDiv]"
                    },
                    
                    initialize : function(parameters) {
                        this.planet = parameters.planet;
                        var ship = Drift.getShip();
                        
                        this.listenTo(Drift, "change:sector", this.onSectorChange);
                        this.listenTo(Drift, "orbit", this.onOrbit);
                        this.listenTo(Drift, "deorbit", this.onDeorbit);
                        this.listenTo(ship, "change:deployedBots:" + Drift.Bots.PlanetaryMiners, this.onPlanetaryMinersDeployedChanged);
                        this.listenTo(ship, "change:bots:" + Drift.Bots.PlanetaryMiners, this.onPlanetaryMinersChanged);
                        this.listenTo(this.planet, "change:resource:" + Drift.Resources.Ore, this.onOreChanged);
                    },
                    
                    render : function() {
                        var player = Drift.getPlayer();
                        var ship = Drift.getShip();
                        var template = _.template( $("#Drift-PlanetView-template").html() );
                        var html = template({ planet : this.planet.toJSON(), orbitBtnDisabled : player.isOrbitingPlanet(), deorbitBtnDisabled : player.isOrbitingPlanet(this.planet), ship : ship.toJSON() });
                        this.$el.html(html);
                        
                        var self=this;
                        
                        setTimeout(function() {
                            self.updateView();
                        }, 0);
                    },
                    
                    clearResources : function() {
                        this.$el.find(this.selectors.ResourcesTable + " tbody tr").remove();
                    },
                    
                    updateView : function() {
                        this.clearResources();
                        
                        var resources = this.planet.getResources();
                        
                        this.updateOrbitButtons();
                        
                        var self=this;
                        
                        $.each(Object.keys(resources), function(index, resource) {
                            var tr = $("<tr></tr>")
                            .attr("data-type", resource)
                            .append(
                                $("<td></td>")
                                    .attr("data-role", "type")
                                    .html(resource)
                            ).append(
                                $("<td></td>")
                                    .attr("data-role", "amount")
                                    .html(numeral(resources[resource].amount).format("0,0"))
                            )
                            
                            self.$el.find(self.selectors.ResourcesTable).append(tr);
                        });
                    },
                    
                    onOrbitBtnClicked : function(e) {
                        e.preventDefault();
                        Drift.orbit(this.planet);
                    },
                    
                    onDeorbitBtnClicked : function(e) {
                        e.preventDefault();
                        Drift.deorbit(this.planet);
                    },
                    
                    onSectorChange : function(sector) {
                    },
                    
                    updateOrbitButtons : function() {
                        var player = Drift.getPlayer();
                        
                        if( player.isOrbitingPlanet(this.planet) ) {
                            this.$el.find("[data-role=orbitBtn]").attr("disabled", "disabled").addClass("Disabled");
                            this.$el.find("[data-role=deorbitBtn]").removeAttr("disabled").removeClass("Disabled");
                        } else if( player.isOrbitingPlanet() ) {
                            this.$el.find("[data-role=orbitBtn]").attr("disabled", "disabled").addClass("Disabled");
                            this.$el.find("[data-role=deorbitBtn]").attr("disabled", "disabled").addClass("Disabled");
                        } else {
                            this.$el.find("[data-role=orbitBtn]").removeAttr("disabled").removeClass("Disabled");
                            this.$el.find("[data-role=deorbitBtn]").attr("disabled", "disabled").addClass("Disabled");
                        }
                    },
                    
                    onOrbit : function(planet) {
                        var ship = Drift.getShip();
                        this.updateOrbitButtons();
                        
                        if( planet.is(this.planet) ) {
                            this.$el.find(this.selectors.ActionsDiv).show();
                            this.$el.find(this.selectors.ResourcesDiv).show();
                            
                            if( ship.getBotCount(Drift.Bots.PlanetaryMiners)>0 ) {
                                if( ship.getDeployedBotCount(Drift.Bots.PlanetaryMiners)>0 ) {
                                    this.$el.find("[data-role=unassignAllBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").removeAttr("disabled").removeClass("Disabled");
                                    this.$el.find("[data-role=unassignBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").removeAttr("disabled").removeClass("Disable");
                                } else {
                                    this.$el.find("[data-role=unassignAllBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                                    this.$el.find("[data-role=unassignBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                                }
                                
                                if( ship.getDeployedBotCount(Drift.Bots.PlanetaryMiners) < ship.getBotCount(Drift.Bots.PlanetaryMiners) ) {
                                    this.$el.find("[data-role=assignAllBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").removeAttr("disabled").removeClass("Disabled");
                                    this.$el.find("[data-role=assignBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").removeAttr("disabled").removeClass("Disable");
                                } else {
                                    this.$el.find("[data-role=assignAllBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                                    this.$el.find("[data-role=assignBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                                }
                            } else {
                                this.$el.find("[data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                            }
                        }
                    },
                    
                    onDeorbit : function(planet) {
                        this.updateOrbitButtons();
                        
                        this.$el.find(this.selectors.ActionsDiv).hide();
                        this.$el.find(this.selectors.ResourcesDiv).hide();
                        
                        this.$el.find("[data-role=unassignAllBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                        this.$el.find("[data-role=unassignBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                        this.$el.find("[data-role=assignAllBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                        this.$el.find("[data-role=assignBtn][data-type=" + Drift.Bots.PlanetaryMiners + "]").attr("disabled", "disabled").addClass("Disabled");
                    },
                    
                    onUnassignAllBtnClicked : function(e) {
                        e.preventDefault();
                        var type = $(e.currentTarget).attr("data-type");
                        var ship = Drift.getShip();
                        ship.undeployAllBots(type);
                    },
                    
                    onUnassignBtnClicked : function(e) {
                        e.preventDefault();
                      var type = $(e.currentTarget).attr("data-type");  
                      var ship = Drift.getShip();
                      ship.undeployBots(type, 1);
                    },
                    
                    onAssignBtnClicked : function(e) {
                        e.preventDefault();
                        var ship = Drift.getShip();
                        ship.deployBots(Drift.Bots.PlanetaryMiners, 1);
                    },
                    
                    onAssignAllBtnClicked : function(e) {
                        e.preventDefault();
                        
                        var ship = Drift.getShip();
                        ship.deployAllBots(Drift.Bots.PlanetaryMiners);
                    },
                    
                    onPlanetaryMinersDeployedChanged : function(deployed) {
                        var planet = Drift.getPlanet();
                        if( planet.is(this.planet) ) {
                            if( deployed > 0 ) {
                                this.$el.find("[data-role=unassignAllBtn]").removeAttr("disabled").removeClass("Disabled");
                                this.$el.find("[data-role=unassignBtn]").removeAttr("disabled").removeClass("Disabled");
                            } else {
                                this.$el.find("[data-role=unassignAllBtn]").attr("disabled", "disabled").addClass("Disabled");
                                this.$el.find("[data-role=unassignBtn]").attr("disabled", "disabled").addClass("Disabled");
                            }
                            
                            this.$el.find("[data-role=deployedBotsSpan]").html(deployed);
                        }
                    },
                    
                    onPlanetaryMinersChanged : function(available) {
                        this.$el.find("[data-role=totalBotsSpan]").html(available);
                        
                        var ship = Drift.getShip();
                        var deployed = ship.getDeployedBotCount(Drift.Bots.PlanetaryMiners);
                        if( deployed>available ) {
                            ship.undeployBots(Drift.Bots.PlanetaryMiners, deployed-available);
                        }
                    },
                    
                    onOreChanged : function(amount) {
                        this.$el.find("[data-type=" + Drift.Resources.Ore + "] [data-role=amount]").html( numeral(amount).format("0,0.0"));
                    }
                })
            }
        }    
    });
})(jQuery);