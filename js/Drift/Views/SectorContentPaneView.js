/* global Backbone, Drift, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                SectorContentPaneView : Backbone.View.extend({
                    className : "SectorContentPane ContentPane",
                    
                    events : {
                        "click [data-role=portsTabBtn]" : "onPortsTabBtnClicked",
                        "click [data-role=planetsTabBtn]" : "onPlanetsTabBtnClicked"
                    },
                    
                    initialize : function(parameters) {
                        this.sector = Drift.getSector();

                        this.views = {
                            PortsContentPaneView : new Drift.Views.PortsContentPaneView(),
                            PlanetsContentPaneView : new Drift.Views.PlanetsContentPaneView(),
                            SectorMapView : new Drift.Views.SectorMapView({
                                sectors : [ ]
                            })
                        };
                        
                        this.listenTo(Drift, "change:sector", this.onSectorChange);
                        this.listenTo(this.views.SectorMapView, "doubletap:sector", this.onSectorDoubleTapped)
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-SectorContentPaneView-template").html() );
                        var html = template({ sector : this.sector.toJSON() });
                        this.$el.html(html);
                        
                        var self=this;
                        
                        setTimeout(function() {
                            self.views.PortsContentPaneView.render();
                            self.$el.find("[data-role=sectorLocationTabContent]").append(self.views.PortsContentPaneView.$el)
                            
                            self.views.PlanetsContentPaneView.render();
                            self.$el.find("[data-role=sectorLocationTabContent]").append(self.views.PlanetsContentPaneView.$el);
                            
                            self.views.SectorMapView.render();
                            self.$el.find("[data-role=sectorMapContainer]").append(self.views.SectorMapView.$el);
                            
                            self.showPortsTab();
                        }, 0);
                    },
                    
                    onSectorDoubleTapped : function(sectorId) {
                        console.log("moving to " + sectorId);
                        
                        Drift.moveToSector(sectorId);
                    },
                    
                    onSectorChange : function(sector) {
                        this.sector = sector;
                        this.updateView();
                    },
                    
                    onPortsTabBtnClicked : function(e) {
                        e.preventDefault();
                        this.showPortsTab();
                    },
                    
                    onPlanetsTabBtnClicked : function(e) {
                        e.preventDefault();  
                        this.showPlanetsTab();
                    },
                    
                    showPortsTab : function() {
                        this.views.PortsContentPaneView.$el.show().siblings().hide();
                        this.$el.find("[data-role=portsTabBtn]").parent().addClass("Active").siblings().removeClass("Active");
                    },
                    
                    showPlanetsTab : function() {
                        this.views.PlanetsContentPaneView.$el.show().siblings().hide();
                        this.$el.find("[data-role=planetsTabBtn]").parent().addClass("Active").siblings().removeClass("Active");
                    },
                    
                    updateView : function() {
                        this.$el.find("[data-role=sectorIdSpan]").html(this.sector.get("id"));
                    }
                })
            }
        }    
    });
})(jQuery);