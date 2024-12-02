import { StateGraph } from "@langchain/langgraph";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { START, END } from "@langchain/langgraph";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import fs from 'fs/promises';
import path from 'path';

const model = new ChatGroq({
    modelName: "llama3-8b-8192",
    temperature: 0.7,
    maxTokens: 8192,
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

type SuiSignatureState = {
    input: string,
    agreementData?: string | null,
    chatHistory?: BaseMessage[],
    messages?: any[] | null,
    operation?: string,
    result?: string,
    paymentDetails?: {
        amount?: string,
        purpose?: string,
        parties?: string[],
        type?: 'request' | 'payment'
    } | null,
    signatureDetails?: {
        signerAddress?: string,
        stampId?: string,
        timestamp?: string
    } | null
}

export default function suiAgent() {
    const graph = new StateGraph<SuiSignatureState>({
        channels: {
            messages: { value: (x: any[], y: any[]) => x.concat(y) },
            input: { value: null },
            result: { value: null },
            agreementData: { value: null },
            chatHistory: { value: null },
            operation: { value: null },
            paymentDetails: { value: null },
            signatureDetails: { value: null }
        }
    });

    // Initial Node with updated routing logic
    graph.addNode("initial_node", async (state: SuiSignatureState) => {
        const SYSTEM_TEMPLATE = `You are SuiPay Assistant, an AI agent for a blockchain-based payment and signature verification platform. Your role is to help users with digital signatures, payment receipts, and legal agreements on the Sui blockchain.

Available services:
1. SIGNATURE_STAMP: Create or manage digital signature stamps (NFT-based)
2. PAYMENT_RECEIPT: Generate payment receipts with legal agreements
3. PAYMENT_REQUEST: Create payment request receipts
4. VERIFY_SIGNATURE: Verify existing signatures and agreements
5. HELP: General assistance and information

Based on the user's message, respond with ONE of:
- "signature_stamp" - For signature stamp creation/management
- "payment_receipt" - For creating payment receipts
- "payment_request" - For creating payment request receipts
- "verify" - For signature/receipt verification
- "help" - For general inquiries

Analyze the user's intent carefully. Respond with ONLY the routing word.`;

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", SYSTEM_TEMPLATE],
            new MessagesPlaceholder({ variableName: "chat_history", optional: true }),
            ["human", "{input}"]
        ]);

        const response = await prompt.pipe(model).invoke({
            input: state.input,
            chat_history: state.chatHistory
        });

        const content = response.content as string;
        return {
            messages: [response.content],
            operation: content.trim().toLowerCase()
        };
    });

    // Signature Stamp Node
    graph.addNode("signature_stamp", async (state: SuiSignatureState) => {
        const STAMP_TEMPLATE = `You are assisting with digital signature stamp creation on Sui blockchain. These stamps are NFT-based objects that users can use to sign documents and agreements.

Guide the user through the stamp creation process by:
1. Explaining the purpose and importance of the signature stamp
2. Collecting necessary information (name, address, etc.)
3. Explaining the minting process and gas fees
4. Providing security best practices

Format your response as a conversation, asking one question at a time.`;

        // Implementation continues...
    });

    // Payment Receipt Node
    graph.addNode("payment_receipt", async (state: SuiSignatureState) => {
        const RECEIPT_TEMPLATE = `You are helping create a legally-viable payment receipt on the Sui blockchain. 

Guide the user by collecting:
1. Payment amount and currency
2. Purpose of payment
3. Payer and payee details
4. Additional terms or conditions

Based on this information, you'll help generate:
- A legal agreement
- Payment receipt metadata
- Signature requirements

Ask questions one at a time to gather necessary information.`;

        // Implementation continues...
    });

    // Add edges and conditional routing
    graph.addEdge(START, "initial_node");
    
    graph.addConditionalEdges(
        "initial_node",
        async (state) => {
            switch (state.operation) {
                case "signature_stamp": return "signature_stamp";
                case "payment_receipt": return "payment_receipt";
                case "payment_request": return "payment_request";
                case "verify": return "verify";
                case "help": return "help";
                default: return "end";
            }
        },
        {
            signature_stamp: "signature_stamp",
            payment_receipt: "payment_receipt",
            payment_request: "payment_request",
            verify: "verify",
            help: "help",
            end: END
        }
    );

    // Add remaining edges
    ["signature_stamp", "payment_receipt", "payment_request", "verify", "help"].forEach(node => {
        graph.addEdge(node, END);
    });

    const data = graph.compile();
    return data;
}