const main = async () => {
  //hre，是一个包含 Hardhat 在运行任务、测试或脚本时公开的所有功能的对象(Hardhat 就是 HRE)。
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  //用于将编译我们的合约并在目录下生成我们使用合约所需的必要文件 artifacts
  const [owner, randomPerson] = await hre.ethers.getSigners();
  //抓取了合约所有者的钱包地址，我还得到了一个随机的钱包地址并调用它 randomPerson
  const domainContract = await domainContractFactory.deploy("krt");
  //在部署时，我们将“krt”传递给构造函数(注册域的结尾都是.krt)
  await domainContract.deployed();
  //将等到我们的合约被正式挖掘并部署到我们的本地区块链

  console.log("Contract deployed to:", domainContract.address);
  //部署合约的地址
  console.log("Contract deployed by:", owner.address);
  //查看部署合约的人的地址

  // 把这个域换成别的东西
  let txn = await domainContract.register("krt",  {value: hre.ethers.utils.parseEther('0.1')});
  await txn.wait();
  console.log("Minted domain krypectro.krt");

  txn = await domainContract.setRecord("krt", "Hello krt!!!");
  await txn.wait();
  console.log("Set record for krypectro.krt");

  const address = await domainContract.getAddress("krypectro");
  console.log("Owner of domain krypectro:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
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