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
  children: React.ReactNode
  data: any
}

// The <pre> HTML element stands for preformatted text. 
// It is used to display text exactly as it is written in the HTML source code, 
// preserving white spaces, line breaks, and formatting.
const JsonViewer = ({ data }: { data: any }) => (
  <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 2)}</pre>
);

const Dialog = ({ children, data }: Props) => {
  // MANUAL FORMATTING
  // const json = JSON.stringify(data, null, 2);
  // const lines = json.split("\n");

  return (
    <DialogRoot size="cover" placement="center" motionPreset="slide-in-bottom">
      <DialogTrigger asChild>
        <Button variant="plain" _hover={{ color: "cyan" }} color="blue">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Movie Details</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          <JsonViewer data={data} />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export default Dialog