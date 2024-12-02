module stamp::signature_stamp {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;
    use sui::table::{Self};

    /// The structure for the Signature Stamp
    public struct SignatureStamp has key, store {
        id: UID,              // Unique ID for the signature object
        owner: address,       // Owner's address
        label: String,        // Optional label for the stamp
    }

    /// Public table mapping addresses to their SignatureStamp
    public struct StampRegistry has key, store {
        id: UID,              // Added required UID field
        registry: table::Table<address, address>, // Changed UID to address for value type
    }

    /// Initialize the registry
    #[allow(unused_field)]
    public entry fun init_registry(ctx: &mut TxContext) {
        let registry = StampRegistry {
            id: object::new(ctx),
            registry: table::new(ctx),
        };
        // Transfer the registry to shared object that anyone can access
        transfer::share_object(registry)
    }

    /// Mint a new signature stamp and register it
    public entry fun mint_stamp(
        registry: &mut StampRegistry,
        label: String,
        ctx: &mut TxContext,
    ) {
        let sender = tx_context::sender(ctx);
        let stamp = SignatureStamp {
            id: object::new(ctx),
            owner: sender,
            label,
        };

        // Add the new stamp to the registry using the owner's address
        table::add(&mut registry.registry, sender, sender);
        
        // Transfer the stamp to the sender
        transfer::transfer(stamp, sender);
    }
}
