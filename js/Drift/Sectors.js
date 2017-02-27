/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Sectors : {
                0 : new Drift.Models.SectorModel({
                    id : 0,
                    x : 0,
                    y : 0,
                    firstVisitedOn : null,
                    lastVisitedOn : null,
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
                1 : new Drift.Models.SectorModel({
                    id : 1,
                    x : 1,
                    y : 0,
                    firstVisitedOn : null,
                    lastVisitedOn : null,
                    ports : [],
                    planets : [],
                    resources : {}
                }),
                2 : new Drift.Models.SectorModel({
                    id : 2,
                    x : 0,
                    y : 1,
                    ports : [],
                    planets : [],
                    resources : {}
                }),
                3 : new Drift.Models.SectorModel({
                    id : 3,
                    x : 0,
                    y : -1,
                    firstVisitedOn : null,
                    lastVisitedOn : null,
                    ports : [],
                    planets : [],
                    resources : {}
                }),
                4 : new Drift.Models.SectorModel({
                    id : 4,
                    x : 1,
                    y : 1,
                    firstVisitedOn : null,
                    lastVisitedOn : null,
                    ports : [],
                    plants : [],
                    resources : {}
                })
            }
        }
    })
})(jQuery);