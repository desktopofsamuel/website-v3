import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/lib/utils"

const buttonVariants = cva(
  "font-bold font-heading inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-md font-heading transition-all duration-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:no-underline",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 text-primary-500 shadow-xs hover:bg-primary-500 hover:text-white dark:bg-primary-800 dark:text-primary-500 dark:hover:bg-primary-700 dark:hover:text-primary-400",
        ghost:
          "bg-transparent text-primary-500 hover:bg-primary-100 hover:text-primary-500 dark:text-primary-400 dark:hover:bg-white/20 dark:hover:text-primary-300",
        outline:
          "bg-transparent border border-primary-200 text-primary-500 hover:border-primary-200 hover:text-primary-500 dark:border-primary-700 dark:text-primary-400 dark:hover:border-primary-600 dark:hover:text-primary-300",
        icon:
          "bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white dark:bg-primary-800 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-primary-300",
        brand:
          "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-400 dark:hover:bg-primary-300 dark:text-primary-900",
        disabled:
          "border border-yellow-200 text-gray-300 dark:border-primary-700 dark:text-primary-600 cursor-not-allowed",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || variant === "disabled"}
      {...props}
    />
  )
}

export { Button, buttonVariants }
