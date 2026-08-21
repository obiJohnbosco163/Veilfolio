use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq, Debug, starknet::Store)]
#[allow(starknet::store_no_default_variant)]
pub enum IdentityType {
    TRADING,
    DEFI,
    YIELD,
    LONG_TERM,
    APP,
    VENUE,
    STRATEGY,
    CUSTOM,
}

#[derive(Copy, Drop, Serde, PartialEq, Debug, starknet::Store)]
pub struct Identity {
    pub id: u256,
    pub name: felt252,
    pub identity_type: IdentityType,
    pub owner: ContractAddress,
    pub created_at: u64,
    pub is_active: bool,
}

#[starknet::interface]
pub trait IVeilfolioIdentityManager<TContractState> {
    fn create_identity(ref self: TContractState, name: felt252, identity_type: IdentityType) -> u256;
    fn get_identities(self: @TContractState, owner: ContractAddress) -> Array<Identity>;
    fn get_identity(self: @TContractState, identity_id: u256) -> Identity;
    fn set_identity_status(ref self: TContractState, identity_id: u256, is_active: bool);
    fn get_identity_count(self: @TContractState) -> u256;
}

#[starknet::contract]
pub mod VeilfolioIdentityManager {
    use starknet::storage::{
        Map, StorageMapReadAccess, StorageMapWriteAccess, StoragePointerReadAccess,
        StoragePointerWriteAccess,
    };
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use super::{Identity, IdentityType, IVeilfolioIdentityManager};

    #[storage]
    struct Storage {
        identity_counter: u256,
        identities: Map<u256, Identity>,
        owner_identity_count: Map<ContractAddress, u256>,
        owner_identity_ids: Map<(ContractAddress, u256), u256>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        IdentityCreated: IdentityCreated,
        IdentityStatusUpdated: IdentityStatusUpdated,
    }

    #[derive(Drop, starknet::Event)]
    pub struct IdentityCreated {
        pub identity_id: u256,
        pub owner: ContractAddress,
        pub name: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct IdentityStatusUpdated {
        pub identity_id: u256,
        pub is_active: bool,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.identity_counter.write(0);
    }

    #[abi(embed_v0)]
    impl VeilfolioIdentityManagerImpl of IVeilfolioIdentityManager<ContractState> {
        fn create_identity(ref self: ContractState, name: felt252, identity_type: IdentityType) -> u256 {
            let caller = get_caller_address();
            let id = self.identity_counter.read();
            let now = get_block_timestamp();

            let identity = Identity {
                id,
                name,
                identity_type,
                owner: caller,
                created_at: now,
                is_active: true,
            };

            self.identities.write(id, identity);

            let count = self.owner_identity_count.read(caller);
            self.owner_identity_ids.write((caller, count), id);
            self.owner_identity_count.write(caller, count + 1);

            self.identity_counter.write(id + 1);

            self.emit(IdentityCreated { identity_id: id, owner: caller, name });

            id
        }

        fn get_identities(self: @ContractState, owner: ContractAddress) -> Array<Identity> {
            let count = self.owner_identity_count.read(owner);
            let mut identities = ArrayTrait::new();
            let mut i: u256 = 0;
            while i < count {
                let id = self.owner_identity_ids.read((owner, i));
                let identity = self.identities.read(id);
                identities.append(identity);
                i += 1;
            };
            identities
        }

        fn get_identity(self: @ContractState, identity_id: u256) -> Identity {
            self.identities.read(identity_id)
        }

        fn set_identity_status(ref self: ContractState, identity_id: u256, is_active: bool) {
            let mut identity = self.identities.read(identity_id);
            let caller = get_caller_address();

            assert(identity.owner == caller, 'Only owner can update');

            identity.is_active = is_active;
            self.identities.write(identity_id, identity);

            self.emit(IdentityStatusUpdated { identity_id, is_active });
        }

        fn get_identity_count(self: @ContractState) -> u256 {
            self.identity_counter.read()
        }
    }
}
