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
                    sector : 1,
                    port : null,
                    planet : null
                });
                this.setSector(Drift.Sectors[1]);
                
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
            
            setSector : function(sector) {
                this.sector = sector;
                this.trigger("change:sector", this.sector);
            },
            
            orbit : function(planet) {
                if( this.player.inSector(planet.get("sector")) && !this.player.isOrbitingPlanet() && !this.player.isDockedInPort() ) {
                    this.player.set({
                        planet : planet
                    });
                    this.planet = planet;
                    this.trigger("orbit", planet);
                    return true;
                } else {
                    return false;
                }
            },
            
            deorbit : function(planet) {
                if( this.player.inSector(planet.get("sector")) && this.player.isOrbitingPlanet(planet) ) {
                    this.ship.deorbit(this.planet);
                    this.player.set({
                        planet : null
                    });
                    this.planet = null;
                    this.trigger("deorbit", planet);
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
            }
        }  
    });
})(jQuery);