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
              <h1 onClick={() => console.log(new Date(filter.date))}>
                Filtrar Itens
              </h1>
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
                </select>{" "}
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
              </label>{" "}
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
          <NavButton to={"/manage/items"}>Gerenciar Itens</NavButton>
          <NavButton to={"/manage/users"}>Gerenciar Usuários</NavButton>
          <NavButton to={"/manage/places"}>Gerenciar Locais</NavButton>
        </NavBar>
        <ItemsGrid>{renderItems(items, setSelectedItem)}</ItemsGrid>
      </MainContainer>

      {selectedItem && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setSelectedItem(null)}>
              &times;
            </CloseButton>
            <p>
              <Label>Item:</Label> {selectedItem.item}
            </p>
            <p>
              <Label>Descrição:</Label> {selectedItem.descricao}
            </p>
            <p>
              <Label>Data encontrado: </Label>
              {dayjs.utc(selectedItem.data_encontrado).format("DD/MM/YYYY")}
            </p>
            <p>
              <Label>Local encontrado: </Label>
              {selectedItem.local_encontrado.nome}
            </p>
            <p>
              {selectedItem.usuario_devolvido ? (
                <>
                  <Label>Devolvido a: </Label>
                  {selectedItem.usuario_devolvido.nome} <br />
                  CPF: {selectedItem.usuario_devolvido.cpf} <br />
                  Email: {selectedItem.usuario_devolvido.email}
                </>
              ) : (
                <Status>Item não devolvido</Status>
              )}
            </p>
            <img
              src={selectedItem.imagem_URL ? selectedItem.imagem_URL : itemIcon}
              alt={selectedItem.item}
            />
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

function useDebounce(value, delay) {
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
