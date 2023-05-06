import {TransactionInstruction, TransactionMessage} from "@solana/web3.js";
import {NATIVE_MINT} from "@solana/spl-token";

export interface InstructionItem {
  id: string,
  instructions: TransactionInstruction[]
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
export type State = {
  txBytes: number,
  instructionItems: InstructionItem[]
}

export const initialState: State = { txBytes: 0, instructionItems: [] };
export const reducer = (state: State, action: Action): State => {
  let instructions;
  switch (action.type) {
    case TransactionAction.CALCULATE_BYTES:
      return {
        ...state,
        txBytes: calculateTxBytes(state.instructionItems)
      }
    case TransactionAction.ADD_INSTRUCTION:
      return { ...state, instructionItems: [...state.instructionItems,  ...action.payload.instructionItems] }
    case TransactionAction.MOVE_INSTRUCTION:
      return action.payload.instructionItems;
    case TransactionAction.DELETE_INSTRUCTION:
      instructions = state.instructionItems.filter(item => item.id !== action.payload.id);
      return { ...state, txBytes: instructions.length === 0 ? 0 :  calculateTxBytes(instructions), instructionItems: instructions };
    case TransactionAction.ADD_SOL_INS:
    case TransactionAction.ADD_TOKEN_INS:
      instructions = state.instructionItems.map(item => {
        // Updates the instructions prop, as initially it is empty
        if (item.id === action.payload.instructionItems.id) return { ...action.payload.instructionItems };
        return item;
      });
      return {
        ...state,
        txBytes: calculateTxBytes(instructions),
        instructionItems: instructions
      }
  }
}

function calculateTxBytes(instructions: InstructionItem[]) {
  return new TransactionMessage({
    payerKey: NATIVE_MINT,
    recentBlockhash: "6ssxLWDu5arBBfoAYqfE8cPvwFSQEaUBCzsZwJNpuyzk", // Dummy block hash
    instructions: instructions.flatMap(it => it.instructions).filter(it => it !== null),
  }).compileToV0Message().serialize().length
}
