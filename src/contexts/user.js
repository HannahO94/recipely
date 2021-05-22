import  { createContext, useState } from 'react'

export const UserContext = createContext()
export const UserContextProvider = (props) => {

    const [user, setUser] = useState(null)
    const [recipe, setRecipe] = useState([])

  //Defines context that is provided in the userContextProvider
    return (
        <UserContext.Provider value={{ user: [user, setUser] , recipe: [recipe, setRecipe]}}>
            {props.children}
        </UserContext.Provider>
    )
}