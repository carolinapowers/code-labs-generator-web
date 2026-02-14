export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Code Labs Generator</h1>
        <p className="text-lg text-gray-600 mb-8">
          Automate Code Lab creation with AI
        </p>
        <div className="space-x-4">
          <a
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-ps-orange text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="inline-block px-6 py-3 border border-ps-orange text-ps-orange rounded-lg hover:bg-ps-orange hover:text-white transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  )
}
