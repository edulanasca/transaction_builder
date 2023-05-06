import {FC} from "react";
import {TransactionInstructionProps} from "./TransactionInstructionFactory";
import {useWallet} from "@solana/wallet-adapter-react";
import {transferSol} from "../../reducer/transactionActions";
import Transfer from "./Transfer";
import {useToast} from "@chakra-ui/react";

const TransferSol: FC<TransactionInstructionProps> = ({ id, dispatch }) => {
  const wallet = useWallet();
  const toast = useToast();
  const handleAddInstruction = (to: string, amount: string) => {
    try {
      dispatch(transferSol(id, wallet.publicKey!, to, parseFloat(amount)));
    } catch (err) {
      toast({title: "Error while adding transaction", description: (err as string).toString(), status: "error", isClosable: true});
    }
  }

  return <Transfer onAddInstruction={handleAddInstruction}/>;
}

export default TransferSol;