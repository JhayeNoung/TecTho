import { Table, TableBody, TableCell, TableColumnHeader, TableHeader, TableRoot, TableRow } from "@chakra-ui/react"

import { useUser } from "@/hooks/useUser";
import UserAction from "./UserAction"
import AlertMessage from "./AlertMessage";

function UserList() {
  const { users, error } = useUser();

  return (
    <>
      {error && <AlertMessage message={error} />}

      <Table.ScrollArea borderWidth="1px" rounded="md" height="560px">
        <TableRoot stickyHeader>
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
      </Table.ScrollArea>
    </>
  )
}

export default UserList