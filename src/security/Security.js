import firebase, { auth, provider, firestore } from '../firebase/firebase.js'

//Auth
export function SignIn() {
    const signInAuth = () => {      
        auth.signInWithPopup(provider).then(function(){
          
          const userRef = firestore.collection('users').doc(auth.currentUser.uid)
          userRef.set({
            name: auth.currentUser.displayName,
            lastLogin: firebase.firestore.Timestamp.now(),
            id: auth.currentUser.uid
          }, { merge: true})
          console.log('Signed in!')
        }).catch(function(error) {
          console.error('Error logging in: '+error)
        })
        
    }  
    return (    
      <button onClick={signInAuth}>Sign in</button>
    )
  }

  export function SignOut() {  
    return auth.currentUser && (<>
      <button onClick={() => auth.signOut()}>Sign out</button>
    </>)
  }