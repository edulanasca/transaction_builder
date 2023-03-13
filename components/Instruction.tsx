import {ChangeEvent, Dispatch, FC, useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {InstructionType} from "./factory/instructionType";
import TransactionFactory from "./factory/TransactionInstructionFactory";
import {Card, CardBody, CardHeader, IconButton, Select} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons";
import {Action} from "../reducer/transactionReducer";
import {removeInstruction} from "../reducer/transactionActions";

interface TransactionProps {
  id: string,
  dispatch: Dispatch<Action>
}

const Instruction: FC<TransactionProps> = ({ id, dispatch }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [selectedOption, setSelectedOption] = useState<InstructionType>(InstructionType.NONE);

  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    //@ts-ignore
    setSelectedOption(e.target.value);
  }
  const handleRemoveInstruction = () => dispatch(removeInstruction(id));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardHeader display="flex" alignItems="center">
        <Select placeholder="Select an instruction" onChange={handleOptionChange}>
          <option value={InstructionType.TRANSFER_SOL}>Transfer SOL</option>
          <option value={InstructionType.TRANSFER_TOKEN}>Transfer Token</option>
        </Select>
        <IconButton aria-label="Remove instruction" size="sm" icon={<CloseIcon/>} onClick={handleRemoveInstruction}/>
      </CardHeader>
      <CardBody>
        <TransactionFactory type={selectedOption} props={{id, dispatch}}/>
      </CardBody>
    </Card>
  );
}

export default Instruction;