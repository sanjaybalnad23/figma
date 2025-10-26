declare type Color = {
    r: number;
    g: number;
    b: number;
}

declare type Camera = {
    x: number;
    y: number;
    zoom: number;
}

declare enum LayerType {
    Rectangle,
    Ellipse,
    Path,
    Text
}

declare type RectangleLayer = {
    type: LayerType.Rectangle,
    x: number
    y: number
    height: number
    width: number
    fill: Color
    stroke: Color
    opacity: number
    cornerRadius: number
}

declare type EllipseLayer = {
    type: LayerType.Ellipse,
    x: number
    y: number
    height: number
    width: number
    fill: Color
    stroke: Color
    opacity: number
}

declare type PathLayer = {
    type: LayerType.Path
    x: number
    y: number
    fill: Color
    stroke: Color
    opacity: number
    points: number[][]
}

declare type TextLayer = {
    type: LayerType.Text
    x: number
    y: number
    height: number
    width: number
    text: string
    fontSize: number
    fontWeight: number
    fontFamily: string
    fill: Color
    stroke: Color
    opacity: number
}

declare type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer

declare type Point = {
    x:number
    y:number
}