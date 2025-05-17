import { ReactNode } from "react";
import "../public/globals.css";
import { ToastContainer } from 'react-toastify';


export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">{children}</div>
        <ToastContainer />
      </body>
    </html>
  );
}