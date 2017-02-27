/* global Drift, Backbone, BigNumber, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                PlanetModel : Backbone.Model.extend({
                    defaults : {
                        id : null,
                        sectorId : null,
                        resources : []
                    },
                    
                    initialize : function() {
                    },
                    
                    getResources : function() {
                        return this.get("resources");
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
                    
                    is : function(planet) {
                        return planet.get("id") == this.get("id") && planet!=null;
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
                    },
                    
                    getId : function() {
                        return this.get("id");
                    },
                    
                    getSectorId : function() {
                        return this.get("sectorId");
                    },
                    
                    getOrbitDistance : function() {
                        return this.get("orbitDistance");
                    },
                    
                    getOrbitPosition : function() {
                        return this.get("orbitPosition");
                    },
                    
                    getRadius : function() {
                        return this.get("radius");
                    },
                    
                    getRelativeCenter : function() {
                        var orbitDistance = this.getOrbitDistance() / 100 * .8 * Drift.Globals.SectorTile.width + .2 * Drift.Globals.SectorTile.width;
                        
                        var cx = orbitDistance * Math.cos( this.getOrbitPosition() * Math.PI / 180 );
                        var cy = orbitDistance * Math.sin( this.getOrbitPosition() * Math.PI/ 180 );
                        
                        return {
                            left : cx * Drift.Globals.SectorTile.width / Drift.Globals.SectorTile.viewBoxWidth,
                            top : cy * Drift.Globals.SectorTile.height / Drift.Globals.SectorTile.viewBoxHeight
                        }
                    }
                })
            }
        }
    });
})(jQuery);