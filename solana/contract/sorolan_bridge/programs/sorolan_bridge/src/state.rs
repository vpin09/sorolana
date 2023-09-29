use anchor_lang::prelude::*;

#[account]
pub struct AuthorityPda {
    pub authority: Pubkey, // game_authority
    pub bump: u8, // bump used to create this game_pda
}

impl AuthorityPda
{
    pub const LEN: usize =  std::mem::size_of::<AuthorityPda>();
}

// 5. Define the init token params
#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitTokenParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
}

#[event]
pub struct DepositEvent {
    pub amount: u64,
    pub token_address: String,
    pub token_chain: u16,
    pub reciever_address: String,
    pub to_chain: u16,
    pub fee: u64,
}
#[event]
pub struct WithdrawEvent {
    pub amount: u64,
    pub token_address: String,
    pub token_chain: u16,
    pub withdrawer_address: String,
    pub to_chain: u16,
    pub fee: u64,
}

#[error_code]
pub enum CustomErrorCode {
    #[msg("Signature verification failed.")]
    SigVerificationFailed,
    #[msg("Signature verification failed.")]
    WrongAdmin,
}