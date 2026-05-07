import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white border rounded shadow p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="text-gray-600 mb-4">
          You don’t have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

