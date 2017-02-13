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
                var self=this;
                console.log("Drift running");
                
                
                this.player.set({
                    name : "Spaceman Spiff",
                    sectorId : "0,0",
                    portId : null,
                    planetId : null,
                    credits : 100
                });
                
                this.ship.attachModule(new Drift.ShipModules.CargoBay());
                this.ship.attachModule(new Drift.ShipModules.CargoBay());
                this.ship.attachModule(new Drift.ShipModules.BotControl());
                this.ship.attachModule(new Drift.ShipModules.MiningBay());
                //this.ship.addBots(Drift.Bots.ScrapCollectors, 1);
                //this.ship.addBots(Drift.Bots.PlanetaryMiners, 5);                    
                
                this.setSector(1).then(function() {
                    self.startTick();
                    
                    self.sendMessage({
                        message : "Drift running"
                    });
                });
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
            
            sendMessage : function(msg) {
                this.trigger("chatMessage", msg);  
            },
            
            setSector : function(sectorId) {
                var promise = $.Deferred();
                
                var self=this;
                Drift.getSectorById(sectorId).then(function(sector) {
                    self.player.setSectorId(sector.getId());
                    self.sector = sector;
                    self.trigger("change:sector", self.sector);
                    promise.resolve();
                });
                
                return promise.promise();
            },
            
            getSector : function() {
                return this.sector;
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
            
            getSectorById : function(sectorId) {
                var promise = $.Deferred();
                
                promise.resolve(Drift.Sectors[sectorId]);
                
                return promise.promise();
            },
            
            getPortById : function(id) {
                return Drift.Ports[id];
            },
            
            moveToSector : function(sectorId) {
                var self=this;
                this.getSectorById(sectorId)
                .then(function(sector) {
                    self.setSector(sectorId);
                })
                .fail(function(err) {
                    console.log("failed moving for unknown reason");
                });
            }
        }  
    });
})(jQuery);