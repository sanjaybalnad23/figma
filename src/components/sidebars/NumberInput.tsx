import React, { useEffect, useState } from 'react'

export default function NumberInput({ value, onChange, min, max, icon, className }: { value: number, onChange: (value: number) => void, min?: number, max?: number, icon: React.ReactNode, className?: string }) {
    const [inputValue, setInputValue] = useState(value.toString())

    useEffect(() => {
        setInputValue(value.toString())
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    /**
     * Commit the value to the onChange callback    
     * If the value is not a number, reset the input value to the current value
     * If the value is out of bounds, reset the input value to the current value
     * If the value is the same as the current value, do nothing
     * Otherwise, update the input value and call onChange
     * 
     * @returns void
     */
    const handleCommit = () => {
        const newValue = parseFloat(inputValue)
        if (isNaN(newValue)) {
            setInputValue(value.toString())
            return;
        }

        const clampedValue = Math.min(max ?? newValue, Math.max(min ?? newValue, newValue))
        setInputValue(clampedValue.toString())
        onChange(clampedValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCommit()
            e.currentTarget.blur()
        }
    }
    return (
        <div className={"relative h-fit " + (className ?? "w-28")}>
            <input
                type="number"
                value={inputValue}
                onChange={handleChange} onKeyDown={handleKeyDown}
                onBlur={handleCommit}
                min={min}
                max={max}
                className='h-fit w-full rounded-lg border border-[#f5f5f5] bg-[#f5f5f5] px-2 py-1 pl-6 text-xs hover:border-[#e8e8e8]'
            />
            {React.isValidElement(icon) && icon.type === "p" ? (
                <p className="absolute left-2 top-[50%] -translate-y-1/2 text-[10px] text-gray-400">
                    {
                        (icon as React.ReactElement<{ children: React.ReactNode }>).props
                            .children
                    }
                </p>
            ) : (
                React.cloneElement(icon as React.ReactElement<{ className: string }>, {
                    className: "absolute left-1.5 top-[50%] h-3 w-3 -translate-y-1/2 text-gray-400",
                })
            )}
        </div>
    )
}
