export function rgbToHex(color:Color){
    return `#${[color.r, color.g, color.b].map(x => x.toString(16).padStart(2, "0")).join("")}`
}