import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { userContext } from '../context/userContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { user, setUser } = useContext(userContext)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'AI Chat | Login'

    if (user) {
      setSuccess(`Already signed in as ${user.userName || user.email}. Redirecting...`)
      const redirect = setTimeout(() => navigate('/'), 1200)
      return () => clearTimeout(redirect)
    }
  }, [user, navigate])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const formFields = useMemo(
    () => [
      {
        id: 'email',
        type: 'email',
        placeholder: 'Enter your email',
        value: email,
        onChange: (e) => setEmail(e.target.value),
      },
      {
        id: 'password',
        type: showPassword ? 'text' : 'password',
        placeholder: 'Enter your password',
        value: password,
        onChange: (e) => setPassword(e.target.value),
      },
    ],
    [email, password, showPassword]
  )

  const loginUser = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!email || !password) {
      setError('Email and password are required.')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/user/login',
        { email, password },
        { withCredentials: true }
      )

      setUser(response.data.user)
      setSuccess('Login successful! Redirecting...')
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to login. Please try again.'
      setError(message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen w-screen bg-[#1E1E1E] text-white relative'>
      

      <form
        className='bg-[#202123] lg:h-[460px] lg:w-[420px] absolute top-[15%] ml-[25%] lg:ml-[38%] rounded-lg flex flex-col pt-10 items-center gap-4 h-auto w-[240px] p-4'
        onSubmit={loginUser}
      >
        <div className='text-center'>
          <p className='text-sm text-slate-400'>{greeting}</p>
          <h1 className='lg:text-5xl text-2xl font-bold lg:pb-8 pb-2'>Login</h1>
        </div>

        {success && <p className='text-green-400 text-sm'>{success}</p>}
        {error && <p className='text-red-400 text-sm'>{error}</p>}

        {formFields.map((field) => (
          <div key={field.id} className='w-full flex flex-col items-center gap-2'>
            <input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              className='bg-white text-[12px] lg:text-[15px] rounded-lg lg:w-72 lg:h-10 p-3 border-neutral-50 h-[38px] w-full text-black'
              value={field.value}
              onChange={field.onChange}
            />
            {field.id === 'password' && (
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='text-xs text-blue-300 hover:text-blue-200 self-end pr-3'
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            )}
          </div>
        ))}

        <button
          type='submit'
          disabled={loading}
          className='bg-blue-500 cursor-pointer lg:w-72 lg:h-10 rounded-xl font-medium mt-2 hover:bg-blue-400 h-10 w-full text-[12px] lg:text-[15px] disabled:opacity-50'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className='lg:text-sm text-[11px] text-slate-300'>
          Don&apos;t have an account?
          <Link to={'/signup'} className='text-blue-400 cursor-pointer ml-1'>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
