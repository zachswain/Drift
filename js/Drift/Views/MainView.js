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
                        "click [data-role=mapTabBtn]" : "onMapTabBtnClicked",
                    },
                    
                    initialize : function(parameters) {

                        this.views = {
                            StatsView : new Drift.Views.MainStatsView(),
                            ResourcesContentPaneView : new Drift.Views.ResourcesContentPaneView(),
                            ShipContentPaneView : new Drift.Views.ShipContentPaneView(),
                            PersonnelContentPaneView : new Drift.Views.PersonnelContentPaneView(),
                            MapContentPaneView : new Drift.Views.MapContentPaneView(),
                            ChatPaneView : new Drift.Views.ChatPaneView(),
                        };
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
                            
                            self.views.MapContentPaneView.render();
                            self.$el.find("[data-role=mainViewTabContent]").append(self.views.MapContentPaneView.$el);
                            
                            self.views.ChatPaneView.render();
                            self.$el.find("[data-role=chatViewContainer]").append(self.views.ChatPaneView.$el);
                            
                            self.showMapTab();
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
                    
                    showMapTab : function() {
                        this.views.MapContentPaneView.$el.show().siblings().hide();
                        this.$el.find("[data-role=mapTabBtn]").parent().addClass("Active").siblings().removeClass("Active");
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
                    
                    onMapTabBtnClicked : function(e) {
                        e.preventDefault();
                        this.showMapTab();
                    }
                })
            }
        }    
    });
})(jQuery);