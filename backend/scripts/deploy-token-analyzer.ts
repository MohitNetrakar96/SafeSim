import { ethers, upgrades } from "hardhat";

async function main() {
    console.log("Deploying TokenAnalyzer with UUPS proxy...");

    // Get the contract factory
    const TokenAnalyzer = await ethers.getContractFactory("TokenAnalyzer");

    // Deploy as UUPS proxy
    const tokenAnalyzer = await upgrades.deployProxy(
        TokenAnalyzer,
        [],
        {
            kind: "uups",
            initializer: "initialize"
        }
    );

    await tokenAnalyzer.waitForDeployment();
    const proxyAddress = await tokenAnalyzer.getAddress();

    console.log("TokenAnalyzer Proxy deployed to:", proxyAddress);

    // Get implementation address
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation address:", implementationAddress);

    // Verify deployment
    console.log("\nVerifying deployment...");
    const owner = await (tokenAnalyzer as any).owner();
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
