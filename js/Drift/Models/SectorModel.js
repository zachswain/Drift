/* global Drift, Backbone, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                SectorModel : Backbone.Model.extend({
                    defaults : {
                        id : null,
                        ports : [],
                        planets : [],
                        resources : {}
                    },
                    
                    initialize : function() {
                    },
                    
                    getPorts : function() {
                        var ports = [];
                        
                        $.each(this.get("ports"), function(index, id) {
                            var port = Drift.Ports[id];
                            if( port ) {
                                ports.push(port);
                            } else {
                                console.log("couldn't find port " + id);
                            }
                        });
                        
                        return ports;
                    },
                    
                    getPlanets : function() {
                        var planets = [];
                        
                        $.each(this.get("planets"), function(index, id) {
                            var planet = Drift.Planets[id];
                            if( planet ) {
                                planets.push(planet);
                            } else {
                                console.log("couldn't find planet " + id);
                            }
                        });
                        
                        return planets;
                    },
                    
                    hasResources : function(resourceType, amount) {
                        
                    },
                    
                    getResource : function(resourceType, amount) {
                        var resources = this.get("resources");
                        if( resources[resourceType] ) {
                            if( resources[resourceType].amount == -1) {
                                // no change; -1 = infinity
                            } else if( resources[resourceType].amount <= amount ) {
                                amount = resources[resourceType].amount;
                                resources[resourceType].amount = new BigNumber(resources[resourceType].amount).minus(amount).toNumber();
                                this.set({
                                    resources : resources
                                });
                            } else {
                                resources[resourceType].amount = new BigNumber(resources[resourceType].amount).minus(amount).toNumber();
                                this.set({
                                    resources : resources
                                });
                            }
                            
                            this.trigger("change:resource:" + resourceType, resources[resourceType].amount);
                            return amount;
                        } else {
                            return null;
                        }
                    },
                    
                    harvest : function(resourceType, amount) {
                        var resources = this.get("resources");
                        if( resources[resourceType] ) {
                            var resource = resources[resourceType];
                            var adjustedAmount = new BigNumber(amount).times(resource.harvestRate).toNumber();
                            var r = this.getResource(resourceType, adjustedAmount);
                            return r;
                        } else {
                            return null;
                        }
                    }
                })
            }
        }
    });
})(jQuery);