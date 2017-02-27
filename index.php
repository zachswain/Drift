<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?><!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
<link href="css/reset.css" rel="stylesheet"></link>
<link href="css/Drift-web.css" rel="stylesheet"></link>
<script src="node_modules/jquery/dist/jquery.min.js" type="text/javascript"></script>
<script src="node_modules/backbone/node_modules/underscore/underscore-min.js" type="text/javascript"></script>
<script src="node_modules/backbone/backbone-min.js" type="text/javascript"></script>
<script src="node_modules/numeral/numeral.js" type="text/javascript"></script>
<script src="node_modules/bignumber.js/bignumber.min.js" type="text/javascript"></script>
<script src="node_modules/jquery.panzoom/dist/jquery.panzoom.min.js" type="text/javascript"></script>
<script src="node_modules/hammerjs/hammer.min.js" type="text/javascript"></script>

<script src="js/Drift/Models/DriftModel.js" type="text/javascript"></script>
<script src="js/Drift/Models/PlayerModel.js" type="text/javascript"></script>
<script src="js/Drift/Models/ShipModel.js" type="text/javascript"></script>
<script src="js/Drift/Models/ModuleModel.js" type="text/javascript"></script>
<script src="js/Drift/Models/SectorModel.js" type="text/javascript"></script>
<script src="js/Drift/Models/PortModel.js" type="text/javascript"></script>
<script src="js/Drift/Models/PlanetModel.js" type="text/javascript"></script>
<script src="js/Drift/Resources.js" type="text/javascript"></script>
<script src="js/Drift/Bots.js" type="text/javascript"></script>
<script src="js/Drift/Modules.js" type="text/javascript"></script>
<script src="js/Drift/ShipModules.js" type="text/javascript"></script>
<script src="js/Drift/Sectors.js" type="text/javascript"></script>
<script src="js/Drift/Ports.js" type="text/javascript"></script>
<script src="js/Drift/Planets.js" type="text/javascript"></script>
<script src="js/Drift/Globals.js" type="text/javascript"></script>
<script src="js/Drift/Utils.js" type="text/javascript"></script>
<script src="js/Drift/Server.js" type="text/javascript"></script>
<script src="js/Drift/Views/MainStatsView.js" type="text/javascript"></script>
<script src="js/Drift/Views/ResourcesContentPaneView.js" type="text/javascript"></script>
<script src="js/Drift/Views/ShipContentPaneView.js" type="text/javascript"></script>
<script src="js/Drift/Views/PersonnelContentPaneView.js" type="text/javascript"></script>
<script src="js/Drift/Views/SectorContentPaneView.js" type="text/javascript"></script>
<script src="js/Drift/Views/PortsContentPaneView.js" type="text/javascript"></script>
<script src="js/Drift/Views/PlanetsContentPaneView.js" type="text/javascript"></script>
<script src="js/Drift/Views/SectorMapView.js" type="text/javascript"></script>
<script src="js/Drift/Views/MapContentPaneView.js" type="text/javascript"></script>
<script src="js/Drift/Views/MapView.js" type="text/javascript"></script>
<script src="js/Drift/Views/SectorTileView.js" type="text/javascript"></script>
<script src="js/Drift/Views/PortView.js" type="text/javascript"></script>
<script src="js/Drift/Views/PlanetView.js" type="text/javascript"></script>
<script src="js/Drift/Views/MainView.js" type="text/javascript"></script>
<script src="js/Drift/Views/ChatPaneView.js" type="text/javascript"></script>

<script src="js/Drift.js" type="text/javascript"></script>

<script type="text/template" id="Drift-MainView-template">
    <div class="StatsViewContainer" data-role="statsViewContainer"></div>
    <div class="MainViewContentContainer">
        <div class="MainViewTabBar">
            <ul class="MainViewTabBarList">
            <li class="Tab"><button class="Button" data-role="resourcesTabBtn">R</button></li>
            <li class="Tab"><button class="Button" data-role="shipTabBtn">Sh</button></li>
            <li class="Tab"><button class="Button" data-role="personnelTabBtn">P</button></li>
            <li class="Tab"><button class="Button" data-role="mapTabBtn">M</button></li>
            </ul>
        </div>
        <div class="MainViewTabContent" data-role="mainViewTabContent">
        </div>
    </div>
    <div class="ChatViewContainer" data-role="chatViewContainer"></div>
</script>

<script type="text/template" id="Drift-MainStatsView-template">
    <table>
        <tr>
            <td>
            S: <span data-role="scrapSpan"></span>
            </td>
            <td>
            O: <span data-role="oreSpan">0</span>
            </td>
        </tr>
        <tr>
            <td>
            Credits: <span data-role="creditsSpan"></span>
            </td>
        </tr>
        <tr>
            <td>
            CH: <span data-role="occupiedCargoHoldsSpan">0</span>/<span data-role="totalCargoHoldsSpan">0</span>
            </td>
        </tr>
        <tr>
            <td>
            T: <span data-role="ticksSpan"></span>
            </td>
        </tr>
    </table>
</script>

<script type="text/template" id="Drift-ResourcesContentPaneView-template">
    <button class="Button CollectScrapButton" data-role="scrapBtn">Scrap</button>
</script>

<script type="text/template" id="Drift-ShipContentPaneView-template">
    <div>
    Name: <span data-role="shipNameSpan"><%= ship.name %></span>
    </div>
    <div>
    Modules: <span data-role="occupiedModulesSpan"><%= ship.modules.length %></span>/<span data-role="maxModulesSpan"><%= ship.maxModules %></span>
    </div>
    <div>
        <u>Modules</u>
        <ul class="ModulesList" data-role="modulesList">
        </ul>
    </div>
</script>

