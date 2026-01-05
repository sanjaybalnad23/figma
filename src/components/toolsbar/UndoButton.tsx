import { FaUndo } from "react-icons/fa";
import IconButton from "./IconButton";

export default function UndoButton({onClick, disabled}:{onClick:()=>void, disabled:boolean}) {
  return (
    <IconButton
        onClick={onClick}
        disabled={disabled}
    >
        <FaUndo color="#888888" size={22}/>
    </IconButton>
  )
}
