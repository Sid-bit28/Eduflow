'use client';

export default function Error({ error, reset }) {
  console.error('Page error:', error);

  return (
    <div className="flex flex-col items-start p-6 bg-red-100 border border-red-300 rounded-xl">
      <h2 className="text-lg font-bold text-red-700 mb-2">
        Something went wrong
      </h2>
      <p className="text-red-600 mb-4">
        {error.message || 'Please try again later.'}
      </p>
      <button
        onClick={() => reset()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}
