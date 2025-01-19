export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-stone-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-stone-600 mb-4">
          Page Not Found
        </h2>
        <p className="text-stone-500 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
