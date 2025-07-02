import styled, { keyframes } from "styled-components"
import { Link } from "react-router-dom"

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
  height: 94%;
  display: flex;
`

const NavBar = styled.div`
  border-right: 1px solid #64f8;
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  overflow-y: auto;
  flex: 22;
`

const GridItem = styled.div`
  border: solid 1px white;
  padding: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 300ms ease-in-out;

  &:hover {
    cursor: pointer;
    filter: brightness(108%);
    background-color: #64f8;
  }

  img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: contain;
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

  input,
  select {
    margin: 10px 0;
  }

  h1 {
    font-weight: 400;
    font-size: 2rem;
    color: #9b9bff;
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
  top: 0.2rem;
  right: 1rem;
  background: none;
  color: #fafafa;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #ff6b6b;
  }
`

const ReturnButton = styled.button`
  background-color: #b2f2bb;
  height: 2rem;
  border: none;
  border-radius: 5px;
  color: #242424;
  margin: 10px;
`

const CancelButton = styled(ReturnButton)`
  background-color: #ff6b6b;
`

const EditButton = styled(ReturnButton)`
  background-color: #fafafa;
  position: absolute;
  top: 0.2rem;
  left: 1rem;
`

export {
  Status,
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
  Wrapper,
  ReturnButton,
  EditButton,
  CancelButton,
}
