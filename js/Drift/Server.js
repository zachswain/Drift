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
                    
                    this.player = new Drift.Models.PlayerModel();
                    this.player.set({
                        name : "Spaceman Spiff",
                        sectorId : "0",
                        portId : null,
                        planetId : null,
                        sectors : {},
                        credits : 100
                    });
                    
                    this.sector = Drift.Sectors["0"];
                    
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
                   
                    promise.resolve(this.player.toJSON());
                   
                   return promise.promise();
               },
               
               getSectorByXY : function(coords) {
                   var promise = $.Deferred();
                   var found = false;
                   
                   $.each(Drift.Sectors, function(index, sector) {
                       if( sector.isX(coords.x) && sector.isY(coords.y) ) {
                           promise.resolve(sector);
                           found = true;
                       }
                   });

                   if( !found ) {
                       promise.reject();
                   }
                   
                   return promise.promise();
               },
               
                setSector : function(sectorId) {
                    var promise = $.Deferred();
                    
                    var rightNow = new Date().getTime();
                    
                    var sectors = this.player.getSectors();
                   
                    if( sectors[sectorId]===undefined ) {
                        var sector = Drift.Sectors[sectorId]; // bad, should be a new/copied object
                        sector.set({
                            firstVisitedOn : rightNow
                        });
                        sectors[sectorId] = sector;
                    }
                    
                    sectors[sectorId].set({
                        lastVisitedOn : rightNow
                    });
                    
                    this.player.set({
                        sectorId : sectorId
                    });
                    
                    this.sector = Drift.Sectors[sectorId];
                   
                    promise.resolve(this.sector.toJSON());
                    return promise.promise();
               },
               
                getCurrentSector : function() {
                    return this.sector;     
                },
                
                setCurrentSector : function(sector) {
                    this.sector = sector;    
                },
               
                moveToSector : function(sectorId) {
                   var promise = $.Deferred();
                    
                    var rightNow = new Date().getTime();
                    
                    var sectors = this.player.getSectors();
                    
                    // check if they can move
                    if( !this.player.canMoveTo(sectorId) ) {
                        
                    }
                    
                    // move
                    if( sectors[sectorId]===undefined ) {
                        var sector = Drift.Sectors[sectorId]; // bad, should be a new/copied object
                        sector.set({
                            firstVisitedOn : rightNow
                        });
                        sectors[sectorId] = sector;
                    }
                    
                    var sector = sectors[sectorId];
                    
                    sector.set({
                        lastVisitedOn : rightNow
                    });
                    
                    this.setCurrentSector(Drift.Sectors[sectorId]);
                   
                    promise.resolve(sector.toJSON());
                   
                    // trigger a move
                    console.log("triggering move:sector");
                    this.trigger("move:sector", sector);
                    
                    // return
                    return promise.promise();
               }
           }
       } 
    });
})(jQuery);