import { useEffect, useState } from "react"

function App() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    fetch(`http://52.195.3.91:8080/repos?page=${page}&size=${pageSize}`)
      .then((response) => response.json())
      .then((data) => {
        setRepos(data.content)
        setTotalCount(data.totalCount)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching repos:', error)
        setLoading(false)
      })
  }, [page])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">🔥 Trending Repos</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 max-w-4xl mx-auto">
            {repos.map((repo) => (
              <div key={repo.fullName} className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {repo.fullName} ⭐ {repo.stars}
                </a>
                <p className="mt-2 text-gray-700">{repo.description || "No description"}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {repo.language || "Unknown Language"}
                </p>
              </div>
            ))}
          </div>

          {/* 分頁 */}
          <div className="flex justify-center space-x-2 mt-10">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={`px-4 py-2 rounded ${
                  page === index ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"
                } hover:bg-blue-600 hover:text-white transition`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App

