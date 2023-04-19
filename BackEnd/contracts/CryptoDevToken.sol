// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICryptoDev.sol";

contract CryptoDevToken is ERC20, Ownable {
    ICryptoDev CryptoDevNFT;
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant tokenPerNFT = 10 * 10 ** 18;
    uint256 public constant maxTotalSupply = 10000 * 10 ** 18;

    mapping(uint256 => bool) public tokenIdClaimed;

    constructor(address _cryptoDevsContract) ERC20("Crypto Dev Token", "CD") {
        CryptoDevNFT = ICryptoDev(_cryptoDevsContract);
    }

    function mint(uint256 amount) public payable {
        uint256 _requiredAmount = tokenPrice * amount;
        require(msg.value >= _requiredAmount, "Ether sent is incorrect");
        uint256 amountWithDecimals = amount * 10 ** 18;
        require(
            (totalSupply() + amountWithDecimals) <= maxTotalSupply,
            "Exceeds the max total supply available"
        );

        _mint(msg.sender, amountWithDecimals);
    }

    function claim() public {
        address sender = msg.sender;

        uint256 balance = CryptoDevNFT.balanceOf(sender);
        require(balance > 0, "you don't own enought NFT");
        uint256 amount = 0;
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = CryptoDevNFT.tokenOfOwnerByIndex(sender, i);
            if (!tokenIdClaimed[tokenId]) {
                amount += 1;

                tokenIdClaimed[tokenId] = true;
            }
        }
        require(amount > 0, "you have already claimed all your toknes");
        _mint(msg.sender, amount * tokenPerNFT);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;

        require(amount > 0, "nothing to withdraw, contract balance empty");

        address _owner = owner();

        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "failed to send Ether");
    }

    receive() external payable {}

    fallback() external payable {}
}
