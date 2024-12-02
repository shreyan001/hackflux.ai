import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { config } from 'dotenv';

config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const PACKAGE_ID = process.env.PACKAGE_ID!;
const REGISTRY_ID = process.env.REGISTRY_ID!;

async function main() {
    try {
        const client = new SuiClient({ url: getFullnodeUrl('devnet') });
        const keypair = Ed25519Keypair.fromSecretKey(PRIVATE_KEY);
        
        const tx = new Transaction();
        
        // Call mint_stamp with registry and label
        tx.moveCall({
            target: `${PACKAGE_ID}::signature_stamp::mint_stamp`,
            arguments: [
                tx.object(REGISTRY_ID),
                tx.pure.string("My First Signature Stamp") // Fixed: Use pure.string() for string arguments
            ],
        });

        const result = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });

        console.log('Stamp minted successfully!');
        console.log('Transaction digest:', result.digest);
        console.log('Created Objects:', result.effects?.created);

    } catch (e) {
        console.error('Error:', e);
    }
}

main();