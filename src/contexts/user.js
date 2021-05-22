import  { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase'

export const UserContext = createContext()
export const UserContextProvider = (props) => {

    const [user, setUser] = useState(null)
    const [recipe, setRecipe] = useState(null)
    const [pending, setPending] = useState(true)

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        setUser(user)
        setPending(false)
      })
      
    }, [])

    if (pending) {
      return <>Loading </>
    }
  //Defines context that is provided in the userContextProvider
    return (
        <UserContext.Provider value={{ user: [user, setUser] , recipe: [recipe, setRecipe]}}>
            {props.children}
        </UserContext.Provider>
    )
}