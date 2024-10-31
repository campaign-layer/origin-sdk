import { createWalletClient, http } from 'viem'
import { testnet } from './chains';
let client = null;

const getClient = () => {
    if (!client) {
        client = createWalletClient({
            chain: testnet,
            transport: http()
        })
    }
    return client
}
export { getClient }
