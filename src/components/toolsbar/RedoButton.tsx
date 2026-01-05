import { FaRedo } from "react-icons/fa";
import IconButton from "./IconButton";

export default function RedoButton({onClick, disabled}:{onClick:()=>void, disabled:boolean}) {
  return (
    <IconButton
        onClick={onClick}
        disabled={disabled}
    >
        <FaRedo color="#888888" size={22}/>
    </IconButton>
  )
}
