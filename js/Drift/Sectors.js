/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Sectors : {
                "0,0" : new Drift.Models.SectorModel({
                    id : "0,0",
                    x : 0,
                    y : 0,
                    ports : [1, 2],
                    planets : [1, 2],
                    resources : {
                        "Scrap" : {
                            amount : -1,
                            harvestRate : .2,
                            refreshRate : 0
                        }
                    }
                }),
                "1,0" : new Drift.Models.SectorModel({
                    id : "1,0",
                    x : 1,
                    y : 0,
                    ports : [],
                    planets : [],
                    resources : {}
                }),
                "0,1" : new Drift.Models.SectorModel({
                    id : "0,1",
                    x : 0,
                    y : 1,
                    ports : [],
                    planets : [],
                    resources : {}
                }),
                "0,-1" : new Drift.Models.SectorModel({
                    id : "0,-1",
                    x : 0,
                    y : -1,
                    ports : [],
                    planets : [],
                    resources : {}
                }),
                "1,1" : new Drift.Models.SectorModel({
                    id : "1,1",
                    x : 1,
                    y : 1,
                    ports : [],
                    plants : [],
                    resources : {}
                })
            }
        }
    })
})(jQuery);