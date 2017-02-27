/* globals _, Backbone, Drift, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Server : {
                initialize : function() {
                    this.model = new Backbone.Model({
                        ticks : 0
                    });
                    _.extend(this, Backbone.Events);
                    
                    this.listenTo(this.model, "change:ticks", this.onTicksChange);
                },
                
                run : function() {
                    this.startTick();
                },
                
                startTick : function() {
                    this.tick();
                },
                
                tick : function() {
                    var self=this;
                    
                    var ticks = self.model.get("ticks");
                    ticks++;
                    this.model.set({
                        ticks : ticks
                    });
    
                    this.intervalId = setTimeout(function() {
                        self.tick();
                    }, 1000);
                },
                
                onTicksChange : function() {
                    var ticks = this.model.get("ticks");
                    this.trigger("change:ticks", ticks);
                },
               
                getPlayer : function() {
                    var promise = $.Deferred();
                   
                    var player = {
                        name : "Spaceman Spiff",
                        sectorId : "0",
                        portId : null,
                        planetId : null,
                        credits : 100
                    };
                    
                    promise.resolve(player);
                   
                   return promise.promise();
               }
           }
       } 
    });
})(jQuery);