import { Switch } from "@/components/ui/switch"
import { useColorMode } from './ui/color-mode'

function DarkMode() {
    // userColorMode for toggling dark mode
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Switch checked={colorMode === 'dark'} onCheckedChange={toggleColorMode} colorPalette='green'>Dark Mode</Switch>
    )
}

export default DarkMode