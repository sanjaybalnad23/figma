
import { AiOutlineZoomIn } from "react-icons/ai";
import IconButton from "./IconButton";

export default function ZoomInButton({onClick, disabled}:{onClick:()=>void, disabled:boolean}) {
  return (
    <IconButton
        onClick={onClick}
        disabled={disabled}
    >
        <AiOutlineZoomIn color="#888888" size={22}/>
    </IconButton>
  )
}
