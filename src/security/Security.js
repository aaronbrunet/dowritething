import firebase, { auth, provider, firestore } from '../firebase/firebase.js'

//Auth
export function SignIn(props) {
    const signInAuth = () => {  
      console.log(auth.currentUser)
      console.log('attempting signin')    
        firebase.auth().signInWithPopup(provider).then(function(){          
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
      <button
      className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-spring-wood-600 hover:bg-spring-wood-800 focus:shadow-outline focus:outline-none"
      aria-label= {props.override ? `${props.override}` : `Sign In`}
      title= {props.override ? `${props.override}` : `Sign In`}
      onClick={signInAuth}
    >
      {props.override ? `${props.override}` : `Sign In`}
      </button>
    )
  }

  export function SignOut() {  
    return auth.currentUser && (<>
    <button
                className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-spring-wood-600 hover:bg-spring-wood-800 focus:shadow-outline focus:outline-none"
                aria-label="Sign out"
                title="Sign out"
                onClick={() => auth.signOut()}
              >
                 Sign Out
              </button>
    </>)
  }