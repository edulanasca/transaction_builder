import {AddIcon, CheckIcon} from "@chakra-ui/icons";
import {Button, Heading, IconButton, VStack} from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import Instruction from "./Instruction";
import {initialState, reducer} from "../reducer/transactionReducer";
import {useReducer, useState} from "react";
import {addInstruction, moveInstruction} from "../reducer/transactionActions";
import {clusterApiUrl, Connection, TransactionMessage, VersionedTransaction} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";

const Transaction = () => {
  const [transaction, dispatch] = useReducer(reducer, initialState);
  const [sendingTx, setSendingTx] = useState(false);
  const wallet = useWallet();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over !== null) {
      if (active.id !== over.id) {
        const oldIndex = transaction.instructions.findIndex(item => item.id === active.id);
        const newIndex = transaction.instructions.findIndex(item => item.id === over.id);

        dispatch(moveInstruction(transaction.instructions, oldIndex, newIndex));
      }
    }
  }

  const handleAddIns = () => dispatch(addInstruction());

  const sendTx = async () => {
    if (wallet.connected && wallet.publicKey) {
      setSendingTx(true);
      const connection = new Connection(clusterApiUrl("devnet"));
      const blockhash = await connection.getLatestBlockhash();
      const msg = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash.blockhash,
        instructions: transaction.instructions.map(it => it.instruction)
      }).compileToV0Message();
      const tx = new VersionedTransaction(msg);

      await wallet.sendTransaction(tx, connection);
      setSendingTx(false);
    }
  }

  return (
    <VStack>
      <Heading>{`Bytes used: ${transaction.txBytes} / 1232`}</Heading>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={transaction.instructions}
          strategy={verticalListSortingStrategy}
        >
          {transaction.instructions.map(insItem => <Instruction key={insItem.id} id={insItem.id} dispatch={dispatch}/>)}
        </SortableContext>
      </DndContext>
      <IconButton aria-label="add-instruction" icon={<AddIcon/>} onClick={handleAddIns}/>
      <Button
        leftIcon={<CheckIcon/>}
        isLoading={sendingTx}
        onClick={sendTx}
      >
        Send Transaction
      </Button>
    </VStack>
  );
}

export default Transaction;