<script type="text/template" id="Drift-SectorContentPaneView-template">
    <div>
    Sector: <span data-role="sectorIdSpan"><%= sector.id %></span>
    </div>
    <div class="SectorLocationTabBar">
        <ul class="SectorLocationList">
        <li class="Tab"><button class="Button" data-role="portsTabBtn">Ports</button></li>
        <li class="Tab"><button class="Button" data-role="planetsTabBtn">Planets</button></li>
        </ul>
    </div>
    <div class="SectorContentPaneTabContent" data-role="sectorLocationTabContent">
    </div>
    <div class="SectorMapContainer" data-role="sectorMapContainer">
    </div>
</script>

<script type="text/template" id="Drift-MapContentPaneView-template">
    <div class="MapContainer" data-role='mapContainer'>
    </div>
</script>

<script type="text/template" id="Drift-PortsContentPaneView-template">
    Ports
    <ul data-role="portsList">
    </ul>
</script>

<script type="text/template" id="Drift-PlanetsContentPaneView-template">
    Planets
    <ul data-role="planetsList">
    </ul>
</script>

<script type="text/template" id="Drift-PortView-template">
    <div>
    Port: <span data-role="portIdSpan"><%= port.id %></span>
    </div>
    <div>
        <button class="Button" data-role="dockBtn" <%= (dockBtnDisabled ? "disabled" : "") %>>Dock</button>
        <button class="Button" data-role="launchBtn" <%= (launchBtnDisabled ? "disabled" : "") %>>Launch</button>
    </div>
    <div data-role='informationDiv' class='Hidden'>
    Information
    </div>
    <div data-role='resourcesDiv' class='Hidden'>
        <u>Resources</u>
        <table class="ResourcesTable" data-role="resourcesTable">
            <thead>
                <tr>
                    <th>Resource</th>
                    <th>Units</th>
                    <th>Buy Price</th>
                    <th></th>
                    <th>Sell Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</script>

<script type="text/template" id="Drift-PlanetView-template">
    <div>
    Planet: <span data-role="planetIdSpan"><%= planet.id %></span>
    </div>
    <div>
        <button class="Button" data-role="orbitBtn" <%= (orbitBtnDisabled ? "disabled" : "") %>>Orbit</button>
        <button class="Button" data-role="deorbitBtn" <%= (deorbitBtnDisabled ? "disabled" : "") %>>Deorbit</button>
    </div>
    <div data-role='resourcesDiv' class='Hidden'>
        <div>
            <u>Resources</u>
            <table class="ResourcesTable" data-role="resourcesTable">
                <thead>
                    <tr>
                        <th>Resource</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            </ul>
        </div>
    </div>
    <div data-role='actionsDiv' class='Hidden'>
        <div>
            <u>Deploy</u>
            <ul>
                <li>
                    <button class="Button Disabled" data-role='unassignAllBtn' data-type='<%= Drift.Bots.PlanetaryMiners %>' disabled>- All</button>
                    <button class="Button Disabled" data-role='unassignBtn' data-type='<%= Drift.Bots.PlanetaryMiners %>' disabled>-</button>
                    Planetary Miner (<span data-role="deployedBotsSpan" data-type='<%= Drift.Bots.PlanetaryMiners %>'><%= ship.deployedBots[Drift.Bots.PlanetaryMiners] %></span>/<span data-role="totalBotsSpan" data-type='<%= Drift.Bots.PlanetaryMiners %>'><%= ship.bots[Drift.Bots.PlanetaryMiners] %></span>)
                    <button class="Button Disabled" data-role='assignBtn' data-type='<%= Drift.Bots.PlanetaryMiners %>' disabled>+</button>
                    <button class="Button Disabled" data-role='assignAllBtn' data-type='<%= Drift.Bots.PlanetaryMiners %>' disabled>+ All</button>
                </li>
            </ul>
        </div>
        
    </div>
</script>

<script type="text/template" id="Drift-PersonnelContentPaneView-template">
    <div>
        <button class="Button" data-role="buildBotBtn" disabled>+1 Bot (-10 Scrap)</button>
    </div>
    <div>
    Unassigned Bots: <span data-role="unassignedBotsSpan"><%= ship.bots[Drift.Bots.Unassigned] %></span>
    </div>
    
    <div>
        <div>Gatherers</div>
        <ul>
            <li>
                <button class="Button Disabled" data-role='unassignBotBtn' data-type='<%= Drift.Bots.ScrapCollectors %>' disabled>-</button>
                Scrap Collector (<span data-role='scrapCollectorBotsSpan'><%= ship.bots[Drift.Bots.ScrapCollectors] %></span>)
                <button class="Button Disabled" data-role='assignBotBtn' data-type='<%= Drift.Bots.ScrapCollectors %>' disabled>+</button>
            </li>
            <li>
                <button class="Button Disabled" data-role='unassignBotBtn' data-type='<%= Drift.Bots.PlanetaryMiners %>' disabled>-</button>
                Planetary Miner (<span data-role='planetaryMinersBotsSpan'><%= ship.bots[Drift.Bots.PlanetaryMiners] %></span>)
                <button class="Button Disabled" data-role='assignBotBtn' data-type='<%= Drift.Bots.PlanetaryMiners %>' disabled>+</button>
            </li>
        </ul>
    </div>
    
    <div>
        Total: <span data-role="totalBotsSpan"></span>/<span data-role="maxBotsSpan"></span>
    </div>
</script>

<script type="text/template" id="Drift-SectorTileView-template">
    
</script>

<script type="text/template" id="Drift-ChatPaneView-template">
    <div data-role="Log">
    </div>
</script>

<script>
/* global $, Drift */
$(document).ready(function() {
    Drift.initialize();
    Drift.run();
});
</script>
</head>
<body>
</body>
</html>