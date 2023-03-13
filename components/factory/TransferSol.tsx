import {ChangeEvent, FC, useState} from "react";
import {TransactionInstructionProps} from "./TransactionInstructionFactory";
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField
} from "@chakra-ui/react";
import {useWallet} from "@solana/wallet-adapter-react";
import {transferSol} from "../../reducer/transactionActions";
import {PublicKey} from "@solana/web3.js";

const TransferSol: FC<TransactionInstructionProps> = ({ id, dispatch }) => {
  const wallet = useWallet();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1.000000000");
  const [isInvalidWallet, setIsInvalidWallet] = useState(() => {
    try {
      return new PublicKey(to).encode().length !== 32
    } catch (_) {
      return false
    }
  });
  let isInvalidAmount = amount === "";

  const handleToInputChange = (e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value);
  const handleAmountInputChange = (valueAsString: string, _: number) => setAmount(valueAsString);
  const handleAddInstruction = () => {
    try {
      dispatch(transferSol(id, wallet.publicKey!, to, parseFloat(amount)));
    } catch (_) {
      setIsInvalidWallet(true);
    }
  }

  return (
    <Flex direction={["column", "row"]} columnGap={[0, 4]} rowGap={[4, 0]}>
      <FormControl isInvalid={isInvalidAmount}>
        <FormLabel>Amount</FormLabel>
        <NumberInput min={0} precision={9} value={amount} onChange={handleAmountInputChange}>
          <NumberInputField/>
        </NumberInput>
        {
          !isInvalidAmount ?
            <FormHelperText>Enter the amount of SOL to send</FormHelperText> :
            <FormErrorMessage>Invalid amount</FormErrorMessage>
        }
      </FormControl>
      <FormControl isInvalid={isInvalidWallet}>
        <FormLabel>To</FormLabel>
        <Input value={to} onChange={handleToInputChange} onBlur={handleAddInstruction}/>
        {
          !isInvalidWallet ?
            <FormHelperText>Enter the user address you want to send SOL to</FormHelperText> :
            <FormErrorMessage>Invalid address</FormErrorMessage>
        }
      </FormControl>
    </Flex>
  );
}

export default TransferSol;