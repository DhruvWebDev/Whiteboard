import React, { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Eraser, Pencil } from 'lucide-react'

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [isEraser, setIsEraser] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      context.lineCap = 'round'
      context.lineJoin = 'round'
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e, true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) {
      context.beginPath()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, isNewStroke: boolean = false) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context || !canvas) return

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    context.strokeStyle = isEraser ? '#FFFFFF' : color
    context.lineWidth = brushSize

    if (isNewStroke) {
      context.beginPath()
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const toggleEraser = () => {
    setIsEraser(!isEraser)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Whiteboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex space-x-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-md"
          />
          <div className="flex-1">
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              max={20}
              step={1}
            />
          </div>
          <Button onClick={toggleEraser} variant={isEraser ? "secondary" : "outline"}>
            {isEraser ? <Eraser className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </Button>
          <Button onClick={clearCanvas} variant="destructive">
            Clear
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={(e) => draw(e)}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={(e) => draw(e)}
            className="w-full h-auto bg-white touch-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}
