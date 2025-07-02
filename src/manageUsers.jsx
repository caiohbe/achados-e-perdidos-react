import { useEffect, useState } from "react"
import axios from "axios"
import {
  FilterButton,
  ModalOverlay,
  ModalContent,
  CloseButton,
  ReturnButton,
  CancelButton,
  Wrapper,
  Label,
  MainContainer,
  UserList,
  NavBar,
  NavButton,
  SearchContainer,
  SearchBar,
} from "./styles"

import { useDebounce } from "./home"

function ManageUsers() {
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUser, setSelectedUser] = useState({
    id: null,
    nome: "",
    cpf: "",
    email: "",
  })
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    fetchUsers()
  }, [debouncedSearch])

  async function fetchUsers() {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3000/users", {
        params: { search: debouncedSearch },
      })
      setUsers(res.data)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar usuários")
    } finally {
      setLoading(false)
    }
  }

  function openNewUserModal() {
    setSelectedUser({ id: null, nome: "", cpf: "", email: "" })
    setIsEditing(false)
    setIsModalOpen(true)
  }

  function openEditUserModal(user) {
    setSelectedUser(user)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  async function saveUser() {
    try {
      const payload = {
        nome: selectedUser.nome,
        cpf: selectedUser.cpf,
        email: selectedUser.email,
      }

      if (isEditing) {
        await axios.patch(
          `http://localhost:3000/users/${selectedUser.id}`,
          payload
        )
        alert("Usuário atualizado!")
      } else {
        await axios.post(`http://localhost:3000/users`, payload)
        alert("Usuário criado!")
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar usuário")
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm("Tem certeza que quer remover este usuário?")) return
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`)
      alert("Usuário removido!")
      fetchUsers()
    } catch (err) {
      console.error(err)
      alert("Erro ao remover usuário")
    }
  }

  return (
    <Wrapper>
      <SearchContainer>
        <SearchBar
          type='text'
          placeholder='Pesquisar por nome...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchContainer>

      <MainContainer>
        <NavBar>
          <NavButton to={"/"}>Gerenciar Itens</NavButton>
          <NavButton to={"/places"}>Gerenciar Locais</NavButton>
        </NavBar>
        <UserList>
          <h1 style={{ textAlign: "center" }}>Usuários</h1>
          <FilterButton onClick={openNewUserModal}>Novo Usuário</FilterButton>

          {loading && <p>Carregando...</p>}
          {!loading && users.length === 0 && (
            <p style={{ marginTop: "1rem" }}>Nenhum usuário encontrado.</p>
          )}

          {!loading && users.length > 0 && (
            <table
              style={{ width: "100%", color: "#fafafa", marginTop: "1rem" }}
            >
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nome}</td>
                    <td>{u.cpf}</td>
                    <td>{u.email}</td>
                    <td>
                      <FilterButton onClick={() => openEditUserModal(u)}>
                        Editar
                      </FilterButton>
                      <CancelButton onClick={() => deleteUser(u.id)}>
                        Remover
                      </CancelButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isModalOpen && (
            <ModalOverlay>
              <ModalContent>
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  &times;
                </CloseButton>

                <h1>{isEditing ? "Editar Usuário" : "Novo Usuário"}</h1>

                <label>
                  <Label>Nome:</Label>
                  <input
                    value={selectedUser.nome}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, nome: e.target.value })
                    }
                  />
                </label>
                <br />
                <label>
                  <Label>CPF:</Label>
                  <input
                    value={selectedUser.cpf}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, cpf: e.target.value })
                    }
                  />
                </label>
                <br />
                <label>
                  <Label>Email:</Label>
                  <input
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                </label>
                <br />

                <ReturnButton onClick={saveUser}>
                  {isEditing ? "Salvar Alterações" : "Criar Usuário"}
                </ReturnButton>
              </ModalContent>
            </ModalOverlay>
          )}
        </UserList>
      </MainContainer>
    </Wrapper>
  )
}

export default ManageUsers
