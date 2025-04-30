// React + Vite + Tailwind 登入/註冊 + MFA 驗證流程
import { useState, useEffect } from "react"
import './App.css'

const API_BASE = "https://api.shuyu-lin.com"

function App() {
  const storedToken = localStorage.getItem("accessToken") || ""
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mfaCode, setMfaCode] = useState("")
  const [step, setStep] = useState(storedToken ? "repos" : "auth")
  const [accessToken, setAccessToken] = useState(storedToken)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [error, setError] = useState("")
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)
  const [focusedRepo, setFocusedRepo] = useState(null)

  const showError = (msg) => {
    setError(msg)
    setTimeout(() => setError(""), 3000)
  }

  const handleRegister = async () => {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.status === 200) {
      alert("註冊成功，請登入")
      setMode("login")
    } else {
      showError("註冊失敗")
    }
  }

  const handleLogin = async () => {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (res.status === 200) {
      setStep("mfa")
    } else {
      showError("登入失敗")
    }
  }

  const handleVerifyMFA = async () => {
    const res = await fetch(`${API_BASE}/api/verify-mfa`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mfaCode })
    })
    if (res.status === 200) {
      const data = await res.json()
      setAccessToken(data.accessToken)
      localStorage.setItem("accessToken", data.accessToken)
      setStep("repos")
    } else {
      showError("驗證碼錯誤")
    }
  }

  const handleLogout = async () => {
    await fetch(`${API_BASE}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    localStorage.removeItem("accessToken")
    setAccessToken("")
    setStep("auth")
    setEmail("")
    setPassword("")
    setMfaCode("")
    setRepos([])
    setPage(0)
  }

  useEffect(() => {
    if (step === "repos" && accessToken) {
      setLoading(true)
      fetch(`${API_BASE}/repos?page=${page}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => {
          if (res.status === 401) {
            handleLogout()
            showError("Token 已過期，請重新登入")
            throw new Error("Unauthorized")
          }
          return res.json()
        })
        .then(data => {
          setRepos(data.content || [])
          setTotalCount(data.totalCount || 0)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
          if (err.message !== "Unauthorized") showError("資料取得失敗")
        })
    }
  }, [step, page, accessToken])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 animate-slide-up bg-red-100 text-red-700 px-4 py-2 rounded shadow text-center z-50">
          {error}
        </div>
      )}
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6">
        <header className="flex justify-center px-4 py-5 mb-6 bg-blue-600 rounded-xl shadow text-white">
          <h1 className="text-xl font-semibold">Sam's Backend Lab 專案</h1>
          
        </header>

        {step === "auth" && (
          <>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setMode("login")}
                className={`px-4 py-2 rounded-l-md font-medium ${mode === "login" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >登入</button>
              <button
                onClick={() => setMode("register")}
                className={`px-4 py-2 rounded-r-md font-medium ${mode === "register" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >註冊</button>
            </div>

            <div className="space-y-4">
              <input className="w-full border border-gray-300 rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
              <input className="w-full border border-gray-300 rounded px-3 py-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
              <button
                onClick={mode === "login" ? handleLogin : handleRegister}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              >{mode === "login" ? "登入" : "註冊"}</button>
            </div>
          </>
        )}

        {step === "mfa" && (
          <div className="space-y-4">
            <input className="w-full border border-gray-300 rounded px-3 py-2" value={mfaCode} onChange={e => setMfaCode(e.target.value)} placeholder="請輸入 MFA 驗證碼" />
            <button
              onClick={handleVerifyMFA}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >驗證</button>
          </div>
        )}

        {step === "repos" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-600">Trending Repos</h2>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-full transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3H9.75m0 0l3-3m-3 3l3 3" />
                </svg>
                登出
              </button>
            </div>
            {loading ? (
              <p className="text-center">載入中...</p>
            ) : (
              <ul className="grid grid-cols-1 gap-4">
                {repos.map(repo => (
                  <li key={repo.fullName} className={`bg-white p-4 rounded-lg shadow transition-all border border-gray-200 overflow-hidden relative cursor-pointer group ${
        focusedRepo === repo.fullName ? 'scale-105 z-10 ring-2 ring-blue-400' : focusedRepo ? 'blur-sm pointer-events-none' : ''
      }`} onClick={() => setFocusedRepo(repo.fullName === focusedRepo ? null : repo.fullName)}>
                    <div className="flex justify-between items-center">
                      <a href={repo.url} className="text-lg font-bold text-blue-700 hover:underline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75v16.5m-9-9h12.75" />
                        </svg>
                        {repo.fullName}
                      </a>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-mono">⭐ {repo.stars}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-clip">{repo.description}</p>
                    <p className="mt-1 text-xs text-gray-500 italic">{repo.language || 'Unknown language'}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index)}
                  className={`px-3 py-1 rounded ${page === index ? "bg-blue-600 text-white" : "bg-white border border-blue-600 text-blue-600"}`}
                >{index + 1}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
