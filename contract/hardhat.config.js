require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config()

module.exports = {
	solidity: "0.8.18",
	networks: {
		hardhat: {},
		polygon: {
			accounts: [`${process.env.PRIVATE_KEY}`],
			url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
		},
		mumbai: {
			accounts: [`${process.env.PRIVATE_KEY}`],
			url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
		}
	},
	etherscan: {
		apiKey: `${process.env.ETHERSCAN_API_KEY}`
	}
}