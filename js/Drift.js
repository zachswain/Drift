/* global Backbone, Drift, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            initialize : function() {
                _.extend(this, Backbone.Events);
                
                Backbone.View.prototype.dispose = function() {
                    this.remove();
                    this.off();
                    if( this.model && this.model.off ) this.model.off(null, null, this);
                };
                
                this.model = new Drift.Models.DriftModel();
                this.player = new Drift.Models.PlayerModel();
                this.ship = new Drift.Models.ShipModel();
                this.sector = null;
                this.planet = null;
                
                this.view = new Drift.Views.MainView({
                    model : this.model,
                    ship : this.ship
                });
                this.view.render();
                $("body").append(this.view.$el);
                
                var self=this;
            },
            
            run : function() {
                console.log("Drift running");
                
                this.player.set({
                    name : "Spaceman Spiff",
                    sectorId : "0,0",
                    portId : null,
                    planetId : null,
                    credits : 100
                });
                this.setSector("0,0");
                
                this.ship.attachModule(new Drift.ShipModules.CargoBay());
                this.ship.attachModule(new Drift.ShipModules.CargoBay());
                this.ship.attachModule(new Drift.ShipModules.BotControl());
                this.ship.attachModule(new Drift.ShipModules.MiningBay());
                //this.ship.addBots(Drift.Bots.ScrapCollectors, 1);
                //this.ship.addBots(Drift.Bots.PlanetaryMiners, 5);
                
                this.startTick();
            },
            
            startTick : function() {
                var self=this;
                this.tick();
            },
            
            tick : function() {
                var self=this;
                
                var ticks = self.model.get("ticks");
                ticks++;
                this.model.set({
                    ticks : ticks
                });
                
                this.ship.tick();
                
                this.intervalId = setTimeout(function() {
                    self.tick();
                }, 1000);
            },
            
            setSector : function(sectorId) {
                this.player.setSectorId(sectorId);
                this.sector = Drift.Sectors[sectorId];
                this.trigger("change:sector", this.sector);
            },
            
            orbit : function(planetId) {
                var planet = Drift.Planets[planetId];
                if( this.player.inSector(planet.getSectorId()) && !this.player.isOrbitingPlanet() && !this.player.isDockedInPort() ) {
                    this.player.setPlanetId(planet.getId());
                    this.planet = planet;
                    this.trigger("orbit", planet);
                    return true;
                } else {
                    return false;
                }
            },
            
            deorbit : function(planetId) {
                var planet = Drift.Planets[planetId];
                if( this.player.inSector(planet.getSectorId()) && this.player.isOrbitingPlanet(planet.getId()) ) {
                    this.ship.deorbit(this.planet);
                    this.player.setPlanetId(null);
                    this.planet = null;
                    this.trigger("deorbit", planet);
                    return true;
                } else {
                    return false;
                }
            },
            
            dock : function(portId) {
                var port = Drift.Ports[portId];
                
                if( this.player.inSector(port.getSectorId()) && !this.player.isOrbitingPlanet() && !this.player.isDockedInPort() ) {
                    this.player.setPortId(port.getId());
                    this.trigger("dock", port);
                    return true;
                } else {
                    return false;
                }
            },
            
            launch : function(portId) {
                var port = Drift.Ports[portId];
                
                if( this.player.inSector(port.getSectorId()) && !this.player.isOrbitingPlanet() && this.player.isDockedInPort(port.getId()) ) {
                    this.player.setPortId(null);
                    this.trigger("launch", port);
                    return true;
                } else {
                    return false;
                }
            },
            
            getPlayer : function() {
                return this.player;
            },
            
            getShip : function() {
                return this.ship;
            },
            
            getPlanet : function() {
                return this.planet;
            },
            
            getSector : function() {
                return this.sector;
            },
            
            getSectorAt : function(x, y) {
                var index = x + "," + y;
                console.log(index);
                if( Drift.Sectors[index] ) {
                    return Drift.Sectors[index];
                } else {
                    return false;
                }
            },
            
            getPortById : function(id) {
                return Drift.Ports[id];
            }
        }  
    });
})(jQuery);