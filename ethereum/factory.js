import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";
import Campaign from "./build/Campaign.json";
import CampaignParser from "../utils/CampaignParser";

class CampaignFactoryEO {
  constructor() {
    this.contractAddress = process.env.FACTORY_CONTRACT_ADDRESS;
    this.factoryContract = new web3.eth.Contract(
      CampaignFactory.abi,
      this.contractAddress
    );
  }

  async getDeployedCampaigns() {
    return await this.factoryContract.methods.getDeployedCampaigns().call();
  }

  async createCampaign(minimumContribution) {
    const accounts = await web3.eth.getAccounts();
    await this.factoryContract.methods
      .createCampaign(minimumContribution)
      .send({
        from: accounts[0],
      });
  }

  // address: campaign address to contribute
  // amount: amount of "ether" to contribute to the Campaign
  async contributeCampaign(address, amount) {
    const campaignToContribute = this.getCampaignByAddress(address);
    const accounts = await web3.eth.getAccounts();

    return await campaignToContribute.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei(String(amount), "ether"),
    });
  }

  async getCampaignSummary(address) {
    const campaignContract = this.getCampaignByAddress(address);

    const campaignSummary = await campaignContract.methods.getSummary().call();
    return CampaignParser.parseCampaignSummary(campaignSummary);
  }

  async createCampaignRequest({ campaignId, recipient, value, description }) {
    const weiValue = web3.utils.toWei(String(value), "ether");
    const accounts = await web3.eth.getAccounts();
    const campaign = this.getCampaignByAddress(campaignId);
    return await campaign.methods
      .createRequest(description, weiValue, recipient)
      .send({
        from: accounts[0],
      });
  }

  async approveRequest(address, requestId) {
    const accounts = await web3.eth.getAccounts();
    const _campaign = this.getCampaignByAddress(address);
    return await _campaign.methods.approveRequest(requestId).send({
      from: accounts[0],
    });
  }

  async finalizeRequest(address, requestId) {
    const accounts = await web3.eth.getAccounts();
    const _campaign = this.getCampaignByAddress(address);
    return await _campaign.methods.finalizeRequest(requestId).send({
      from: accounts[0],
    });
  }

  async getAllRequests(address) {
    const campaign = this.getCampaignByAddress(address);

    return await campaign.methods.getRequests().call();
  }

  getCampaignByAddress(address) {
    return new web3.eth.Contract(Campaign.abi, address);
  }
}

export default new CampaignFactoryEO();
