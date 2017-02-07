/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Ports : {
                1 : new Drift.Models.PortModel({
                    id : 1,
                    sectorId : 1,
                    resources : {
                        "Scrap" : {
                            buying : true,
                            buyingRate : 1,
                            
                            selling : false,
                            
                            amount : 0
                        },
                        "Ore" : {
                            buying : true,
                            buyingRate : .8,
                            
                            selling : true,
                            sellingRate : 1.3,
                            
                            amount : 500
                        }
                    }
                }),
                
                2 : new Drift.Models.PortModel({
                    id : 2,
                    sectorId : 1,
                    resources : {
                        "Ore" : {
                            buying : true,
                            buyingRate : .8,
                            
                            selling : true,
                            sellingRate : 1.3,
                            
                            amount : 500
                        }
                    }
                })
            }
        }
    })
})(jQuery);