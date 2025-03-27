'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Connexion</h2>
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope-fill text-primary"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 ps-0"
                        id="email"
                        name="email"
                        placeholder="Entrez votre email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">Mot de passe</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock-fill text-primary"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        id="password"
                        name="password"
                        placeholder="Entrez votre mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
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
                          Connexion en cours...
                        </>
                      ) : (
                        'Se connecter'
                      )}
                    </button>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-0 text-muted">Pas encore de compte ? 
                    <Link href="/register" className="text-primary text-decoration-none fw-semibold ms-1">
                      S'inscrire
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