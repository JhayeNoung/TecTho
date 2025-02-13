import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
  children: React.ReactNode,
  document: string,
  action: string,
}

function Dialog({ children, document, action }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <DialogRoot initialFocusEl={() => ref.current}>
      <DialogTrigger asChild>
        <Button variant="plain" _hover={{ color: "cyan" }} color="blue">
          {action}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{document}{action}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          {children}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export default Dialog