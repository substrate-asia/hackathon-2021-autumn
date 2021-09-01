pragma solidity ^0.8.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.0/contracts/token/ERC20/ERC20.sol';

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
//准备支持两种，一种是erc20,一种是eth本身，目前下面的价格都是以eth为准。
//现在主要有两个问题，首先设想每个作物都有自己得成熟时间，这本身使得其成为了NFT，但是每个作物间的价格又是相等的。第二就是池子利率得问题
contract MockToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MocToken", "MTK") {
    _mint(msg.sender, initialSupply);
  }
}


contract Magicfarm {
    Store public storeAddress;
    
    constructor(){
        storeAddress = new Store();
    }
    
}

contract Store{
    
    
    
    //count how many species intotal
    uint public total_species_count;
    
    //Specie info
    struct Specie{
        string name;
        uint   maturity_cycle;
    }
    
    
    mapping (uint => Specie) public specie_number;//(specie number => specie struct)
    mapping (uint => uint)   public specie_sold_count;//(specie number => how many items of this kind specie had been sold out)
    mapping (uint => uint)   public sell_prices; //(specie number => sell price)
    mapping (uint => uint)   public repurchase_prices; //(specie number => repurchase price)
    mapping (address => mapping(uint => uint)) public user_2_specie_number_2_count;//(user => (specie number => count)
    
    
    //mock erc20 address
    MockToken public mockTokenaddress;
    //mock token price 10 usd
    uint constant mprice = 10;
    
    constructor(){
        mockTokenaddress = new MockToken(10000000000000000000);
    }
    
    //create new specie 
    function create_new_specie(string memory _name, uint _maturity_cycle) public returns(uint new_specie_number){
        total_species_count +=1 ;
        specie_number[total_species_count] = Specie(_name, _maturity_cycle);
        return total_species_count;
    }
    
    //set price means add this specie to store. firstly, set two price equal. then the repurchase price should turned according to funding pool  
    function set_price_for_a_specie(uint _specie_number, uint _initial_price) public {
        sell_prices[_specie_number] = _initial_price;
        repurchase_prices[_specie_number] = _initial_price;
    }
    
    //buy a specie(deposit)
    function buy_a_specie(uint _specie_number) public payable returns(bool){
        require(_specie_number <=total_species_count, "No such specie can buy");
        require(_specie_number > 0, "No such specie can buy");
        require(msg.value == sell_prices[_specie_number], "Not enough money or too much");
        user_2_specie_number_2_count[msg.sender][_specie_number] += 1;
        specie_sold_count[_specie_number] +=1;
        return true;
    }
    
    //sellout a specie(withdraw)
    function sell_a_specie(uint _specie_number) public payable returns(bool){
        require(_specie_number <=total_species_count, "No such specie can buy");
        require(_specie_number > 0, "No such specie can buy");
        require(user_2_specie_number_2_count[msg.sender][_specie_number] >= 1, "You don't have this specie");
        user_2_specie_number_2_count[msg.sender][_specie_number] -= 1;
        specie_sold_count[_specie_number] -=1;
        payable(address(msg.sender)).transfer(repurchase_prices[_specie_number]);
        return true;
    }

    //borrow

    //repay 
    
    
    
}

