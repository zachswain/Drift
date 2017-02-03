/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Models : {
                PlayerModel : Backbone.Model.extend({
                    defaults : {
                        name : "",
                        sector : null,
                        planet : null,
                        port : null
                    },
                    
                    initialize : function() {
                    },
                    
                    isOrbitingPlanet : function(planetId) {
                        if( planetId ) {
                            if( planetId==this.get("planet") ) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if( this.get("planet")!=null  ) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    
                    inSector : function(sectorId) {
                        if( this.get("sector")==sectorId ) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    
                    isDockedInPort : function(portId) {
                        if( portId ) {
                            if( this.get("port")==portId ) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if( this.get("port")!=null ) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                })
            }
        }
    })
})(jQuery);