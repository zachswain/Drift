/* global Backbone, jQuery, Drift */
(function($) {
    $.extend(true, window, {
        Drift : {
            Globals : {
                Resources : {
                    "Scrap" : {
                        pricePerUnit : 1  
                    },
                    "Ore" : {
                        pricePerUnit : 10
                    }
                },
                Direction : {
                    NorthWest : { x : -1, y : 0 },
                    North : { x : 0, y : -1 },
                    NorthEast : { x : 1, y : -1 },
                    SouthEast : { x : 1, y : 0 },
                    South : { x : 0, y : 1 },
                    SouthWest : { x : -1, y : 1 }
                }
            }
        }
    })
})(jQuery);