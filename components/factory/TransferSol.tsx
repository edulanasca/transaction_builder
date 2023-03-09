import {ChangeEvent, FC, useState} from "react";
import {TransactionInstructionProps} from "../TransactionInstructionFactory";
import {Flex, FormControl, FormLabel, Input, NumberInput, NumberInputField} from "@chakra-ui/react";
import {TransactionAction} from "../../reducer/transactionReducer";
import {LAMPORTS_PER_SOL, PublicKey, SystemProgram} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";

const TransferSol: FC<TransactionInstructionProps> = ({ id, dispatch }) => {
  const wallet = useWallet();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleToInputChange = (e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value);
  const handleAmountInputChange = (valueAsString: string, _: number) => {
    setAmount(valueAsString);
  }

  const handleAddInstruction = () => {
    dispatch({
      type: TransactionAction.ADD_SOL_INS,
      payload: {
        instructionItem: {
          id, instruction: SystemProgram.transfer({
            fromPubkey: wallet.publicKey!,
            toPubkey: new PublicKey(to),
            lamports: parseFloat(amount) * LAMPORTS_PER_SOL
          })
        }
      }
    });
  }

  return (
    <Flex direction={["column", "row"]} columnGap={[0, 4]} rowGap={[4, 0]}>
      <FormControl>
        <FormLabel>Amount</FormLabel>
        <NumberInput min={0} precision={9} value={amount} onChange={handleAmountInputChange}>
          <NumberInputField/>
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>To</FormLabel>
        <Input value={to} onChange={handleToInputChange} onBlur={handleAddInstruction}/>
      </FormControl>
    </Flex>
  );
}

export default TransferSol;