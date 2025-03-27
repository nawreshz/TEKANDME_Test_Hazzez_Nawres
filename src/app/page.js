import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
          crossOrigin="anonymous"
          defer
        />
      </Head>
      <div className="min-vh-100 d-flex flex-column">
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container">
            <a className="navbar-brand fw-bold" href="#">TodoList</a>
          </div>
        </nav>

        <main className="flex-grow-1">
          <div className="container">
            <div className="row min-vh-100 align-items-center">
              <div className="col-md-6">
                <h1 className="display-4 fw-bold mb-4">Organize Your Tasks with Ease</h1>
                <p className="lead mb-4">Stay productive and never miss a task with our simple and intuitive todo list application.</p>
                <Link href="/login" className="btn btn-primary btn-lg shadow-sm">
                  Get Started
                </Link>
              </div>
              <div className="col-md-6 d-none d-md-block text-center">
                <Image
                  src="/task-management.svg"
                  alt="Task Management Illustration"
                  width={500}
                  height={400}
                  priority
                />
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-light py-4 mt-auto">
          <div className="container text-center">
            <p className="mb-0"> 2025 TodoList. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
