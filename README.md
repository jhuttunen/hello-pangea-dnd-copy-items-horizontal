# Drag and drop copy items horizontal demo with @hello-pangea/dnd
 
The [@hello-pangea/dnd](https://www.npmjs.com/package/@hello-pangea/dnd) used in this demo is originally forked from [react-beautiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd) and is a community-driven open source drag-and-drop library for React. 

In practice, these are almost identical libraries, but Atlassian, the developer company of the original react-beautiful-dnd (e.g. Trello, Confluence, etc.) stopped actively developing the library, while @hello-pangea/dnd will continue to be actively developed.

There is also a [bug](https://github.com/atlassian/react-beautiful-dnd/issues/2407) in react-beautiful-dnd when used with React 18 and strict-mode, which brakes the dragging feature. This bug has been fixed in @hello-pangea/dnd and since the library is being actively developed, it seems like better option in the long run.

This demo was adapted from [public codesandbox.io sandbox](https://codesandbox.io/s/drag-and-drop-copy-beautiful-dnd-functional-khno7), which used React's older version 17 and react-beautiful -dnd. 

## Features currently

* configured to work horizontally in rows
* you can drag copies of list elements into drop zones
* create new drop areas, i.e. rows
* arrange the copied elements in rows
* move elements between different rows
