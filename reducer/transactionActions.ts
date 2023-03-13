import {InstructionItem, TransactionAction} from "./transactionReducer";
import {nanoid} from "nanoid";
import {arrayMove} from "@dnd-kit/sortable";
import {LAMPORTS_PER_SOL, PublicKey, SystemProgram} from "@solana/web3.js";

const addInstruction = () => ({
  type: TransactionAction.ADD_INSTRUCTION,
  payload: { instructionItem: { id: nanoid() } }
});

const moveInstruction = (instructions: InstructionItem[], oldIndex: number, newIndex: number) => ({
  type: TransactionAction.MOVE_INSTRUCTION,
  payload: { instructionItems: arrayMove(instructions, oldIndex, newIndex) }
});

const removeInstruction = (id: string) => ({ type: TransactionAction.DELETE_INSTRUCTION, payload: { id } });

const transferSol = (id: string, from: PublicKey | string, to: PublicKey | string, amount: number) => ({
  type: TransactionAction.ADD_SOL_INS,
  payload: {
    instructionItem: {
      id,
      instruction: SystemProgram.transfer({
        fromPubkey: new PublicKey(from),
        toPubkey: new PublicKey(to),
        lamports: amount * LAMPORTS_PER_SOL
      })
    }
  }
});

export {
  addInstruction,
  moveInstruction,
  removeInstruction,
  transferSol
}