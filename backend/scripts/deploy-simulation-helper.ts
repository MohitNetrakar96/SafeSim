import { ethers, upgrades } from "hardhat";

async function main() {
    console.log("Deploying SimulationHelper with UUPS proxy...");

    // Get the contract factory
    const SimulationHelper = await ethers.getContractFactory("SimulationHelper");

    // Deploy as UUPS proxy
    const simulationHelper = await upgrades.deployProxy(
        SimulationHelper,
        [],
        {
            kind: "uups",
            initializer: "initialize"
        }
    );

    await simulationHelper.waitForDeployment();
    const proxyAddress = await simulationHelper.getAddress();

    console.log("SimulationHelper Proxy deployed to:", proxyAddress);

    // Get implementation address
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation address:", implementationAddress);

    // Verify deployment
    console.log("\nVerifying deployment...");
    const owner = await (simulationHelper as any).owner();
    console.log("Contract owner:", owner);

    return {
        proxy: proxyAddress,
        implementation: implementationAddress
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
