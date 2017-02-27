/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Planets : {
                1 : new Drift.Models.PlanetModel({
                    id : 1,
                    sectorId : 0,
                    orbitDistance : 10,
                    orbitPosition : Math.random() * 360,
                    radius : 6371, // km, ~earth
                    resources : {
                        "Ore" : {
                            amount : 1000,
                            harvestRate : .01,
                            refreshRate : .01
                        },
                    }
                }),
                
                2 : new Drift.Models.PlanetModel({
                    id : 2,
                    sectorId : 0,
                    orbitDistance : 100,
                    orbitPosition : Math.random() * 360,
                    radius : 69911, // km, ~jupiter
                    resources : {
                        "Ore" : {
                            amount : 2000,
                            harvestRate : .01,
                            refreshRate : .01
                        }
                    }
                })
            }
        }
    })
})(jQuery);