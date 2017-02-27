/* global Backbone, BigNumber, Drift, _, jQuery */
(function($) {
    $.extend(true, window, {
        Drift : {
            Views : {
                PortView : Backbone.View.extend({
                    className : "PortView",
                    
                    selectors : {
                        DockBtn : "[data-role=dockBtn]",
                        LaunchBtn : "[data-role=launchBtn]",
                        ResourcesTable : "[data-role=resourcesTable]",
                        ResourcesDiv : "[data-role=resourcesDiv]",
                    },
                    
                    events : {
                        "click [data-role=dockBtn]" : "onDockBtnClicked",
                        "click [data-role=launchBtn]" : "onLaunchBtnClicked",
                        "click button[data-role=buyOne]" : "onBuyOneBtnClicked",
                        "click button[data-role=buyAll]" : "onBuyAllBtnClicked",
                        "click button[data-role=sellOne]" : "onSellOneBtnClicked",
                        "click button[data-role=sellAll]" : "onSellAllBtnClicked"
                    },
                    
                    initialize : function(parameters) {
                        this.port = parameters.port;
                        var ship = Drift.getShip();
                        var player = Drift.getPlayer();
                        
                        this.listenTo(Drift, "orbit", this.onOrbit);
                        this.listenTo(Drift, "deorbit", this.onDeorbit);
                        this.listenTo(Drift, "dock", this.onDock);
                        this.listenTo(Drift, "launch", this.onLaunch);
                        this.listenTo(this.port, "change:resources", this.updateResources);
                        this.listenTo(ship, "change:resources", this.updateResources);
                        this.listenTo(player, "change:credits", this.updateResources);
                    },
                    
                    render : function() {
                        var template = _.template( $("#Drift-PortView-template").html() );
                        var player = Drift.getPlayer();
                        
                        var html = template({ 
                            port : this.port.toJSON(),
                            dockBtnDisabled : !player.canDock(this.port.getId()),
                            launchBtnDisabled : !player.canLaunch(this.port.getId())
                        });
                        
                        this.$el.html(html);
                        
                        var self=this;
                        setTimeout(function() {
                            self.updateView();
                        }, 0);
                    },
                    
                    updateView : function() {
                        var resources = this.port.getResources();
                        
                        this.updateDockButtons();
                        
                        var self=this;
                        
                        self.$el.find(self.selectors.ResourcesTable).find("tbody tr").remove();
                        
                        $.each(Object.keys(resources), function(index, resource) {
                            var tr = $("<tr></tr>")
                                .attr("data-type", resource)
                                .append(
                                    $("<td></td>")
                                        .attr("data-role", "type")
                                        .html(resource)
                                ).append(
                                    $("<td></td>")
                                        .attr("data-role", "units")
                                        .html(numeral(resources[resource].amount).format("0,0"))
                                );
                                
                            if( self.port.isSelling(resource) ) {
                                var buyPricePerUnit = numeral(Drift.Utils.calculatePricePerUnit(resource, resources[resource].sellingRate)).format("0,0");   
                                tr.append(
                                    $("<td></td>")
                                        .attr("data-role", "buyPricePerUnit")
                                        .html(
                                            buyPricePerUnit
                                        )
                                ).append(
                                    $("<td></td>")
                                        .append(
                                            $("<button></button>")
                                                .attr("data-role", "buyOne")
                                                .attr("data-resource", resource)
                                                .addClass("Button")
                                                .html("Buy 1")
                                        ).append(
                                            $("<button></button>")
                                                .attr("data-role", "buyAll")
                                                .attr("data-resource", resource)
                                                .addClass("Button")
                                                .html("Buy <span data-role='units'>X</span>")
                                        )
                                )
                            } else {
                                tr.append( $("<td>-</td>") );
                                tr.append( $("<td></td>") );
                            }
                            
                            if( self.port.isBuying(resource) ) {
                                var sellPricePerUnit = numeral(Drift.Utils.calculatePricePerUnit(resource, resources[resource].buyingRate)).format("0,0");
                                tr.append(
                                    $("<td></td>")
                                        .attr("data-role", "sellPricePerUnit")
                                        .html(
                                            sellPricePerUnit
                                        )
                                ).append(
                                    $("<td></td>")
                                        .append(
                                            $("<button></button>")
                                                .attr("data-role", "sellOne")
                                                .attr("data-resource", resource)
                                                .addClass("Button")
                                                .html("Sell 1")
                                        ).append(
                                            $("<button></button>")
                                                .attr("data-role", "sellAll")
                                                .attr("data-resource", resource)
                                                .addClass("Button")
                                                .html("Sell <span data-role='units'>X</span>")
                                        )
                                );
                            } else {
                                tr.append( $("<td>-</td>") );
                                tr.append( $("<td></td>") );
                            }
                            
                            self.$el.find(self.selectors.ResourcesTable).append(tr);
                        });
                        
                        this.updateResources();
                    },
                    
                    updateResources : function() {
                        var resources = this.port.getResources();
                        
                        var self=this;
                        
                        $.each(Object.keys(resources), function(index, resource) {
                            self.updateResource(resource);
                        });
                    },
                    
                    updateResource : function(resource) {
                        var ship = Drift.getShip();
                        var player = Drift.getPlayer();
                        var unoccupiedHolds = ship.getUnoccupiedCargoHolds();
                        var resources = this.port.getResources();
                        var amount = resources[resource].amount;
                        var resourceOnShip = ship.getWholeNumberResource(resource);
                        
                        var sellingPricePerUnit = Drift.Utils.calculatePricePerUnit(resource, resources[resource].sellingRate);
                        var credits = player.getCredits(); 
                        var numCanAfford = Math.floor(credits / sellingPricePerUnit);
                        var numCanBuy = unoccupiedHolds > numCanAfford ? numCanAfford : unoccupiedHolds;
                        
                        var self=this;
                        
                        self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=units]").html(amount);
                        self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=buyAll] [data-role=units]").html(numCanBuy);
                        self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=sellAll] [data-role=units]").html(resourceOnShip);
                        
                        if( numCanBuy==0 ) {
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=buyAll]").attr("disabled", "disabled").addClass("Disabled");
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=buyOne]").attr("disabled", "disabled").addClass("Disabled");                            
                        } else {
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=buyAll]").removeAttr("disabled").removeClass("Disabled");
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=buyOne]").removeAttr("disabled").removeClass("Disabled");
                        }
                        
                        if( resourceOnShip==0 ) {
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=sellAll]").attr("disabled", "disabled").addClass("Disabled");
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=sellOne]").attr("disabled", "disabled").addClass("Disabled");
                        } else {
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=sellAll]").removeAttr("disabled").removeClass("Disabled");
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=sellOne]").removeAttr("disabled").removeClass("Disabled");
                        }
                    },
                    
                    updateCargoHolds : function() {
                        var ship = Drift.getShip();
                        var unoccupiedHolds = ship.getUnoccupiedCargoHolds();
                        var resources = this.port.getResources();
                        var self=this;
                        
                        console.log(unoccupiedHolds);
                        
                        $.each(Object.keys(resources), function(index, resource) {
                            self.$el.find("[data-role=resourcesTable] tr[data-type=" + resource + "] [data-role=buyAll] [data-role=freeHolds]").html(unoccupiedHolds);
                        });
                    },
                    
                    onOrbit : function() {
                        this.updateDockButtons();
                    },
                    
                    onDeorbit : function() {
                        this.updateDockButtons();
                    },
                    
                    onDock : function() {
                        this.updateDockButtons();
                        
                        var player = Drift.getPlayer();
                        
                        if( player.isDockedInPort(this.port.getId()) ) {
                            this.$el.find(this.selectors.ResourcesDiv).show();
                        } else {
                            this.$el.hide();
                        }
                    },
                    
                    onLaunch : function() {
                        this.updateDockButtons();  
                        
                        this.$el.find(this.selectors.ResourcesDiv).hide();
                        this.$el.show();
                    },
                    
                    updateDockButtons : function() {
                        var player = Drift.getPlayer();
                        if( player.isDockedInPort() || player.isOrbitingPlanet() ) {
                            this.disableDockBtn();
                        } else if( !player.inSector(this.port.getSectorId()) ) {
                            this.disableDockBtn();
                        } else {
                            this.enableDockBtn();
                        }
                        
                        if( !player.isDockedInPort() || (player.isDockedInPort() && !player.isDockedInPort(this.port.getId())) ) {
                            this.disableLaunchBtn();
                        } else if( !player.inSector(this.port.getSectorId()) ) {
                            this.disableLaunchBtn();
                        } else {
                            this.enableLaunchBtn();
                        }
                    },
                    
                    disableDockBtn : function() {
                        this.$el.find(this.selectors.DockBtn).attr("disabled", "disabled").addClass("Disabled");
                    },
                    
                    enableDockBtn : function() {
                        this.$el.find(this.selectors.DockBtn).removeAttr("disabled").removeClass("Disabled");
                    },
                    
                    disableLaunchBtn : function() {
                        this.$el.find(this.selectors.LaunchBtn).attr("disabled", "disabled").addClass("Disabled");
                    },
                    
                    enableLaunchBtn : function() {
                        this.$el.find(this.selectors.LaunchBtn).removeAttr("disabled").removeClass("Disabled");
                    },
                    
                    onDockBtnClicked : function(e) {
                        e.preventDefault();
                        Drift.dock(this.port.getId());
                    },
                    
                    onLaunchBtnClicked : function(e) {
                        e.preventDefault();
                        Drift.launch(this.port.getId());
                    },
                    
                    onBuyOneBtnClicked : function(e) {
                        e.preventDefault();
                        
                        var resource = $(e.currentTarget).attr("data-resource");
                        this.buyResources(resource, 1);
                    },
                    
                    onBuyAllBtnClicked : function(e) {
                        e.preventDefault();

                        var resource = $(e.currentTarget).attr("data-resource");
                        this.buyResources(resource);
                    },
                    
                    onSellOneBtnClicked : function(e) {
                        e.preventDefault();
                        
                        var resource = $(e.currentTarget).attr("data-resource");
                        this.sellResources(resource, 1);
                    },
                    
                    onSellAllBtnClicked : function(e) {
                        e.preventDefault();

                        var resource = $(e.currentTarget).attr("data-resource");
                        this.sellResources(resource);
                    },
                    
                    buyResources : function(resource, amount) {
                        if( !this.port.isSelling(resource) ) {
                            console.log(this);
                            console.log("not selling");
                            return;
                        }
                        if( undefined!=amount && amount<=0 ) {
                            console.log("amount < 0");
                            return;
                        }

                        var ship = Drift.getShip();
                        var unoccupiedHolds = ship.getUnoccupiedCargoHolds();
                        var resources = this.port.getResources();
                        var pricePerUnit = Drift.Utils.calculatePricePerUnit(resource, resources[resource].sellingRate);
                        var player = Drift.getPlayer();
                        var credits = player.getCredits(); 
                        var numCanAfford = Math.floor(credits / pricePerUnit);
                        var numCanBuy = unoccupiedHolds > numCanAfford ? numCanAfford : unoccupiedHolds;
                        
                        if( undefined==amount ) amount=numCanBuy;
                        
                        if( numCanAfford>=amount) {
                            if( unoccupiedHolds>0 ) {
                                if( this.port.removeResources(resource, amount) ) {
                                    if( ship.addResources(resource, amount) ) {
                                        var totalCost = new BigNumber(pricePerUnit).times(amount).toNumber();
                                        var spent = player.removeCredits(totalCost);
                                        
                                        if( new BigNumber(spent).equals(totalCost) ) {
                                            this.port.addCredits(totalCost);
                                        } else {
                                            console.log("amount mismatch!");
                                            console.log(spent);
                                            console.log(totalCost);
                                        }
                                    } else {
                                        console.log("failed, adding back");
                                        this.port.addResources(resource, amount);
                                    }
                                }
                            }
                        }
                    },
                    
                    sellResources : function(resource, amount) {
                        if( !this.port.isBuying(resource) ) {
                            console.log("not buying");
                            return;
                        }
                        if( undefined!=amount && amount<=0 ) {
                            console.log("amount < 0");
                            return;
                        }
                        
                        var ship = Drift.getShip();
                        
                        if( undefined==amount ) {
                            amount = ship.getWholeNumberResource(resource);
                            
                            if( amount==0 ) {
                                console.log("ship has 0 " + resource);
                                return;
                            }
                        }
                        
                        if( !ship.hasResources(resource, amount) ) {
                            console.log("ship doesn't have that many resources");
                            return;
                        }
                        
                        var resources = this.port.getResources();
                        var pricePerUnit = Drift.Utils.calculatePricePerUnit(resource, resources[resource].buyingRate);
                        var player = Drift.getPlayer();
                        var numCanSell = amount; // this might change in the future

                        if( undefined==amount ) amount=numCanSell;
                        
                        if( ship.removeResources(resource, amount) ) {
                            if( this.port.addResources(resource, amount) ) {
                                var totalCost = new BigNumber(pricePerUnit).times(amount).toNumber();
                                var gained = player.addCredits(totalCost);
                                
                                if( new BigNumber(gained).equals(totalCost) ) {
                                    this.port.addCredits(totalCost);
                                } else {
                                    console.log("amount mismatch!");
                                    console.log(gained);
                                    console.log(totalCost);
                                }
                            } else {
                                console.log("failed, adding back");
                                ship.addResources(resource, amount);
                            }
                        }
                    }
                })
            }
        }    
    });
})(jQuery);