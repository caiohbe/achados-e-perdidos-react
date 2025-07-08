import axios from "axios"
import { useEffect, useState } from "react"
import itemIcon from "./assets/itemIcon.png"
import {
  Wrapper,
  CloseButton,
  FilterButton,
  GridItem,
  ItemsGrid,
  Label,
  MainContainer,
  ModalContent,
  ModalOverlay,
  NavBar,
  NavButton,
  SearchBar,
  SearchContainer,
  Status,
  ReturnButton,
  EditButton,
  CancelButton,
} from "./styles"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

function Home() {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 500)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filter, setFilter] = useState({
    userId: "",
    localId: "",
    date: "",
  })
  const [users, setUsers] = useState([])
  const [locais, setLocais] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newItem, setNewItem] = useState({
    item: "",
    descricao: "",
    imagem_URL: "",
    data_encontrado: "",
    local_encontrado_id: "",
  })

  useEffect(() => {
    async function fetchOptions() {
      const usersRes = await axios.get("http://localhost:3000/users")
      const locaisRes = await axios.get("http://localhost:3000/locais")

      setUsers(usersRes.data)
      setLocais(locaisRes.data)
    }

    fetchOptions()
  }, [])

  useEffect(() => {
    async function loadItems() {
      setLoading(true)
      try {
        const data = await fetchItems(debouncedSearch)
        setItems(data)
      } catch (error) {
        console.error("Erro ao buscar itens:", error)
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [debouncedSearch])

  return (
    <Wrapper>
      <SearchContainer>
        <SearchBar
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Pesquisar item...'
        />
        {loading && <p>Carregando...</p>}
        {!loading && items.length === 0 && <p>Nenhum item encontrado.</p>}
        <FilterButton onClick={() => setIsFilterModalOpen(true)}>
          Filtrar
        </FilterButton>
        {isFilterModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={() => setIsFilterModalOpen(false)}>
                &times;
              </CloseButton>
              <h1>Filtrar Itens</h1>
              <label>
                Usuário devolvido: <br />
                <select
                  value={filter.userId}
                  onChange={(e) =>
                    setFilter({ ...filter, userId: e.target.value })
                  }
                >
                  <option value=''>Qualquer</option>
                  <option value='none'>Nenhum</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nome} ({user.email})
                    </option>
                  ))}
                </select>
                <br />
              </label>
              <label>
                Local encontrado: <br />
                <select
                  value={filter.localId}
                  onChange={(e) =>
                    setFilter({ ...filter, localId: e.target.value })
                  }
                >
                  <option value=''>Todos</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.nome}
                    </option>
                  ))}
                </select>
                <br />
              </label>
              <label>
                Data encontrado: <br />
                <input
                  type='date'
                  value={filter.date}
                  onChange={(e) =>
                    setFilter({ ...filter, date: e.target.value })
                  }
                />
              </label>
              <br />
              <FilterButton
                onClick={() =>
                  handleAdvancedFilter(setItems, filter, setIsFilterModalOpen)
                }
              >
                Aplicar Filtro
              </FilterButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </SearchContainer>

      <MainContainer>
        <NavBar>
          <NavButton to={"/users"}>Gerenciar Usuários</NavButton>
          <NavButton to={"/places"}>Gerenciar Locais</NavButton>
        </NavBar>
        <ItemsGrid>
          <GridItem onClick={() => setIsCreating(true)}>
            <img
              src='https://cdn-icons-png.flaticon.com/512/5709/5709849.png'
              alt='addItem'
            />
          </GridItem>
          {renderItems(items, setSelectedItem)}
        </ItemsGrid>
      </MainContainer>

      {(selectedItem || isCreating) && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton
              onClick={() => {
                setIsEditing(false)
                setSelectedItem(null)
                setIsCreating(false)
                setNewItem({
                  item: "",
                  descricao: "",
                  imagem_URL: "",
                  data_encontrado: "",
                  local_encontrado_id: "",
                })
              }}
            >
              &times;
            </CloseButton>

            {isCreating ? (
              <>
                <label>
                  Item:
                  <input
                    value={newItem.item}
                    onChange={(e) =>
                      setNewItem({ ...newItem, item: e.target.value })
                    }
                  />
                </label>
                <br />
                <label>
                  Descrição:
                  <input
                    value={newItem.descricao}
                    onChange={(e) =>
                      setNewItem({ ...newItem, descricao: e.target.value })
                    }
                  />
                </label>
                <br />
                <label>
                  Imagem URL:
                  <input
                    value={newItem.imagem_URL}
                    onChange={(e) =>
                      setNewItem({ ...newItem, imagem_URL: e.target.value })
                    }
                  />
                </label>
                <br />
                <label>
                  Data encontrado:
                  <input
                    type='date'
                    value={newItem.data_encontrado}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        data_encontrado: e.target.value,
                      })
                    }
                  />
                </label>
                <br />
                <label>
                  Local encontrado:
                  <select
                    value={newItem.local_encontrado_id}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        local_encontrado_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value=''>Selecione</option>
                    {locais.map((local) => (
                      <option key={local.id} value={local.id}>
                        {local.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <br />
                <ReturnButton
                  onClick={async () => {
                    try {
                      await axios.post(`http://localhost:3000/items`, {
                        ...newItem,
                        data_encontrado: new Date(newItem.data_encontrado),
                      })
                      const updated = await fetchItems(debouncedSearch)
                      setItems(updated)
                      setIsCreating(false)
                      setNewItem({
                        item: "",
                        descricao: "",
                        imagem_URL: "",
                        data_encontrado: "",
                        local_encontrado_id: "",
                      })
                      alert("Item criado com sucesso!")
                    } catch (err) {
                      console.error(err)
                      alert("Erro ao criar item.")
                    }
                  }}
                >
                  Adicionar Item
                </ReturnButton>
              </>
            ) : isEditing ? (
              <>
                <label>
                  Item:
                  <input
                    value={selectedItem.item}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        item: e.target.value,
                      })
                    }
                  />
                </label>
                <br />

                <label>
                  Descrição:
                  <input
                    value={selectedItem.descricao}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        descricao: e.target.value,
                      })
                    }
                  />
                </label>
                <br />

                <label>
                  Imagem URL:
                  <input
                    value={selectedItem.imagem_URL || ""}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        imagem_URL: e.target.value,
                      })
                    }
                  />
                </label>
                <br />

                <label>
                  Data encontrado:
                  <input
                    type='date'
                    value={dayjs(selectedItem.data_encontrado)
                      .utc()
                      .format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        data_encontrado: e.target.value,
                      })
                    }
                  />
                </label>
                <br />

                <label>
                  Local encontrado:
                  <select
                    value={selectedItem.local_encontrado.id}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        local_encontrado: locais.find(
                          (l) => l.id === Number(e.target.value)
                        ),
                        local_encontrado_id: Number(e.target.value),
                      })
                    }
                  >
                    {locais.map((local) => (
                      <option key={local.id} value={local.id}>
                        {local.nome}
                      </option>
                    ))}
                  </select>
                </label>
                <br />

                <label>
                  Devolvido a:
                  <select
                    value={
                      selectedItem.usuario_devolvido_id === null
                        ? "none"
                        : selectedItem.usuario_devolvido_id ||
                          selectedItem.usuario_devolvido?.id ||
                          ""
                    }
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        usuario_devolvido_id:
                          e.target.value === "none"
                            ? null
                            : Number(e.target.value),
                      })
                    }
                  >
                    <option value='none'>Nenhum</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nome} ({user.email})
                      </option>
                    ))}
                  </select>
                </label>
                <br />

                <ReturnButton
                  onClick={async () => {
                    try {
                      const updatePayload = {
                        item: selectedItem.item,
                        descricao: selectedItem.descricao,
                        imagem_URL: selectedItem.imagem_URL,
                        data_encontrado: new Date(selectedItem.data_encontrado),
                        local_encontrado_id: selectedItem.local_encontrado_id,
                        usuario_devolvido_id: selectedItem.usuario_devolvido_id,
                      }

                      await axios.patch(
                        `http://localhost:3000/items/${selectedItem.id}`,
                        updatePayload
                      )

                      const updated = await fetchItems(debouncedSearch)
                      setItems(updated)

                      alert("Item atualizado com sucesso!")
                      setIsEditing(false)
                      setSelectedItem(null)
                    } catch (err) {
                      console.error(err)
                      alert("Erro ao salvar alterações.")
                    }
                  }}
                >
                  Salvar Alterações
                </ReturnButton>

                <CancelButton onClick={() => setIsEditing(false)}>
                  Cancelar
                </CancelButton>
              </>
            ) : (
              <>
                <p>
                  <Label>Item:</Label> {selectedItem.item}
                </p>
                <p>
                  <Label>Descrição:</Label> {selectedItem.descricao}
                </p>
                <p>
                  <Label>Data encontrado:</Label>{" "}
                  {dayjs(selectedItem.data_encontrado)
                    .utc()
                    .format("DD/MM/YYYY")}
                </p>
                <p>
                  <Label>Local encontrado:</Label>{" "}
                  {selectedItem.local_encontrado.nome}
                </p>
                <p>
                  {selectedItem.usuario_devolvido ? (
                    <>
                      <Label>Devolvido a:</Label>{" "}
                      {selectedItem.usuario_devolvido.nome} (
                      {selectedItem.usuario_devolvido.email})
                    </>
                  ) : (
                    <Status>Item não devolvido</Status>
                  )}
                </p>

                <img
                  src={
                    selectedItem.imagem_URL ? selectedItem.imagem_URL : itemIcon
                  }
                  alt={selectedItem.item}
                />

                {selectedItem && !selectedItem.usuario_devolvido && (
                  <>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <option value=''>Escolha um usuário para devolver</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.nome} ({user.email})
                        </option>
                      ))}
                    </select>
                    <ReturnButton
                      onClick={async () => {
                        if (!selectedUser) {
                          alert("Selecione um usuário válido.")
                          return
                        }
                        try {
                          await axios.patch(
                            `http://localhost:3000/items/${selectedItem.id}`,
                            {
                              usuario_devolvido_id: +selectedUser,
                            }
                          )

                          const user = users.find(
                            (u) => u.id === parseInt(selectedUser)
                          )

                          setSelectedItem({
                            ...selectedItem,
                            usuario_devolvido: user,
                          })

                          const updated = await fetchItems(debouncedSearch)
                          setItems(updated)

                          alert("Item devolvido com sucesso!")
                        } catch (err) {
                          console.error("Erro ao devolver item:", err)
                          alert("Erro ao devolver item.")
                        }
                      }}
                    >
                      Devolver Item
                    </ReturnButton>
                  </>
                )}

                <EditButton onClick={() => setIsEditing(true)}>
                  Editar
                </EditButton>

                <CancelButton
                  onClick={async () => {
                    if (
                      window.confirm("Tem certeza que quer remover este item?")
                    ) {
                      await axios.delete(
                        `http://localhost:3000/items/${selectedItem.id}`
                      )
                      const updated = await fetchItems(debouncedSearch)
                      setItems(updated)
                      setSelectedItem(null)
                    }
                  }}
                >
                  Remover Item
                </CancelButton>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  )
}

function renderItems(items, setSelectedItem) {
  return items.map((item) => (
    <GridItem key={item.id} onClick={() => setSelectedItem(item)}>
      <img src={item.imagem_URL ? item.imagem_URL : itemIcon} alt={item.item} />
    </GridItem>
  ))
}

export async function fetchItems(search) {
  const res = await axios.get("http://localhost:3000/items", {
    params: { search },
  })
  return res.data
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

async function handleAdvancedFilter(setItems, filter, setIsFilterModalOpen) {
  try {
    const res = await axios.get("http://localhost:3000/items", {
      params: {
        userId: filter.userId,
        localId: filter.localId,
        date: filter.date,
      },
    })
    setItems(res.data)
    setIsFilterModalOpen(false)
  } catch (err) {
    console.error("Erro ao aplicar filtro:", err)
  }
}

export default Home
