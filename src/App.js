import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];

  destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

// Styled components library is used to create elements
const Content = styled.div`
  margin-left: 120px;
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem 0;
  align-items: center;
  align-content: center;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  border: 1px ${(props) => (props.isDragging ? "dashed #000" : "solid #ddd")};
`;

const Clone = styled(Item)`
  ~ div {
    transform: none !important;
  }
`;

/*const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;*/

const List = styled.div`
  border: 1px
    ${(props) => (props.isDraggingOver ? "dashed #000" : "solid #ddd")};
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 100px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
`;

const Container = styled(List)`
  margin: 0.5rem 0.5rem 0.5rem;
  display: flex;
  min-height: 3rem;
  background-color: #eee;
  border: 0;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0.5rem;
  padding: 0.5rem;
  color: #000;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonText = styled.div`
  margin: 0 1rem;
`;

const grid = 8;

const ITEMS = [
  {
    id: uuid(),
    content: "Text Field",
  },
  {
    id: uuid(),
    content: "Email",
  },
  {
    id: uuid(),
    content: "File",
  },
  {
    id: uuid(),
    content: "Radio",
  },
  {
    id: uuid(),
    content: "Select",
  },
  {
    id: uuid(),
    content: "Checkbox",
  },
  {
    id: uuid(),
    content: "Button",
  },
  {
    id: uuid(),
    content: "Number",
  },
  {
    id: uuid(),
    content: "Textarea",
  },
];

const App = (props) => {
  const [state, setState] = useState({
    [uuid()]: [],
  });

  // When dragging ends choose what happens
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    switch (source.droppableId) {
      case destination.droppableId:
        setState((prevState) => ({
          ...prevState,
          [destination.droppableId]: reorder(
            state[source.droppableId],
            source.index,
            destination.index
          ),
        }));
        break;
      case "ITEMS":
        setState((prevState) => ({
          ...prevState,
          [destination.droppableId]: copy(
            ITEMS,
            prevState[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
      default:
        setState((prevState) => ({
          ...prevState,
          ...move(
            prevState[source.droppableId],
            prevState[destination.droppableId],
            source,
            destination
          ),
        }));
        break;
    }
  };

  const addList = () => {
    setState((prevState) => ({ ...prevState, [uuid()]: [] }));
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="ITEMS" isDropDisabled={true}>
        {(provided, snapshot) => (
          // Kiosk includes the dragable items available to copy
          <Kiosk
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {ITEMS.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <React.Fragment>
                    <Item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      style={provided.draggableProps.style}
                    >
                      {item.content}
                    </Item>
                    {snapshot.isDragging && <Clone>{item.content}</Clone>}
                  </React.Fragment>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Kiosk>
        )}
      </Droppable>
      <Content>
        <Button onClick={addList}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
            />
          </svg>
          <ButtonText>Add Row</ButtonText>
        </Button>
        {Object.keys(state).map((list, i) => (
          // Dropzone item direction is defined horizontal here
          <Droppable key={list} droppableId={list} direction="horizontal">
            {(provided, snapshot) => (
              <Container
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {state[list].length
                  ? state[list].map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Item
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                            style={provided.draggableProps.style}
                          >
                            {item.content}
                          </Item>
                        )}
                      </Draggable>
                    ))
                  : !provided.placeholder && <Notice>Drop items here</Notice>}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        ))}
      </Content>
    </DragDropContext>
  );
};
export default App;
