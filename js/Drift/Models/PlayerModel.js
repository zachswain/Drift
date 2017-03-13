/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                PlayerModel : Backbone.Model.extend({
                    defaults : {
                        name : "",
                        sectorId : null,
                        planetId : null,
                        portId : null,
                        sectors : {},
                        credits : 0,
                    },
                    
                    initialize : function() {
                    },
                    
                    isOrbitingPlanet : function(planetId) {
                        if( planetId ) {
                            if( planetId==this.getPlanetId() ) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if( this.getPlanetId()!=null  ) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    
                    inSector : function(sectorId) {
                        if( this.getSectorId()==sectorId ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    isDockedInPort : function(portId) {
                        if( portId ) {
                            if( this.get("portId")==portId ) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if( this.get("portId")!=null ) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    
                    canDock : function(portId) {
                        var port = Drift.getPortById(portId);
                        if( !this.isDockedInPort() && !this.isOrbitingPlanet() && this.inSector(port.getSectorId()) ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    canLaunch : function(portId) {
                        var port = Drift.getPortById(portId);
                        if( this.isDockedInPort(portId) ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    canMoveTo : function(sectorId) {
                        return true;    
                    },
                    
                    getPortId : function() {
                        return this.get("portId");
                    },
                    
                    setPortId : function(portId) {
                        this.set({
                            portId : portId
                        });
                    },
                    
                    getPlanetId : function() {
                        return this.get("planetId");
                    },
                    
                    setPlanetId : function(planetId) {
                        this.set({
                            planetId : planetId
                        });
                    },
                    
                    getSectorId : function() {
                        return this.get("sectorId");
                    },
                    
                    setSectorId : function(sectorId) {
                        this.set({
                            sectorId : sectorId
                        });
                    },
                    
                    getSectors : function() {
                        return this.get("sectors");    
                    },
                    
                    getCredits : function() {
                        return this.get("credits");
                    },
                    
                    removeCredits : function(amount) {
                        if( amount<=0 ) return false;
                        var credits = this.getCredits();
                        if( credits>=amount ) {
                            credits = new BigNumber(credits).minus(amount).toNumber();
                            this.set({
                                credits : credits
                            });
                            return amount;
                        } else {
                            return false;
                        }
                    },
                    
                    addCredits : function(amount) {
                        if( amount<=0 ) return false;
                        
                        var credits = this.getCredits();
                        credits = new BigNumber(credits).plus(amount).toNumber();
                        this.set({
                            credits : credits
                        });
                        return amount;
                    },
                    
                    hasVisited : function(sectorId) {
                        var sectors = this.getSectors();
                        if( sectors.hasOwnProperty(sectorId) ) {
                            var sector = sectors[sectorId];
                            if( sector && sector.hasVisited() ) {
                                return true;
                            }
                        }
                        
                        return false;
                    }
                })
            }
        }
    })
})(jQuery);