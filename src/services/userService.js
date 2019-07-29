import { localStorageWrapper } from './helpers'


const NAMESPACE = 'users'

const userService = {
    insert: (user) => {
        
        const users = localStorageWrapper.get(NAMESPACE) || {}
        users = (users || []).concat({
            ...user,
            
        })

        localStorageWrapper.set(NAMESPACE, users)
        return true
    },
    get: (recipeSlug) => (localStorageWrapper.get(NAMESPACE) || {})[recipeSlug] || [],
    delete: (recipeSlug, target) => {
      

        const users = localStorageWrapper.get(NAMESPACE) || {}
        users= (users || []).filter(user => target.date !== user.date)
        localStorageWrapper.set(NAMESPACE, users)
        return true
    }
}

export default userService