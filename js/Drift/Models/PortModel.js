/* global Drift, Backbone, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                PortModel : Backbone.Model.extend({
                    defaults : {
                        id : null,
                        sectorId : null,
                        resources : [],
                        credits : 0
                    },
                    
                    initialize : function() {
                    },
                    
                    getId : function() {
                        return this.get("id")
                    },
                    
                    getSectorId : function() {
                        return this.get("sectorId");
                    },
                    
                    getResources : function() {
                        return this.get("resources");
                    },
                    
                    addResources : function(resource, amount) {
                        var resources = this.get("resources");
                        var r = new BigNumber(resources[resource]==undefined ? 0 : resources[resource].amount);
                        r = r.plus(amount);

                        resources[resource].amount = r.toNumber();
                        this.set({
                            resources : resources
                        });
                        this.trigger("change:resources");
                        this.trigger("change:resource:" + resource, r.toNumber());
                        return amount;
                    },
                    
                    removeResources : function(resource, amount) {
                        var resources = this.get("resources");
                        var r = new BigNumber(resources[resource]==undefined ? 0 : resources[resource].amount);
                        if( r >= amount ) {
                            r = r.minus(amount);
                            resources[resource].amount = r.toNumber();
                            this.set({
                                resources : resources
                            });
                            this.trigger("change:resource:" + resource, resources);
                            this.trigger("change:resources");
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    getCredits : function() {
                        return this.get("credits");
                    },
                    
                    addCredits : function(amount) {
                        var credits = this.getCredits();
                        credits = new BigNumber(credits).plus(amount).toNumber();
                        this.set({
                            credits : credits
                        });
                    },
                    
                    isSelling : function(resource) {
                        var resources = this.getResources();
                        if( resources[resource] && resources[resource].selling ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    isBuying : function(resource) {
                        var resources = this.getResources();
                        if( resources[resource] && resources[resource].buying ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                })
            }
        }
    });
})(jQuery);