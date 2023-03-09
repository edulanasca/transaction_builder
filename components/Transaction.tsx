import {AddIcon} from "@chakra-ui/icons";
import {Heading, IconButton, VStack} from "@chakra-ui/react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import Instruction from "./Instruction";
import {nanoid} from "nanoid";
import {initialState, TransactionAction, reducer} from "../reducer/transactionReducer";
import {useReducer} from "react";
import {TransactionReducerContext} from "../reducer/transactionReducerContext";

const Transaction = () => {
  const [transaction, dispatch] = useReducer(reducer, initialState);
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

        dispatch({
          type: TransactionAction.MOVE_INSTRUCTION,
          payload: { instructionItems: arrayMove(transaction.instructions, oldIndex, newIndex) }
        });
      }
    }

  }

  const handleAddIns = () => dispatch({
    type: TransactionAction.ADD_INSTRUCTION,
    payload: { instructionItem: { id: nanoid() } }
  });

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
          <TransactionReducerContext.Provider value={dispatch}>
            {transaction.instructions.map(insItem => <Instruction key={insItem.id} id={insItem.id} dispatch={dispatch}/>)}
          </TransactionReducerContext.Provider>
        </SortableContext>
      </DndContext>
      <IconButton aria-label="add-instruction" icon={<AddIcon/>} onClick={handleAddIns}/>
    </VStack>
  );
}

export default Transaction;