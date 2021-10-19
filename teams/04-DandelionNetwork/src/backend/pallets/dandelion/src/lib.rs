#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://substrate.dev/docs/en/knowledgebase/runtime/frame>
pub use pallet::*;

extern crate alloc;

#[frame_support::pallet]
pub mod pallet {
	use frame_support::{
		dispatch::{DispatchResult, DispatchResultWithPostInfo},
		pallet_prelude::*,
		sp_runtime::traits::Hash,
		traits::Randomness,
	};
	use frame_system::pallet_prelude::*;
	use sp_core::H256;
	use sp_std::vec::Vec;

	#[pallet::pallet]
	#[pallet::generate_store(trait Store)]
	pub struct Pallet<T>(_);

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: pallet_balances::Config + frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type Event: From<Event<Self>> + IsType<<Self as frame_system::Config>::Event>;

		/// The type of Random we want to specify for runtime.
		type ProveRandomness: Randomness<H256, <Self as frame_system::Config>::BlockNumber>;
	}

	// Errors.
	#[pallet::error]
	pub enum Error<T> {
		/// Nonce has overflowed past u64 limits
		NonceOverflow,
	}

	#[pallet::event]
	#[pallet::generate_deposit(pub (super) fn deposit_event)]
	pub enum Event<T: Config> {
		Created(T::AccountId, T::Hash),
		PriceSet(T::AccountId, T::Hash, T::Balance),
		Transferred(T::AccountId, T::AccountId, T::Hash),
		Bought(T::AccountId, T::AccountId, T::Hash, T::Balance),
	}

	// Storage items.

	// Keeps track of the Nonce used in the randomness generator.
	#[pallet::storage]
	#[pallet::getter(fn get_nonce)]
	pub(super) type Nonce<T: Config> = StorageValue<_, u64, ValueQuery>;

	// Stores a Prove: it's unique traits and price.
	#[pallet::storage]
	#[pallet::getter(fn prove)]
	pub(super) type Proves<T: Config> = StorageMap<_, Twox64Concat, T::Hash, Vec<u8>, ValueQuery>;

	#[pallet::storage]
	pub(super) type ProveOfOwner<T: Config> =
		StorageMap<_, Twox64Concat, T::AccountId, Vec<T::Hash>, ValueQuery>;

	// An index to track of all Proves.
	#[pallet::storage]
	#[pallet::getter(fn prove_by_index)]
	pub(super) type AllProvesArray<T: Config> =
		StorageMap<_, Twox64Concat, u64, T::Hash, ValueQuery>;

	// Stores the total amount of Proves in existence.
	#[pallet::storage]
	#[pallet::getter(fn all_proves_count)]
	pub(super) type AllProvesCount<T: Config> = StorageValue<_, u64, ValueQuery>;

	// Keeps track of all the Proves.
	#[pallet::storage]
	pub(super) type AllProvesIndex<T: Config> =
		StorageMap<_, Twox64Concat, T::Hash, u64, ValueQuery>;

	// Keep track of who a Prove is owned by.
	#[pallet::storage]
	#[pallet::getter(fn prove_of_owner_by_index)]
	pub(super) type OwnedProvesArray<T: Config> =
		StorageMap<_, Twox64Concat, (T::AccountId, u64), T::Hash, ValueQuery>;

	// Keeps track of the total amount of Proves owned.
	#[pallet::storage]
	#[pallet::getter(fn owned_prove_count)]
	pub(super) type OwnedProvesCount<T: Config> =
		StorageMap<_, Twox64Concat, T::AccountId, u64, ValueQuery>;

	// Keeps track of all owned Proves by index.
	#[pallet::storage]
	pub(super) type OwnedProvesIndex<T: Config> =
		StorageMap<_, Twox64Concat, T::Hash, u64, ValueQuery>;

	// Our pallet's genesis configuration.
	#[pallet::genesis_config]
	pub struct GenesisConfig<T: Config> {
		pub proves: Vec<(T::AccountId, T::Hash)>,
	}

	// Required to implement default for GenesisConfig.
	#[cfg(feature = "std")]
	impl<T: Config> Default for GenesisConfig<T> {
		fn default() -> GenesisConfig<T> {
			GenesisConfig { proves: vec![] }
		}
	}

	#[pallet::genesis_build]
	impl<T: Config> GenesisBuild<T> for GenesisConfig<T> {
		fn build(&self) {
			for &(ref acct, hash) in &self.proves {
				let _ = <Pallet<T>>::mint(acct.clone(), hash, vec![1, 2]);
			}
		}
	}

	#[pallet::hooks]
	impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.

	#[pallet::call]
	impl<T: Config> Pallet<T> {
		/// Create a new unique prove.
		///
		/// Provides the new Prove details to the 'mint()'
		/// helper function (sender, prove hash, Prove struct).
		///
		/// Calls mint() and increment_nonce().
		///
		/// Weight: `O(1)`
		#[pallet::weight(100)]
		pub fn create_prove(
			origin: OriginFor<T>,
			file_hash: Vec<u8>,
		) -> DispatchResultWithPostInfo {
			let sender = ensure_signed(origin)?;
			let random_hash = Self::random_hash(&sender);

			Self::mint(sender, random_hash, file_hash)?;
			Self::increment_nonce()?;

			Ok(().into())
		}
	}

	//** These are all our **//
	//** helper functions. **//

	impl<T: Config> Pallet<T> {
		/// Safely increment the nonce, with error on overflow
		fn increment_nonce() -> DispatchResult {
			<Nonce<T>>::try_mutate(|nonce| {
				let next = nonce.checked_add(1).ok_or(Error::<T>::NonceOverflow)?;
				*nonce = next;

				Ok(().into())
			})
		}

		/// Generate a random hash, using the nonce as part of the hash
		fn random_hash(sender: &T::AccountId) -> T::Hash {
			let nonce = <Nonce<T>>::get();
			let seed = T::ProveRandomness::random_seed();

			T::Hashing::hash_of(&(seed, &sender, nonce))
		}

		// Helper to mint a Prove.
		fn mint(to: T::AccountId, prove_id: T::Hash, file_hash: Vec<u8>) -> DispatchResult {
			ensure!(!Proves::<T>::contains_key(prove_id), "Prove already contains_key");

			// Update total Prove counts.
			let owned_prove_count = Self::owned_prove_count(&to);
			let new_owned_prove_count = owned_prove_count
				.checked_add(1)
				.ok_or("Overflow adding a new prove to account balance")?;

			let all_proves_count = Self::all_proves_count();
			let new_all_proves_count = all_proves_count
				.checked_add(1)
				.ok_or("Overflow adding a new prove to total supply")?;

			// Update storage with new Prove.
			<Proves<T>>::insert(prove_id, file_hash);
			ProveOfOwner::<T>::mutate(&to, |prove_ids| {
				prove_ids.push(prove_id);
			});

			// Write Prove counting information to storage.
			<AllProvesArray<T>>::insert(new_all_proves_count, prove_id);
			<AllProvesCount<T>>::put(new_all_proves_count);
			<AllProvesIndex<T>>::insert(prove_id, new_all_proves_count);

			// Write Prove counting information to storage.
			<OwnedProvesArray<T>>::insert((to.clone(), new_owned_prove_count), prove_id);
			<OwnedProvesCount<T>>::insert(&to, new_owned_prove_count);
			<OwnedProvesIndex<T>>::insert(prove_id, new_owned_prove_count);

			// Deposit our "Created" event.
			Self::deposit_event(Event::Created(to, prove_id));

			Ok(())
		}
		pub fn get_file_hash(owner: T::AccountId) -> Vec<Vec<u8>> {
			ProveOfOwner::<T>::get(&owner).into_iter().map(Proves::<T>::get).collect()
		}
	}
}
use alloc::vec::Vec;

sp_api::decl_runtime_apis! {
	pub trait DandelionRuntimeApi<T: Config> {
		fn get_file_hash(owner: T::AccountId) -> Vec<Vec<u8>>;
	}
}
