import styled, { keyframes } from "styled-components"
import axios from "axios"
import { useEffect, useState } from "react"
import itemIcon from "./assets/itemIcon.png"
import { Link } from "react-router-dom"
import dayjs from "dayjs"

function Home() {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    fetchData(setItems)
  }, [])

  return (
    <Wrapper>
      <SearchContainer>
        <SearchBar placeholder='Pesquisar item...' />
        <FilterButton>Filtrar</FilterButton>
      </SearchContainer>

      <MainContainer>
        <NavBar>
          <NavButton to={"/manage/items"}>Gerenciar Itens</NavButton>
          <NavButton to={"/manage/users"}>Gerenciar Usuários</NavButton>
        </NavBar>
        <ItemsGrid>
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
          {renderItems(items, setSelectedItem)}
        </ItemsGrid>
      </MainContainer>

      {selectedItem && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setSelectedItem(null)}>
              &times;
            </CloseButton>
            <p onClick={() => console.log(selectedItem)}>
              <Label>Item:</Label> {selectedItem.item}
            </p>
            <p>
              <Label>Descrição:</Label> {selectedItem.descricao}
            </p>
            <p>
              <Label>Data encontrado: </Label>
              {dayjs(selectedItem.data_encontrado).format("DD/MM/YYYY")}
            </p>
            <p>
              <Label> Local encontrado:</Label>{" "}
              {selectedItem.local_encontrado.nome}
            </p>
            <p>
              {selectedItem.usuario_devolvido ? (
                <>
                  <Label>Devolvido a:</Label>{" "}
                  {selectedItem.usuario_devolvido.nome} CPF:{" "}
                  {selectedItem.usuario_devolvido.cpf}
                </>
              ) : (
                <Status>Item não devolvido</Status>
              )}
            </p>
            <img
              src={selectedItem.imagem_URL ? selectedItem.imagem_URL : itemIcon}
              alt={selectedItem.item}
            />
            {/* Você pode colocar mais infos aqui */}
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

async function fetchData(setItems) {
  try {
    const response = await axios.get("http://localhost:3000/items")
    setItems(response.data)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

const Wrapper = styled.div`
  border: 3px solid #64f8;
  width: 80%;
  margin: 3rem auto;
  height: 80vh;
  border-radius: 5px;
`

const SearchContainer = styled.div`
  border-bottom: 1px solid #64f8;
  height: 6%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const SearchBar = styled.input`
  font-size: 1.3rem;
  color: #fafafa;
  width: 24rem;
  border: 1px solid #64f8;
  border-radius: 2px;
  background-color: #242424;
  padding: 0 0.5rem;
`

const FilterButton = styled.button`
  font-size: 1.3rem;
  color: #fafafa;
  border: 1px solid #64f8;
  border-radius: 2px;
  background-color: #242424;
  padding: 0 0.5rem;
`

const MainContainer = styled.div`
  //border: 2px solid cyan;
  height: 94%;
  display: flex;
`

const NavBar = styled.div`
  border-right: 1px solid #64f8;
  width: 12%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NavButton = styled(Link)`
  color: #fafafa;
  border-radius: 0.5rem;
  background-color: #64f8;
  width: 8rem;
  font-size: 1rem;
  border: none;
  margin: 2rem 0;
  padding: 0.7rem;
  text-align: center;
  text-decoration: none;
  transition: 150ms;

  &&:hover {
    filter: brightness(115%);
  }
`

const ItemsGrid = styled.div`
  //border: 2px solid blue;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  overflow-y: auto;
  width: 88%;
`

const GridItem = styled.div`
  border: solid 1px white; //FIXME
  padding: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 300ms ease-in-out;

  &:hover {
    cursor: pointer;
    filter: brightness(108%); //FIXME make this a variable to change with themes
  }

  img {
    width: ${(props) => (props.$width ? props.$width : "100%")};
    aspect-ratio: 2/3;
    object-fit: contain;
    //border: solid 1px cyan; //FIXME
    border-radius: 10px;
  }
`
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: #242424;
  color: #fafafa;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;

  img {
    margin-top: 10px;
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 5px;
  }
`

const Label = styled.span`
  color: #9b9bff;
  font-weight: bold;
`

const Status = styled.span`
  color: #ff6b6b;
  font-weight: bold;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  color: #fafafa;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #64f8;
  }
`

export default Home
