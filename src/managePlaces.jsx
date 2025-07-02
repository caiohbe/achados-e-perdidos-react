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

function ManagePlaces() {
  const [places, setPlaces] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState({
    id: null,
    nome: "",
  })
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    fetchPlaces()
  }, [debouncedSearch])

  async function fetchPlaces() {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3000/locais", {
        params: { search: debouncedSearch },
      })
      setPlaces(res.data)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar locais")
    } finally {
      setLoading(false)
    }
  }

  function openNewPlaceModal() {
    setSelectedPlace({ id: null, nome: "" })
    setIsEditing(false)
    setIsModalOpen(true)
  }

  function openEditPlaceModal(place) {
    setSelectedPlace(place)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  async function savePlace() {
    try {
      const payload = {
        nome: selectedPlace.nome,
      }

      if (isEditing) {
        await axios.patch(
          `http://localhost:3000/locais/${selectedPlace.id}`,
          payload
        )
        alert("Local atualizado!")
      } else {
        await axios.post(`http://localhost:3000/locais`, payload)
        alert("Local criado!")
      }
      setIsModalOpen(false)
      fetchPlaces()
    } catch (err) {
      console.error(err)
      alert("Erro ao salvar local")
    }
  }

  async function deletePlace(placeId) {
    if (!window.confirm("Tem certeza que quer remover este local?")) return
    try {
      await axios.delete(`http://localhost:3000/locais/${placeId}`)
      alert("Local removido!")
      fetchPlaces()
    } catch (err) {
      console.error(err)
      alert("Erro ao remover local")
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
          <NavButton to={"/users"}>Gerenciar Usuários</NavButton>
        </NavBar>
        <UserList>
          <h1 style={{ textAlign: "center" }}>Locais</h1>
          <FilterButton onClick={openNewPlaceModal}>Novo Local</FilterButton>

          {loading && <p>Carregando...</p>}
          {!loading && places.length === 0 && (
            <p style={{ marginTop: "1rem" }}>Nenhum local encontrado.</p>
          )}

          {!loading && places.length > 0 && (
            <table
              style={{ width: "100%", color: "#fafafa", marginTop: "1rem" }}
            >
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>
                      <FilterButton onClick={() => openEditPlaceModal(p)}>
                        Editar
                      </FilterButton>
                      <CancelButton onClick={() => deletePlace(p.id)}>
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

                <h1>{isEditing ? "Editar Local" : "Novo Local"}</h1>

                <label>
                  <Label>Nome:</Label>
                  <input
                    value={selectedPlace.nome}
                    onChange={(e) =>
                      setSelectedPlace({
                        ...selectedPlace,
                        nome: e.target.value,
                      })
                    }
                  />
                </label>
                <br />

                <ReturnButton onClick={savePlace}>
                  {isEditing ? "Salvar Alterações" : "Criar Local"}
                </ReturnButton>
              </ModalContent>
            </ModalOverlay>
          )}
        </UserList>
      </MainContainer>
    </Wrapper>
  )
}

export default ManagePlaces
