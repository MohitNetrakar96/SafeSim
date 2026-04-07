import { ethers, upgrades } from "hardhat";

async function main() {
    console.log("Upgrading contracts...\n");

    // Load deployment info
    const fs = require("fs");
    const deploymentInfo = JSON.parse(fs.readFileSync("./deployment-info.json", "utf8"));

    const simulationHelperProxy = deploymentInfo.contracts.SimulationHelper.proxy;
    const tokenAnalyzerProxy = deploymentInfo.contracts.TokenAnalyzer.proxy;

    console.log("Current SimulationHelper Proxy:", simulationHelperProxy);
    console.log("Current TokenAnalyzer Proxy:", tokenAnalyzerProxy);

    // Upgrade SimulationHelper
    console.log("\n1. Upgrading SimulationHelper...");
    const SimulationHelperV2 = await ethers.getContractFactory("SimulationHelper");
    const upgradedSimHelper = await upgrades.upgradeProxy(
        simulationHelperProxy,
        SimulationHelperV2
    );
    await upgradedSimHelper.waitForDeployment();
    const newSimImpl = await upgrades.erc1967.getImplementationAddress(simulationHelperProxy);
    console.log("✅ New implementation:", newSimImpl);

    // Upgrade TokenAnalyzer
    console.log("\n2. Upgrading TokenAnalyzer...");
    const TokenAnalyzerV2 = await ethers.getContractFactory("TokenAnalyzer");
    const upgradedTokenAnalyzer = await upgrades.upgradeProxy(
        tokenAnalyzerProxy,
        TokenAnalyzerV2
    );
    await upgradedTokenAnalyzer.waitForDeployment();
    const newTokenImpl = await upgrades.erc1967.getImplementationAddress(tokenAnalyzerProxy);
    console.log("✅ New implementation:", newTokenImpl);

    // Update deployment info
    deploymentInfo.contracts.SimulationHelper.implementation = newSimImpl;
    deploymentInfo.contracts.TokenAnalyzer.implementation = newTokenImpl;
    deploymentInfo.lastUpgrade = new Date().toISOString();

    fs.writeFileSync(
        "./deployment-info.json",
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n" + "=".repeat(60));
    console.log("UPGRADE COMPLETE");
    console.log("=".repeat(60));
    console.log("\nNew SimulationHelper Implementation:", newSimImpl);
    console.log("New TokenAnalyzer Implementation:", newTokenImpl);
    console.log("\n📝 Deployment info updated");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
