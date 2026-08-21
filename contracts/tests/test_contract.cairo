use starknet::ContractAddress;
use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address,
};

use veilfolio::{
    IVeilfolioIdentityManagerDispatcher, IVeilfolioIdentityManagerDispatcherTrait,
    IVeilfolioAnonymizerDispatcher, IVeilfolioAnonymizerDispatcherTrait, IdentityType,
    OpenNoteDeposit,
};

fn deploy_identity_manager() -> ContractAddress {
    let contract = declare("VeilfolioIdentityManager").unwrap().contract_class();
    let (address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    address
}

fn deploy_anonymizer(privacy_pool: ContractAddress) -> ContractAddress {
    let contract = declare("VeilfolioAnonymizer").unwrap().contract_class();
    let mut calldata = ArrayTrait::new();
    privacy_pool.serialize(ref calldata);
    let (address, _) = contract.deploy(@calldata).unwrap();
    address
}

#[test]
fn test_create_identity() {
    let contract_address = deploy_identity_manager();
    let dispatcher = IVeilfolioIdentityManagerDispatcher { contract_address };

    let owner: ContractAddress = 0x123.try_into().unwrap();
    start_cheat_caller_address(contract_address, owner);

    let id = dispatcher.create_identity('Trading', IdentityType::TRADING);
    assert(id == 0, 'First identity should be 0');

    let identities = dispatcher.get_identities(owner);
    assert(identities.len() == 1, 'Should have 1 identity');
    assert(*identities.at(0).name == 'Trading', 'Name should be Trading');
    assert(*identities.at(0).is_active, 'Should be active');
}

#[test]
fn test_update_identity_status() {
    let contract_address = deploy_identity_manager();
    let dispatcher = IVeilfolioIdentityManagerDispatcher { contract_address };

    let owner: ContractAddress = 0x123.try_into().unwrap();
    start_cheat_caller_address(contract_address, owner);

    let id = dispatcher.create_identity('DeFi', IdentityType::DEFI);
    dispatcher.set_identity_status(id, false);

    let identity = dispatcher.get_identity(id);
    assert(!identity.is_active, 'Should be inactive');
}

#[test]
#[should_panic(expected: ('Only owner can update',))]
fn test_cannot_update_others_identity() {
    let contract_address = deploy_identity_manager();
    let dispatcher = IVeilfolioIdentityManagerDispatcher { contract_address };

    let owner: ContractAddress = 0x123.try_into().unwrap();
    let other: ContractAddress = 0x456.try_into().unwrap();

    start_cheat_caller_address(contract_address, owner);
    let id = dispatcher.create_identity('Yield', IdentityType::YIELD);

    start_cheat_caller_address(contract_address, other);
    dispatcher.set_identity_status(id, false);
}

#[test]
fn test_anonymizer_privacy_invoke() {
    let pool_address: ContractAddress = 0xABC.try_into().unwrap();
    let contract_address = deploy_anonymizer(pool_address);
    let dispatcher = IVeilfolioAnonymizerDispatcher { contract_address };

    let token: ContractAddress = 0xDEF.try_into().unwrap();
    let deposits = array![
        OpenNoteDeposit {
            note_id: 1, token, amount: 100
        }
    ].span();

    start_cheat_caller_address(contract_address, pool_address);
    let result = dispatcher.privacy_invoke(deposits, 1);

    assert(result.len() == 1, 'Should return 1 deposit');
    assert(*result.at(0).amount == 100, 'Amount should be 100');
}

#[test]
#[should_panic(expected: ('Caller must be privacy pool',))]
fn test_anonymizer_rejects_wrong_caller() {
    let pool_address: ContractAddress = 0xABC.try_into().unwrap();
    let contract_address = deploy_anonymizer(pool_address);
    let dispatcher = IVeilfolioAnonymizerDispatcher { contract_address };

    let fake_pool: ContractAddress = 0x999.try_into().unwrap();
    start_cheat_caller_address(contract_address, fake_pool);

    let deposits = array![].span();
    dispatcher.privacy_invoke(deposits, 1);
}
