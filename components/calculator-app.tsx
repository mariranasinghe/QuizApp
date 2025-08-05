"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface CalculatorAppProps {
  onClose: () => void
}

// Helper for factorial calculation
const factorial = (n: number): number => {
  if (n < 0) return Number.NaN // Factorial not defined for negative numbers
  if (n === 0) return 1
  let result = 1
  for (let i = 1; i <= n; i++) {
    result *= i
  }
  return result
}

export function CalculatorApp({ onClose }: CalculatorAppProps) {
  const [displayValue, setDisplayValue] = useState("0")
  const [currentValue, setCurrentValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [isScientificMode, setIsScientificMode] = useState(false)
  const [lastOperationWasEquals, setLastOperationWasEquals] = useState(false)
  const [equationHistory, setEquationHistory] = useState("") // New state for equation history

  const clearAll = useCallback(() => {
    setDisplayValue("0")
    setCurrentValue(null)
    setOperator(null)
    setPreviousValue(null)
    setWaitingForSecondOperand(false)
    setLastOperationWasEquals(false)
    setEquationHistory("") // Clear history
  }, [])

  const inputDigit = useCallback(
    (digit: string) => {
      if (lastOperationWasEquals) {
        setDisplayValue(digit)
        setCurrentValue(Number.parseFloat(digit))
        setEquationHistory("") // Start new history
        setLastOperationWasEquals(false)
        setWaitingForSecondOperand(false)
        return
      }

      if (waitingForSecondOperand) {
        setDisplayValue(digit)
        setCurrentValue(Number.parseFloat(digit))
        setWaitingForSecondOperand(false)
      } else {
        setDisplayValue(displayValue === "0" ? digit : displayValue + digit)
        setCurrentValue(Number.parseFloat(displayValue === "0" ? digit : displayValue + digit))
      }
    },
    [displayValue, waitingForSecondOperand, lastOperationWasEquals],
  )

  const inputDecimal = useCallback(() => {
    if (lastOperationWasEquals) {
      setDisplayValue("0.")
      setCurrentValue(0)
      setEquationHistory("0.") // Start new history
      setLastOperationWasEquals(false)
      setWaitingForSecondOperand(false)
      return
    }

    if (waitingForSecondOperand) {
      setDisplayValue("0.")
      setCurrentValue(0)
      setWaitingForSecondOperand(false)
      return
    }

    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".")
    }
  }, [displayValue, waitingForSecondOperand, lastOperationWasEquals])

  const toggleSign = useCallback(() => {
    const val = Number.parseFloat(displayValue)
    if (!isNaN(val)) {
      const newDisplay = (val * -1).toString()
      setDisplayValue(newDisplay)
      setCurrentValue(val * -1)
      // For simplicity, sign change doesn't alter equation history, only current display
    }
  }, [displayValue])

  const inputPercent = useCallback(() => {
    const val = Number.parseFloat(displayValue)
    if (!isNaN(val)) {
      const newDisplay = (val / 100).toString()
      setDisplayValue(newDisplay)
      setCurrentValue(val / 100)
      // For simplicity, percentage doesn't alter equation history, only current display
    }
  }, [displayValue])

  const calculate = (op: string, num1: number, num2: number): number => {
    switch (op) {
      case "+":
        return num1 + num2
      case "-":
        return num1 - num2
      case "*":
        return num1 * num2
      case "/":
        if (num2 === 0) {
          setDisplayValue("Error: Div by 0")
          return Number.NaN
        }
        return num1 / num2
      case "^":
        return Math.pow(num1, num2)
      default:
        return num2
    }
  }

  const performOperation = useCallback(
    (nextOperator: string) => {
      const inputValue = Number.parseFloat(displayValue)

      if (previousValue === null) {
        setPreviousValue(inputValue)
        setEquationHistory(`${inputValue} ${nextOperator} `)
      } else if (operator) {
        const result = calculate(operator, previousValue, inputValue)
        if (isNaN(result)) {
          // Error message already set by calculate
          clearAll() // Reset calculator on error
          return
        }
        setDisplayValue(result.toString())
        setCurrentValue(result)
        setPreviousValue(result)
        setEquationHistory(`${result} ${nextOperator} `)
      } else {
        // Case where an operator is pressed after an equals operation
        setPreviousValue(inputValue)
        setEquationHistory(`${inputValue} ${nextOperator} `)
      }

      setWaitingForSecondOperand(true)
      setOperator(nextOperator)
      setLastOperationWasEquals(false)
    },
    [displayValue, previousValue, operator, clearAll],
  )

  const handleEquals = useCallback(() => {
    if (operator && previousValue !== null) {
      const inputValue = Number.parseFloat(displayValue)
      const result = calculate(operator, previousValue, inputValue)
      if (isNaN(result)) {
        // Error message already set by calculate
        clearAll() // Reset calculator on error
        return
      }
      setEquationHistory(`${previousValue} ${operator} ${inputValue} = `) // Show full equation
      setDisplayValue(result.toString())
      setCurrentValue(result)
      setPreviousValue(null) // Reset previous value for new calculation
      setOperator(null) // Clear operator
      setWaitingForSecondOperand(false)
      setLastOperationWasEquals(true)
    }
  }, [displayValue, operator, previousValue, clearAll])

  const handleScientificFunction = useCallback(
    (funcName: string) => {
      const val = Number.parseFloat(displayValue)
      if (isNaN(val)) {
        setDisplayValue("Error")
        setCurrentValue(null)
        setEquationHistory("")
        return
      }

      let result: number | string = val
      try {
        switch (funcName) {
          case "sin":
            result = Math.sin(val * (Math.PI / 180)) // Assume degrees for user input
            break
          case "cos":
            result = Math.cos(val * (Math.PI / 180)) // Assume degrees
            break
          case "tan":
            if (Math.abs(Math.cos(val * (Math.PI / 180))) < 1e-9) {
              result = "Error: Undefined" // tan(90) etc.
            } else {
              result = Math.tan(val * (Math.PI / 180)) // Assume degrees
            }
            break
          case "log":
            if (val <= 0) result = "Error: Log of non-positive"
            else result = Math.log10(val)
            break
          case "ln":
            if (val <= 0) result = "Error: Ln of non-positive"
            else result = Math.log(val)
            break
          case "sqrt":
            if (val < 0) result = "Error: Sqrt of negative"
            else result = Math.sqrt(val)
            break
          case "x^2":
            result = val * val
            break
          case "fact":
            if (val < 0 || !Number.isInteger(val)) {
              result = "Error: Invalid input"
            } else {
              result = factorial(val)
            }
            break
          case "pi":
            result = Math.PI
            break
          case "e":
            result = Math.E
            break
          default:
            break
        }
        if (typeof result === "number" && !isNaN(result)) {
          setDisplayValue(result.toPrecision(10)) // Use toPrecision for scientific numbers
          setCurrentValue(result)
          setEquationHistory(`${funcName}(${val}) = `) // Show function and result in history
        } else if (typeof result === "string") {
          setDisplayValue(result)
          setCurrentValue(null)
          setEquationHistory("") // Clear history on error
        }
      } catch (e) {
        setDisplayValue("Error")
        setCurrentValue(null)
        setEquationHistory("")
      }
      setLastOperationWasEquals(true) // Treat scientific functions as ending an operation
      setWaitingForSecondOperand(false)
    },
    [displayValue],
  )

  const buttonClass =
    "flex items-center justify-center rounded-lg text-2xl font-semibold transition-colors duration-200 h-16 w-full"
  const operatorClass = "bg-orange-500 hover:bg-orange-600 text-white"
  const functionClass =
    "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-50"
  const digitClass =
    "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-50"
  const equalsClass = "bg-blue-600 hover:bg-blue-700 text-white col-span-2" // For basic layout

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800 flex flex-col">
        <CardHeader className="relative pb-4">
          <CardTitle className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
            Calculator 🧮
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
            onClick={onClose}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to Apps</span>
          </Button>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-6 pt-0">
          <div className="bg-gray-900 dark:bg-black text-white text-right p-4 mb-4 rounded-lg overflow-hidden">
            <div className="text-xl text-gray-400 dark:text-gray-500 h-6 overflow-hidden whitespace-nowrap">
              {equationHistory}
            </div>
            <div className="text-4xl font-bold min-h-[48px] flex items-center justify-end">
              {displayValue.length > 12 ? Number.parseFloat(displayValue).toExponential(5) : displayValue}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {isScientificMode && (
              <>
                <Button className={functionClass} onClick={() => handleScientificFunction("sin")}>
                  sin
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("cos")}>
                  cos
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("tan")}>
                  tan
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("x^2")}>
                  x²
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("log")}>
                  log
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("ln")}>
                  ln
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("sqrt")}>
                  √
                </Button>
                <Button className={operatorClass} onClick={() => performOperation("^")}>
                  xʸ
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("fact")}>
                  x!
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("pi")}>
                  π
                </Button>
                <Button className={functionClass} onClick={() => handleScientificFunction("e")}>
                  e
                </Button>
                <div className="col-span-1"></div> {/* Empty space for alignment */}
              </>
            )}

            <Button className={functionClass} onClick={clearAll}>
              AC
            </Button>
            <Button className={functionClass} onClick={toggleSign}>
              +/-
            </Button>
            <Button className={functionClass} onClick={inputPercent}>
              %
            </Button>
            <Button className={operatorClass} onClick={() => performOperation("/")}>
              ÷
            </Button>

            <Button className={digitClass} onClick={() => inputDigit("7")}>
              7
            </Button>
            <Button className={digitClass} onClick={() => inputDigit("8")}>
              8
            </Button>
            <Button className={digitClass} onClick={() => inputDigit("9")}>
              9
            </Button>
            <Button className={operatorClass} onClick={() => performOperation("*")}>
              ×
            </Button>

            <Button className={digitClass} onClick={() => inputDigit("4")}>
              4
            </Button>
            <Button className={digitClass} onClick={() => inputDigit("5")}>
              5
            </Button>
            <Button className={digitClass} onClick={() => inputDigit("6")}>
              6
            </Button>
            <Button className={operatorClass} onClick={() => performOperation("-")}>
              -
            </Button>

            <Button className={digitClass} onClick={() => inputDigit("1")}>
              1
            </Button>
            <Button className={digitClass} onClick={() => inputDigit("2")}>
              2
            </Button>
            <Button className={digitClass} onClick={() => inputDigit("3")}>
              3
            </Button>
            <Button className={operatorClass} onClick={() => performOperation("+")}>
              +
            </Button>

            <Button className={`${digitClass} col-span-2`} onClick={() => inputDigit("0")}>
              0
            </Button>
            <Button className={digitClass} onClick={inputDecimal}>
              .
            </Button>
            <Button className={equalsClass} onClick={handleEquals}>
              =
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Button
              onClick={() => setIsScientificMode(!isScientificMode)}
              variant="outline"
              className="w-full h-12 text-lg bg-transparent"
            >
              {isScientificMode ? "Basic Mode" : "Scientific Mode"}
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full h-12 text-lg bg-transparent">
              Back to Apps
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
