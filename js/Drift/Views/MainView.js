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
                        "click [data-role=personnelTabBtn]" : "onPersonnelTabBtnClicked",
                        "click [data-role=sectorTabBtn]" : "onSectorTabBtnClicked",
                    },
                    
                    initialize : function(parameters) {
                        this.model = parameters.model;
                        this.ship = parameters.ship;
                        
                        this.views = {
                            StatsView : new Drift.Views.MainStatsView({ model : this.model, ship : this.ship }),
                            ResourcesContentPaneView : new Drift.Views.ResourcesContentPaneView({ model : this.model, ship : this.ship }),
                            ShipContentPaneView : new Drift.Views.ShipContentPaneView({ model : this.model, ship : this.ship }),
                            PersonnelContentPaneView : new Drift.Views.PersonnelContentPaneView({ model : this.model, ship : this.ship }),
                            SectorContentPaneView : new Drift.Views.SectorContentPaneView({ sector : new Drift.Models.SectorModel(), ship : this.ship }),
                            ChatPaneView : new Drift.Views.ChatPaneView(),
                        };
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-MainView-template").html() );
                        var html = template({ model : this.model.toJSON() });
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
                            
                            self.showSectorTab();
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
                    }
                })
            }
        }    
    });
})(jQuery);