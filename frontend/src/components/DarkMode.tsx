import { Switch } from "@/components/ui/switch"
import { AiFillSun, AiOutlineSun, AiFillMoon, AiOutlineMoon } from "react-icons/ai";
import { useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { ColorModeButton, useColorMode, useColorModeValue } from "@/components/ui/color-mode"

function DarkMode() {
    // userColorMode for toggling dark mode
    const { colorMode, toggleColorMode } = useColorMode();
    const [status, setStatus] = useState(true);

    const handleToggle = () => {
        setStatus(!status);
        toggleColorMode();
    };

    return (
        <Box>
            <HStack>
                <Switch
                    checked={colorMode === 'dark'}
                    onCheckedChange={handleToggle}
                    colorPalette='green'
                />

                {status ? (
                    <AiOutlineSun size="30" onClick={handleToggle} />
                ) : (
                    <AiFillSun size="30" onClick={handleToggle} />
                )}
            </HStack>
        </Box>
    )
}

export default DarkMode