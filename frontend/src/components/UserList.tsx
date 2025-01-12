import { useState, useEffect } from "react"
import { HStack, TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"

import UserAction from "./UserAction"
import { User } from "@/hooks/useUser"

interface Props {
  users: User[]
}

function UserList({ users }: Props) {
  // initial value is the token in local storage, which would be null if not present
  const [storedToken, setStoredToken] = useState<string | null>(localStorage.getItem("token"));

  const handleLoginFirst = () => {
    window.alert("You need to login first");
  }

  // Monitor token changes
  useEffect(() => {
    // callback function (event handler) will set the the token in state to the token in local storage
    const handleTokenChange = () => {
      setStoredToken(localStorage.getItem("token"));
    };

    // Listen to custom "token-change" events
    window.addEventListener("token-change", handleTokenChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("token-change", handleTokenChange);
    };
  }, []);

  return (
    <>
      <TableRoot size="lg" interactive>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Name</TableColumnHeader>
            <TableColumnHeader>Email</TableColumnHeader>
            <TableColumnHeader>Role</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isAdmin == true ? "Admin" : "Staff"}</TableCell>
              {/* if token present, use TableCell UserAction, else use TableCell of Edit and Delete buttons which are dimm */}
              {storedToken ?
                (<TableCell textAlign="end"><UserAction user={user} /></TableCell>)
                :
                (<TableCell textAlign="end">
                  <HStack>
                    <Button variant="plain" color="gray" onClick={() => handleLoginFirst()}>
                      Edit
                    </Button>
                    <Button variant="plain" color="gray" onClick={() => handleLoginFirst()}>
                      Delete
                    </Button>
                  </HStack>
                </TableCell>)
              }
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </>
  )
}

export default UserList