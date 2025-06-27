import styled from "styled-components"
import axios from "axios"
import { useEffect, useState } from "react"
import itemIcon from "./assets/itemIcon.png"

function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/items")
        setItems(response.data)
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <Wrapper>
      <SearchContainer>
        <SearchBar placeholder='Pesquisar item...' />

        <FilterButton>Filtrar</FilterButton>
      </SearchContainer>
      <MainContainer>
        <NavBar>
          <NavButton>Gerenciar Itens</NavButton>
          <NavButton>Gerenciar Usuários</NavButton>
        </NavBar>
        <ItemsGrid>{renderItems(items)}</ItemsGrid>
      </MainContainer>
    </Wrapper>
  )
}

function renderItems(items) {
  return items.map((item) => (
    <GridItem key={item.id}>
      <img src={item.imagem_URL ? item.imagem_URL : itemIcon} alt={item.item} />
    </GridItem>
  ))
}

const Wrapper = styled.div`
  border: 2px solid lime;
  width: 80%;
  margin: 3rem auto;
  height: 80vh;
`

const SearchContainer = styled.div`
  border: 2px solid red;
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
  border: 2px solid cyan;
  height: 94%;
  display: flex;
`

const NavBar = styled.div`
  border: 2px solid yellow;
  width: 12%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NavButton = styled.button`
  color: #fafafa;
  border-radius: 0.5rem;
  background-color: #64f8;
  width: 8rem;
  font-size: 1rem;
  border: none;
  margin: 2rem 0;
  padding: 1rem;
`

const ItemsGrid = styled.div`
  border: 2px solid blue;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  overflow-y: auto;
  width: 88%;
`

const GridItem = styled.div`
  border: solid 1px yellow; //FIXME

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

    border: solid 1px cyan; //FIXME
  }
`

export default Home
