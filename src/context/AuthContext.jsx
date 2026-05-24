import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../firebase/firebase.js'

const AuthContext = createContext(null)

async function fetchAdminProfile(uid) {
  const ref = doc(db, 'admins', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data()
  if (data?.disabled) return null
  return { uid, ...data }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [adminProfile, setAdminProfile] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [roleStatus, setRoleStatus] = useState(
    isFirebaseConfigured ? 'loading' : 'unconfigured',
  )
  const [roleError, setRoleError] = useState('')

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) return () => {}

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (nextUser) {
        console.log('[AuthContext] Detected user:', {
          email: nextUser.email,
          uid: nextUser.uid,
        })
      } else {
        console.log('[AuthContext] No user detected')
      }
      setLoading(true)
      setRoleStatus('loading')
      setRoleError('')
      try {
        if (!nextUser) {
          setAdminProfile(null)
          setRoleStatus('signedOut')
          console.log('[AuthContext] No user signed in')
          return
        }
        const profile = await fetchAdminProfile(nextUser.uid)
        if (!profile) {
          setAdminProfile(null)
          setRoleStatus('unauthorized')
          console.log('[AuthContext] User is not admin:', nextUser.email, nextUser.uid)
          return
        }
        setAdminProfile(profile)
        setRoleStatus('admin')
        console.log('[AuthContext] Admin signed in:', nextUser.email, nextUser.uid)
      } catch (e) {
        setAdminProfile(null)
        setRoleStatus('error')
        setRoleError(e?.message || 'Failed to load admin profile')
        console.error('[AuthContext] Error loading admin profile:', e)
      } finally {
        setLoading(false)
        console.log('[AuthContext] State:', {
          user: nextUser,
          adminProfile,
          roleStatus,
        })
      }
    })
    return () => unsub()
  }, [])

  const value = useMemo(() => {
    return {
      user,
      adminProfile,
      isAdmin: Boolean(user && adminProfile),
      loading,
      roleStatus,
      roleError,
      logout: () => signOut(auth),
    }
  }, [adminProfile, loading, roleError, roleStatus, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

