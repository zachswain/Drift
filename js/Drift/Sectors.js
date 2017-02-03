/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Sectors : {
                1 : new Drift.Models.SectorModel({
                    id : 1,
                    ports : [1],
                    planets : [1, 2],
                    resources : {
                        "Scrap" : {
                            amount : -1,
                            harvestRate : 1,
                            refreshRate : 0
                        }
                    }
                })
            }
        }
    })
})(jQuery);