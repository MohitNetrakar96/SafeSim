import { ethers, upgrades } from "hardhat";

async function main() {
    console.log("Deploying all contracts with UUPS proxies...\n");

    // Deploy SimulationHelper
    console.log("1. Deploying SimulationHelper...");
    const SimulationHelper = await ethers.getContractFactory("SimulationHelper");
    const simulationHelper = await upgrades.deployProxy(
        SimulationHelper,
        [],
        { kind: "uups", initializer: "initialize" }
    );
    await simulationHelper.waitForDeployment();
    const simProxyAddress = await simulationHelper.getAddress();
    const simImplAddress = await upgrades.erc1967.getImplementationAddress(simProxyAddress);

    console.log("✅ SimulationHelper Proxy:", simProxyAddress);
    console.log("   Implementation:", simImplAddress);

    // Deploy TokenAnalyzer
    console.log("\n2. Deploying TokenAnalyzer...");
    const TokenAnalyzer = await ethers.getContractFactory("TokenAnalyzer");
    const tokenAnalyzer = await upgrades.deployProxy(
        TokenAnalyzer,
        [],
        { kind: "uups", initializer: "initialize" }
    );
    await tokenAnalyzer.waitForDeployment();
    const tokenProxyAddress = await tokenAnalyzer.getAddress();
    const tokenImplAddress = await upgrades.erc1967.getImplementationAddress(tokenProxyAddress);

    console.log("✅ TokenAnalyzer Proxy:", tokenProxyAddress);
    console.log("   Implementation:", tokenImplAddress);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("\nSimulationHelper:");
    console.log("  Proxy:", simProxyAddress);
    console.log("  Implementation:", simImplAddress);
    console.log("\nTokenAnalyzer:");
    console.log("  Proxy:", tokenProxyAddress);
    console.log("  Implementation:", tokenImplAddress);
    console.log("\n" + "=".repeat(60));

    // Save addresses to file
    const fs = require("fs");
    const deploymentInfo = {
        network: (await ethers.provider.getNetwork()).name,
        chainId: (await ethers.provider.getNetwork()).chainId,
        timestamp: new Date().toISOString(),
        contracts: {
            SimulationHelper: {
                proxy: simProxyAddress,
                implementation: simImplAddress
            },
            TokenAnalyzer: {
                proxy: tokenProxyAddress,
                implementation: tokenImplAddress
            }
        }
    };

    fs.writeFileSync(
        "./deployment-info.json",
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n📝 Deployment info saved to deployment-info.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
