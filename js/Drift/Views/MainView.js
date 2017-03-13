/* global Drift, Backbone, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                MainView : Backbone.View.extend({
                    className : "MainView",
                    
                    events : {
                        "click [data-role=resourcesTabBtn]" : "onResourcesTabBtnClicked",
                        "click [data-role=shipTabBtn]" : "onShipTabBtnClicked",
                        "click [data-role=personnelTabBtn]" : "onPersonnƒelTabBtnClicked",
                        "click [data-role=sectorTabBtn]" : "onSectorTabBtnClicked",
                    },
                    
                    initialize : function(parameters) {
                        var self=this;
                        
                        self.views = {
                            StatsView : new Drift.Views.MainStatsView(),
                            ResourcesContentPaneView : new Drift.Views.ResourcesContentPaneView(),
                            ShipContentPaneView : new Drift.Views.ShipContentPaneView(),
                            PersonnelContentPaneView : new Drift.Views.PersonnelContentPaneView(),
                            MapView : new Drift.Views.MapView({
                                sectors : [  ]
                            }),
                            SectorContentPaneView : new Drift.Views.SectorContentPaneView(),
                            ChatPaneView : new Drift.Views.ChatPaneView(),
                        };
                        
                        this.listenTo(this.views.MapView, "tap:sector", this.onSectorTapped);
                        this.listenTo(this.views.MapView, "doubletap:sector", this.onSectorDoubleTapped);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-MainView-template").html() );
                        var html = template();
                        this.$el.html(html);
                        
                        var self=this;
                        
                        setTimeout(function() {
                            self.views.StatsView.render();
                            self.$el.find("[data-role=statsViewContainer]").append(self.views.StatsView.$el);
                            
                            self.views.ResourcesContentPaneView.render();
                            self.$el.find("[data-role=mainViewTabContent]").append(self.views.ResourcesContentPaneView.$el);
                            
                            self.views.ShipContentPaneView.render();
                            self.$el.find("[data-role=mainViewTabContent]").append(self.views.ShipContentPaneView.$el);
                            
                            self.views.PersonnelContentPaneView.render();
                            self.$el.find("[data-role=mainViewTabContent]").append(self.views.PersonnelContentPaneView.$el);
                            
                            self.views.SectorContentPaneView.render();
                            self.$el.find("[data-role=mainViewTabContent]").append(self.views.SectorContentPaneView.$el);
                            
                            self.views.ChatPaneView.render();
                            self.$el.find("[data-role=chatViewContainer]").append(self.views.ChatPaneView.$el);
                            
                            self.views.MapView.render();
                            self.$el.find("[data-role=mapViewContainer]").append(self.views.MapView.$el);
                            
                            self.showShipTab();
                        }, 0);
                    },
                    
                    showResourcesTab : function() {
                        this.views.ResourcesContentPaneView.$el.show().siblings().hide();
                        this.$el.find("[data-role=resourcesTabBtn]").parent().addClass("Active").siblings().removeClass("Active");
                    },
                    
                    showShipTab : function() {
                        this.views.ShipContentPaneView.$el.show().siblings().hide();
                        this.$el.find("[data-role=shipTabBtn]").parent().addClass("Active").siblings().removeClass("Active");
                    },
                    
                    showPersonnelTab : function() {
                        this.views.PersonnelContentPaneView.$el.show().siblings().hide();
                        this.$el.find("[data-role=personnelTabBtn]").parent().addClass("Active").siblings().removeClass("Active");
                    },
                    
                    showSectorTab : function() {
                        this.views.SectorContentPaneView.$el.show().siblings().hide();
                        this.$el.find("[data-role=sectorTabBtn]").parent().addClass("Active").siblings().removeClass("Active");
                    },
                    
                    onResourcesTabBtnClicked : function(e) {
                        e.preventDefault();
                        this.showResourcesTab();
                    },
                    
                    onShipTabBtnClicked : function(e) {
                        e.preventDefault();
                        this.showShipTab();
                    },
                    
                    onPersonnelTabBtnClicked : function(e) {
                        e.preventDefault();
                        this.showPersonnelTab();
                    },
                    
                    onSectorTabBtnClicked : function(e) {
                        e.preventDefault();
                        this.showSectorTab();
                    },
                    
                    onSectorTapped : function(sectorId) {
                        this.showSectorTab();
                        this.views.SectorContentPaneView.showSector(sectorId);
                    },
                    
                    onSectorDoubleTapped : function(sectorId) {
                        console.log("doubletap " + sectorId);
                        Drift.moveToSector(sectorId);
                    }
                })
            }
        }    
    });
})(jQuery);