import { AiOutlineZoomOut } from "react-icons/ai";
import IconButton from "./IconButton";

export default function ZoomOutButton({onClick, disabled}:{onClick:()=>void, disabled:boolean}) {
  return (
    <IconButton
        onClick={onClick}
        disabled={disabled}
    >
        <AiOutlineZoomOut color="#888888" size={22}/>
    </IconButton>
  )
}