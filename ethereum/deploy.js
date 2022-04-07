const HDWalletProvider = require("@truffle/hdwallet-provider");

const Web3 = require("web3");

const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "country master erupt close cherry amused unit amount wealth silly grape draw",
  process.env.INFURA_ADDRESS
);

const web3 = new Web3(provider);

(async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({
        data: "0x" + compiledFactory.evm.bytecode.object,
        arguments: ["Hi There!"],
      })
      .send({ from: accounts[0] });
    provider.engine.stop();

    console.log("Contract deployed to", result.options.address);
  } catch (e) {
    console.log("----------------------- ERROR _------------------------");
    console.error(e);
  }
})();
