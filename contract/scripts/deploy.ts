import { ethers, run} from "hardhat";
import {delay} from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService";

async function main() {

    console.log("Deploying AICreations...")
    console.log("Account: ", (await ethers.getSigners())[0].address);

    const Contract = await ethers.getContractFactory("AiMons");
    const price = ethers.utils.parseEther("1");
    const beneficiary = "0x400Fc9C7F01Df3aa919659De434E0c584e68CB29";
    const contract = await Contract.deploy(price, beneficiary);

    await contract.deployed();

    console.log("AICreations deployed to:", contract.address);

    console.log("Transferring ownership to beneficiary...")
    await contract.transferOwnership(beneficiary);

    console.log("Waiting for 10 seconds...");

    await delay(10000);

    console.log("Verifying on Etherscan...");

    await run('verify:verify', {
        address: contract.address,
        constructorArguments: [price, beneficiary],
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});