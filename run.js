const main = async () => {
//hre，是一个包含 Hardhat 在运行任务、测试或脚本时公开的所有功能的对象(Hardhat 就是 HRE)。

  const [owner, superCoder] = await hre.ethers.getSigners();
  //抓取了合约所有者的钱包地址
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  //用于将编译我们的合约并在目录下生成我们使用合约所需的必要文件 artifacts
  const domainContract = await domainContractFactory.deploy("krt");
  //在部署时，我们将“krt”传递给构造函数(注册域的结尾都是.krt)
  await domainContract.deployed();
  //将等到我们的合约被正式挖掘并部署到我们的本地区块链
  console.log("Contract deployed to:", domainContract.address);
  //部署合约的地址
  console.log("Contract owner:", owner.address);
  //查看部署合约的人的地址

  let txn = await domainContract.register("whalehat",  {value: hre.ethers.utils.parseEther('0.1')});
  await txn.wait();
  //等待TX确认

  const address = await domainContract.getAddress("whalehat");
  //调用该getAddress函数来返回该域的所有者
  console.log("Owner of domain mortal:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

   try {
    txn = await domainContract.connect(superCoder).withdraw();
    await txn.wait();
  } catch(error){
    console.log("Could not rob contract");
  }

 // 看他们的钱包，以便稍后比较
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log("Balance of owner before withdrawal:", hre.ethers.utils.formatEther(ownerBalance));

  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();
  
  // 获取合约和用户的余额
  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log("Contract balance after withdrawal:", hre.ethers.utils.formatEther(contractBalance));
  console.log("Balance of owner after withdrawal:", hre.ethers.utils.formatEther(ownerBalance));
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

