import {TransactionInstruction, TransactionMessage, VersionedTransaction} from "@solana/web3.js";
import {NATIVE_MINT} from "@solana/spl-token";

export interface InstructionItem {
  id: string,
  instruction: TransactionInstruction
}

export enum TransactionAction {
  CALCULATE_BYTES,
  ADD_INSTRUCTION,
  MOVE_INSTRUCTION,
  DELETE_INSTRUCTION,
  ADD_SOL_INS,
  ADD_TOKEN_INS,
}

export type Action = { type: TransactionAction, payload: Record<string, any> }
type State = {
  transaction?: VersionedTransaction,
  txBytes: number,
  instructions: InstructionItem[]
}

export const initialState: State = { txBytes: 0, instructions: [] };
export const reducer = (state: State, action: Action): State => {
  let instructions;
  switch (action.type) {
    case TransactionAction.CALCULATE_BYTES:
      return {
        ...state,
        txBytes: calculateTxBytes(state.instructions)
      }
    case TransactionAction.ADD_INSTRUCTION:
      return { ...state, instructions: [...state.instructions, { ...action.payload.instructionItem }] }
    case TransactionAction.MOVE_INSTRUCTION:
      return action.payload.instructionItems;
    case TransactionAction.DELETE_INSTRUCTION:
      instructions = state.instructions.filter(item => item.id !== action.payload.id);
      return { ...state, txBytes: calculateTxBytes(instructions), instructions }
    case TransactionAction.ADD_SOL_INS:
    case TransactionAction.ADD_TOKEN_INS:
      instructions = state.instructions.map(item => {
        if (item.id === action.payload.instructionItem.id) return { ...action.payload.instructionItem };
        return item;
      });
      return {
        ...state,
        txBytes: calculateTxBytes(instructions),
        instructions
      }
  }
}

function calculateTxBytes(instructions: InstructionItem[]) {
  return new TransactionMessage({
    payerKey: NATIVE_MINT,
    recentBlockhash: "6ssxLWDu5arBBfoAYqfE8cPvwFSQEaUBCzsZwJNpuyzk", // Dummy block hash
    instructions: instructions.map(it => it.instruction).filter(it => it !== null),
  }).compileToV0Message().serialize().length
}
