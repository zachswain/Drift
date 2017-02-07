/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Planets : {
                1 : new Drift.Models.PlanetModel({
                    id : 1,
                    sectorId : 1,
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
                    sectorId : 1,
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