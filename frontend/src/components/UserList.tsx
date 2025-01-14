import { TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from "@chakra-ui/react"

import UserAction from "./UserAction"
import { useUser } from "@/hooks/useUser";
import AlertMessage from "./AlertMessage";

function UserList() {
  const { users, error } = useUser();

  return (
    <>
      {error && <AlertMessage message={error} />}

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
              <TableCell textAlign="end"><UserAction user={user} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </>
  )
}

export default UserList