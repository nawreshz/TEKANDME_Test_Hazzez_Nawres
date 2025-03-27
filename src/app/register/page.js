"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nom_utilisateur: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (formData.username.length < 3) {
      errors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }
    
    if (formData.email.length < 6) {
      errors.email = "L'email doit contenir au moins 6 caractères";
    }
    
    if (formData.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!formData.nom_utilisateur.trim()) {
      errors.nom_utilisateur = "Le nom d'utilisateur est requis";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ""
      });
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Inscription</h2>
                 
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold">Nom d'utilisateur (login)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person-fill text-primary"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ps-0 ${validationErrors.username ? 'is-invalid' : ''}`}
                        id="username"
                        name="username"
                        placeholder="Entrez votre nom d'utilisateur"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {validationErrors.username && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.username}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="nom_utilisateur" className="form-label fw-semibold">Nom complet</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person-badge-fill text-primary"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ps-0 ${validationErrors.nom_utilisateur ? 'is-invalid' : ''}`}
                        id="nom_utilisateur"
                        name="nom_utilisateur"
                        placeholder="Entrez votre nom complet"
                        value={formData.nom_utilisateur}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {validationErrors.nom_utilisateur && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.nom_utilisateur}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope-fill text-primary"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control border-start-0 ps-0 ${validationErrors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="Entrez votre email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">Mot de passe</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill text-primary"></i>
                      </span>
                      <input
                        type="password"
                        className={`form-control border-start-0 ps-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        placeholder="Entrez votre mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.password}
                      </div>
                    )}
                  </div>
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg py-3 fw-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Inscription en cours...
                        </>
                      ) : (
                        "S'inscrire"
                      )}
                    </button>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-0 text-muted">Déjà un compte ? 
                    <Link href="/login" className="text-primary text-decoration-none fw-semibold ms-1">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
