import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { config } from 'dotenv';

config();

const OWNER_ADDRESS = '0x385c5dbf36b5345d1b958a81d5ac5ace06ce49c0544c5a6e9bca737eac5758b6';
const PACKAGE_ID = process.env.PACKAGE_ID!;

async function checkStamps() {
    try {
        const client = new SuiClient({ url: getFullnodeUrl('devnet') });

        // Query owned objects
        const objects = await client.getOwnedObjects({
            owner: OWNER_ADDRESS,
            filter: {
                StructType: `${PACKAGE_ID}::signature_stamp::SignatureStamp`
            },
            options: {
                showContent: true,
                showType: true,
                showOwner: true
            }
        });

        if (objects.data.length === 0) {
            console.log('No signature stamps found');
            return;
        }

        console.log('Found signature stamps:');
        objects.data.forEach((obj, index) => {
            const content = obj.data?.content as any;
            console.log(`\nStamp ${index + 1}:`);
            console.log('Object ID:', obj.data?.objectId);
            console.log('Owner:', content.owner);
            console.log('Label:', content.label);
            console.log('Owner Address:', obj.data?.owner);
        });

    } catch (e) {
        console.error('Error:', e);
    }
}

checkStamps(); 