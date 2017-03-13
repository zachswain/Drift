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
                
                Drift.Server.initialize();
                Drift.Server.run();
            
                this.listenTo(Drift.Server, "change:ticks", this.onTicksChange);
                this.listenTo(Drift.Server, "move:sector", this.onSectorMove);
                
                var self=this;
            },
            
            run : function() {
                var self=this;
                console.log("Drift running");
                
                var self = this;
                
                Drift.Server.getPlayer()
                    .then(function(player) {
                        self.player.set(player);
                        
                        self.ship.attachModule(new Drift.ShipModules.CargoBay());
                        self.ship.attachModule(new Drift.ShipModules.CargoBay());
                        self.ship.attachModule(new Drift.ShipModules.BotControl());
                        self.ship.attachModule(new Drift.ShipModules.MiningBay());
                        //this.ship.addBots(Drift.Bots.ScrapCollectors, 1);
                        //this.ship.addBots(Drift.Bots.PlanetaryMiners, 5);
                        
                        self.view = new Drift.Views.MainView();
                        self.view.render();
                        $("body").append(self.view.$el);
                        
                        self.setSector(self.player.getSectorId())
                            .then(function() {
                                self.sendMessage({
                                    message : "Drift running"
                                });
                            })
                            .fail(function() {
                                console.log("set sector failed NYI");
                            });
                    })
                    .fail(function() {
                        console.log("get player fail NYI"); 
                    });
            },
            
            sendMessage : function(msg) {
                this.trigger("chatMessage", { message : msg });  
            },
            
            setSector : function(sectorId) {
                var promise = $.Deferred();
                
                var self=this;
                Drift.getSectorById(sectorId).then(function(sector) {
                    Drift.Server.setSector(sectorId)
                        .then(function() {
                            self.player.setSectorId(sector.getId());
                            self.sector = sector;
                            self.trigger("set:sector", self.sector);
                            promise.resolve();
                        });
                });
                
                return promise.promise();
            },
            
            onSectorMove : function(sectorJson) {
                console.log("onsectormove");
                this.sector = new Drift.Models.SectorModel(sectorJson);
                this.trigger("change:sector", this.sector);
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
            
            getPlanetById : function(planetId) {
                var promise = $.Deferred();
                
                promise.resolve(Drift.Planets[planetId]);
                
                return promise.promise();
            },
            
            getSector : function() {
                return this.sector;
            },
            
            getSectorById : function(sectorId, includeNeighbors) {
                var promise = $.Deferred();
                
                // query server for sectors 
                promise.resolve(Drift.Sectors[sectorId]);
                
                return promise.promise();
            },
            
            getSectorByXY : function(coords) {
                return Drift.Server.getSectorByXY(coords);
            },
            
            getPortById : function(id) {
                return Drift.Ports[id];
            },
            
            moveToSector : function(sectorId) {
                var self=this;
                Drift.Server.moveToSector(sectorId)
                    .then(function() {
                        console.log("successfully moved to sector " + sectorId + ", watch for trigger");
                    })
                    .fail(function() {
                        console.log("moveToSector fail NYI");
                    });
            },
            
            onTicksChange : function(ticks) {
                this.model.set({
                    ticks : ticks
                });
                this.trigger("change:ticks", ticks);
            }
        }  
    });
})(jQuery);