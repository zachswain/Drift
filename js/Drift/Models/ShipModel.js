/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                ShipModel : Backbone.Model.extend({
                    defaults : {
                        name : "Golden Gopher",
                        owner : null,
                        pilot : null,
                        bots : {},
                        deployedBots : {},
                        resources : {},
                        modules : [],
                        maxModules : 5
                    },
                    
                    initialize : function() {
                        var resources = this.get("resources");
                        $.each(Object.keys(Drift.Resources), function(index, resource) {
                            resources[resource] = 0;
                        });
                        this.set({
                            resources : resources
                        });
                        
                        var bots = this.get("bots");
                        var deployedBots = this.get("deployedBots");
                        $.each(Object.keys(Drift.Bots), function(index, type) {
                            bots[type] = 0;
                            deployedBots[type] = 0;
                        });
                        this.set({
                            bots : bots
                        });
            
                        this.listenTo(this, "add:module", this.onAddModule);
                        this.listenTo(Drift, "orbit", this.onOrbit);
                        this.listenTo(Drift, "deorbit", this.onDeorbit);
                    },
                    
                    getResource : function(resource) {
                        var resources = this.get("resources");
                        var r = (resources[resource]==undefined ? 0 : resources[resource]);
                        return r;
                    },
                    
                    getWholeNumberResource : function(resource) {
                        var resources = this.get("resources");
                        var r = new BigNumber(resources[resource]==undefined ? 0 : resources[resource]).floor().toNumber();
                        
                        return r;
                    },
                    
                    addResources : function(resource, amount) {
                        if( this.getUnoccupiedCargoHolds()==0 ) return 0;

                        if( amount>this.getUnoccupiedCargoHolds() ) {
                            amount = this.getUnoccupiedCargoHolds();
                        }
                        var resources = this.get("resources");
                        var r = new BigNumber(resources[resource]==undefined ? 0 : resources[resource]);
                        r = r.plus(amount);
                        //console.log(r.toNumber());
                        resources[resource] = r.toNumber();
                        this.set({
                            resources : resources
                        });
                        this.trigger("change:resources");
                        this.trigger("change:resource:" + resource, r.toNumber());
                        return amount;
                    },
                    
                    hasResources : function(resource, amount) {
                        var resources = this.get("resources");
                        var r = (resources[resource]==undefined ? 0 : resources[resource]);
                        //console.log("r=" + r + ", amount=" + amount);
                        if( r >= amount ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    removeResources : function(resource, amount) {
                        var resources = this.get("resources");
                        var r = new BigNumber(resources[resource]==undefined ? 0 : resources[resource]);
                        if( r >= amount ) {
                            r = r.minus(amount);
                            resources[resource] = r.toNumber();
                            this.set({
                                resources : resources
                            });
                            this.trigger("change:resources");
                            this.trigger("change:resource:" + resource, resources);
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    addBots : function(type, amount) {
                        var bots = this.get("bots");
                        var b = (bots[type]==undefined ? 0 : bots[type]);
                        b += amount;
                        bots[type] = b;
                        this.set({
                            bots : bots
                        });
                        this.trigger("change:bots");
                        this.trigger("change:bots:" + type, bots[type]);
                    },
                    
                    getBotCount : function(type) {
                        var bots = this.get("bots");
                        if( type ) {
                            var b = (bots[type]==undefined ? 0 : bots[type]);
                            return b;
                        } else {
                            var total = 0;
                            $.each(Object.keys(bots), function(index, type) {
                                total += bots[type];
                            });
                            return total;
                        }
                    },
                    
                    getDeployedBotCount : function(type) {
                        var bots = this.get("deployedBots");
                        if( type ) {
                            var b = (bots[type]==undefined ? 0 : bots[type]);
                            return b;
                        } else {
                            var total = 0;
                            $.each(Object.keys(bots), function(index, type) {
                                total += bots[type];
                            });
                            return total;
                        }
                    },
                    
                    deployBots : function(type, amount) {
                        var bots = this.get("bots");
                        var deployedBots = this.get("deployedBots");
                        var total = this.getBotCount(type);
                        var deployed = this.getDeployedBotCount(type);
                        var available = total - deployed;
                        
                        
                        if( available>=amount ) {
                            deployed += amount;
                            available -= amount;
                            deployedBots[type] = deployed;
                            
                            this.set({
                                bots : bots,
                                deployedBots : deployedBots
                            });
                            this.trigger("change:deployedBots");
                            this.trigger("change:deployedBots:" + type, deployed);
                        }
                    },
                    
                    deployAllBots : function(type) {
                        var bots = this.get("bots");
                        var deployedBots = this.get("deployedBots");
                        var total = this.getBotCount(type);
                        var deployed = this.getDeployedBotCount(type);
                        var available = total - deployed;
                        this.deployBots(type, available);
                    },
                    
                    undeployBots : function(type, amount) {
                        var deployedBots = this.get("deployedBots");
                        var keys = Object.keys(deployedBots);
                        var self=this;
                        
                        if( deployedBots < amount ) {
                            amount = deployedBots;
                        }
                        
                        $.each(keys, function(index, key) {
                            if( null==type ) {
                                delete deployedBots[key];
                                self.set({
                                    deployedBots : deployedBots
                                });
                                self.trigger("change:deployedBots:" + key, deployedBots[key]);
                            } else if( key==type ) {
                                deployedBots[key] -= amount;
                                self.set({
                                    deployedBots : deployedBots
                                });
                                self.trigger("change:deployedBots:" + key, deployedBots[key]);
                            }
                        });
                        this.trigger("change:deployedBots");
                    },
                    
                    undeployAllBots : function(type) {
                        var deployedBots = this.get("deployedBots");
                        var keys = Object.keys(deployedBots);
                        var self=this;
                        $.each(keys, function(index, key) {
                            if( key==type || undefined==type ) {
                                delete deployedBots[key];
                                self.set({
                                    deployedBots : deployedBots
                                });
                                self.trigger("change:deployedBots:" + key, 0);
                            }
                        });
                        this.trigger("change:deployedBots");
                    },
                    
                    getMaxBots : function() {
                        var botControls = this.getModuleCount(Drift.Modules.ShipBotControl);
                        return botControls * 10;
                    },
                    
                    assignBots : function(type, amount) {
                        var bots = this.get("bots");
                        var unassigned = bots[Drift.Bots.Unassigned];
                        
                        if( unassigned>=amount ) {
                            unassigned -= amount;
                            var t = (bots[type]==undefined ? 0 : bots[type]);
                            t += amount;
                            bots[Drift.Bots.Unassigned] = unassigned;
                            bots[type] = t;
                            this.set({
                                bots : bots
                            });
                            this.trigger("change:bots:" + Drift.Bots.Unassigned, unassigned);
                            this.trigger("change:bots:" + type, t);
                        }
                    },
                    
                    unassignBots : function(type, amount) {
                        var bots = this.get("bots");
                        var unassigned = bots[Drift.Bots.Unassigned];
                        var assigned = (bots[type]==undefined ? 0 : bots[type]);
                        
                        if( assigned>=amount ) {
                            assigned -= amount;
                            unassigned += amount;
                            bots[Drift.Bots.Unassigned] = unassigned;
                            bots[type] = assigned;
                            this.set({
                                bots : bots
                            });
                            this.trigger("change:bots:" + Drift.Bots.Unassigned, unassigned);
                            this.trigger("change:bots:" + type, assigned);
                        }
                    },
                    
                    getModules : function() {
                        return this.get("modules");  
                    },
                    
                    attachModule : function(module) {
                        var maxModules = this.get("maxModules");
                        var modules = this.get("modules");
                        var numModules = modules.length;
                        
                        if( numModules<maxModules ) {
                            if( module.attachTo(this) ) {
                                modules.push(module);
                                this.set({
                                    modules : modules
                                });
                                this.trigger("attach:module:" + module.getType());
                                this.trigger("attach:module", module);
                                return true;
                            } else {
                                console.log("Couldn't attach " + module.get(""))
                            }
                        } else {
                            return false;
                        }
                    },
                    
                    getModuleCount : function(type) {
                        if( type==undefined ) {
                            return this.get("modules").length;
                        } else {
                            var modules = this.get("modules");
                            var count=0;
                            $.each(modules, function(index, module) {
                                if( module.isType(type) ) {
                                    count++;
                                }
                            });
                            return count;
                        }
                    },
                    
                    getMaxModules : function() {
                        return this.get("maxModules");
                    },
                    
                    getTotalCargoHolds : function() {
                        var cargoBays = this.getModuleCount(Drift.Modules.ShipCargoBay);
                        return cargoBays * 10;
                    },
                    
                    getOccupiedCargoHolds : function() {
                        var count=0;
                        var resources = this.get("resources");
                        $.each(resources, function(index, resource) {
                            count+=Math.floor(resource);
                            //count.plus(new BigNumber(resource).floor());
                        });
                        return count;
                    },
                    
                    getUnoccupiedCargoHolds : function() {
                        return this.getTotalCargoHolds() - this.getOccupiedCargoHolds();
                    },
                    
                    onOrbit : function(planet) {
                    },
                    
                    onDeorbit : function(planet) {
                    },
                    
                    deorbit : function(planet) {
                        this.undeployAllBots();
                    },
                    
                    hasModule : function(type) {
                        var modules = this.get("modules");
                        for( var i=0 ; i<modules.length ; i++ ) {
                            if( modules[i].isType(type) ) {
                                return true;
                            }
                        }
                        
                        return false;
                    },
                    
                    tick : function() {
                        this.trigger("before:tick");
                        
                        var sector = Drift.getSector();
                        var player = Drift.getPlayer();
                        var planet = Drift.getPlanet();
                        
                        // Process scrap
                        if( !player.isDockedInPort() && !player.isOrbitingPlanet() ) {
                            var scrapCollectorBots = this.getBotCount(Drift.Bots.ScrapCollectors);
                            var rate = scrapCollectorBots;
                            var scrap = sector.harvest(Drift.Resources.Scrap, rate);
                            if( scrap > 0 ) {
                                this.addResources(Drift.Resources.Scrap, scrap);
                            }
                        }
                        
                        // Process planetary miners
                        var planetaryMiners = this.getDeployedBotCount(Drift.Bots.PlanetaryMiners);
                        if( player.isOrbitingPlanet() && planetaryMiners>0 ) {
                            if( planet ) {
                                var rate = planetaryMiners;
                                var ore = planet.harvest(Drift.Resources.Ore, rate);
                                if( ore > 0 ) {
                                    this.addResources(Drift.Resources.Ore, ore);
                                }
                            }   
                        }
                        
                        this.trigger("tick");
                    }
                })
            }
        }
    })
})(jQuery);