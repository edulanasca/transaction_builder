import {InstructionItem, TransactionAction} from "./transactionReducer";
import {nanoid} from "nanoid";
import {arrayMove} from "@dnd-kit/sortable";
import {LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionInstruction} from "@solana/web3.js";
import {
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
} from "@solana/spl-token";

const addInstruction = () => ({
    type: TransactionAction.ADD_INSTRUCTION,
    payload: {instructionItems: [{id: nanoid()}]}
});

const moveInstruction = (instructionItems: InstructionItem[], oldIndex: number, newIndex: number) => ({
    type: TransactionAction.MOVE_INSTRUCTION,
    payload: {instructionItems: arrayMove(instructionItems, oldIndex, newIndex)}
});

const removeInstruction = (id: string) => ({type: TransactionAction.DELETE_INSTRUCTION, payload: {id}});

const transferSol = (id: string, from: PublicKey | string, to: PublicKey | string, amount: number) => ({
    type: TransactionAction.ADD_SOL_INS,
    payload: {
        instructionItems: {
            id,
            instructions: [
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(from),
                    toPubkey: new PublicKey(to),
                    lamports: amount * LAMPORTS_PER_SOL
                })
            ]
        }
    }
});

export function transferToken(
    id: string, from: PublicKey,
    fromATA: PublicKey,
    to: PublicKey,
    toATA: PublicKey,
    mint: PublicKey,
    amount: number,
    createATA = false
) {
    let instructions: TransactionInstruction[] = [];
    if (createATA) instructions.push(createAssociatedTokenAccountInstruction(from, toATA, to, mint));
    instructions.push(createTransferInstruction(fromATA, toATA, from, amount));

    return {
        type: TransactionAction.ADD_TOKEN_INS,
        payload: {
            instructionItems: {
                id,
                instructions
            }
        }
    };
}


export {
    addInstruction,
    moveInstruction,
    removeInstruction,
    transferSol
}