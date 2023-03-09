import {createElement, Dispatch, FC} from "react";
import {InstructionType} from "./factory/instructionType";
import TransferSol from "./factory/TransferSol";
import {Action} from "../reducer/transactionReducer";

interface TransactionInstructionFactoryProps {
  type: InstructionType;
  props: TransactionInstructionProps
}

export interface TransactionInstructionProps {
  id: string;
  dispatch: Dispatch<Action>
}

const transactionInstructionFactory = {
  [InstructionType.TRANSFER_SOL]: (props: TransactionInstructionProps) => createElement(TransferSol, props),
  [InstructionType.TRANSFER_TOKEN]: (props: TransactionInstructionProps) => createElement(TransferSol, props)
}

const TransactionInstructionFactory: FC<TransactionInstructionFactoryProps> = (props) => {
  const TransactionInstruction = props.type === InstructionType.NONE ? null : transactionInstructionFactory[props.type];
  return TransactionInstruction ? TransactionInstruction(props.props) : null;
}

export default TransactionInstructionFactory;