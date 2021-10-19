use jsonrpc_core::{Error as RpcError, ErrorCode, Result};
use jsonrpc_derive::rpc;
use sc_service::Arc;
use sp_api::ProvideRuntimeApi;
use sp_runtime::{generic::BlockId, traits::Block as BlockT};
extern crate alloc;
use alloc::vec::Vec;

pub mod dandelion_rpc {
	use sc_client_api::blockchain::HeaderBackend;

	use super::*;
	#[rpc]
	pub trait DandelionApi<AccountId, BlockHash> {
		#[rpc(name = "dandelion_getFileHash")]
		fn get_file_hash(&self, owner: AccountId, at: Option<BlockHash>) -> Result<Vec<Vec<u8>>>;
	}
	pub struct DandelionRpc<C, M> {
		client: Arc<C>,
		_marker: core::marker::PhantomData<M>,
	}

	impl<C, M> DandelionRpc<C, M> {
		pub fn new(client: Arc<C>) -> Self {
			Self { client, _marker: Default::default() }
		}
	}
	impl<Client, Block>
		DandelionApi<
			<node_dandelion_runtime::Runtime as frame_system::Config>::AccountId,
			<Block as BlockT>::Hash,
		> for DandelionRpc<Client, Block>
	where
		Block: BlockT,
		Client: Send + Sync + 'static,
		Client: ProvideRuntimeApi<Block>,
		Client: HeaderBackend<Block>,
		Client::Api: pallet_dandelion::DandelionRuntimeApi<Block, node_dandelion_runtime::Runtime>,
	{
		fn get_file_hash(
			&self,
			owner: <node_dandelion_runtime::Runtime as frame_system::Config>::AccountId,
			at: Option<<Block as BlockT>::Hash>,
		) -> Result<Vec<Vec<u8>>> {
			let api = self.client.runtime_api();
			let at = BlockId::hash(at.unwrap_or_else(|| self.client.info().best_hash));
			use pallet_dandelion::DandelionRuntimeApi;
			let runtime_api_result = api.get_file_hash(&at, owner);
			runtime_api_result.map_err(|e| RpcError {
				code: ErrorCode::ServerError(1234),
				message: "Get file hash failed.".into(),
				data: Some(format!("{:?}", e).into()),
			})
		}
	}
}
