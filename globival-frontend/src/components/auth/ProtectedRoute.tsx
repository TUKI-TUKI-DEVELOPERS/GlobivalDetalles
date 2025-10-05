"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import type { JSX } from "react"
import { useEffect } from "react"
import { toast } from "react-toastify"

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const devBypass = import.meta.env.MODE === "development"

  useEffect(() => {
    // Mostrar mensaje cuando se intenta acceder a una ruta protegida sin autenticación
    if (!loading && !isAuthenticated && !devBypass) {
      toast.error("Debes iniciar sesión para acceder a esta sección")
    }
  }, [loading, isAuthenticated, devBypass])

  // Si está cargando, mostrar un spinner (excepto en desarrollo con bypass)
  if (loading && !devBypass) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          className="spinner"
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid rgba(255, 0, 0, 0.3)",
            borderRadius: "50%",
            borderTop: "5px solid #FF0000",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Verificando autenticación...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login con la ubicación actual como state (excepto en desarrollo con bypass)
  if (!isAuthenticated && !devBypass) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si está autenticado (o en desarrollo con bypass), mostrar el contenido protegido
  return children
}

export default ProtectedRoute
