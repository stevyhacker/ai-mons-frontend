// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, run } from 'hardhat';
import { delay } from '@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService';

async function main() {
    const Contract = await ethers.getContractFactory("AICreations");

    const contract = await Contract.deploy([
        "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
        false,
        "0x400Fc9C7F01Df3aa919659De434E0c584e68CB29",
        500,
        1000000000,
        ethers.utils.parseEther("0"),
    ]);

    await contract.deployed();

    await delay(15000);

    console.log("AICreations deployed to:", contract.address);

    await run('verify:verify', {
        address: contract.address,
        constructorArguments: [{
                    erc20TokenAddress: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
                    maxSupply: 1000000000,
                    pricePerMint: ethers.utils.parseEther("0"),
                    royaltyRecipient: "0x400Fc9C7F01Df3aa919659De434E0c584e68CB29",
                    royaltyPercentageBps: 500,
                    tokenUriIsEnumerable: false,
        }
        ],
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});