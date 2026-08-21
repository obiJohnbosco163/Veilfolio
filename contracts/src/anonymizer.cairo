use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq, Debug, starknet::Store)]
pub struct OpenNoteDeposit {
    pub note_id: felt252,
    pub token: ContractAddress,
    pub amount: u128,
}

#[starknet::interface]
pub trait IVeilfolioAnonymizer<TContractState> {
    fn privacy_invoke(
        ref self: TContractState,
        deposits: Span<OpenNoteDeposit>,
        identity_id: u256,
    ) -> Span<OpenNoteDeposit>;
}

#[starknet::contract]
pub mod VeilfolioAnonymizer {
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_caller_address};
    use super::{IVeilfolioAnonymizer, OpenNoteDeposit};

    #[storage]
    struct Storage {
        privacy_pool: ContractAddress,
        identity_volume: Map<u256, u128>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PrivacyInvokeCalled: PrivacyInvokeCalled,
    }

    #[derive(Drop, starknet::Event)]
    pub struct PrivacyInvokeCalled {
        pub identity_id: u256,
        pub deposit_count: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState, privacy_pool: ContractAddress) {
        self.privacy_pool.write(privacy_pool);
    }

    #[abi(embed_v0)]
    impl VeilfolioAnonymizerImpl of IVeilfolioAnonymizer<ContractState> {
        fn privacy_invoke(
            ref self: ContractState,
            deposits: Span<OpenNoteDeposit>,
            identity_id: u256,
        ) -> Span<OpenNoteDeposit> {
            let caller = get_caller_address();
            assert(caller == self.privacy_pool.read(), 'Caller must be privacy pool');

            let mut total_amount: u128 = 0;
            let mut i: u32 = 0;
            while i < deposits.len() {
                let deposit = deposits.at(i);
                total_amount = total_amount + *deposit.amount;
                i += 1;
            };

            let current_volume = self.identity_volume.read(identity_id);
            self.identity_volume.write(identity_id, current_volume + total_amount);

            self.emit(PrivacyInvokeCalled { identity_id, deposit_count: deposits.len() });

            deposits
        }
    }
}
