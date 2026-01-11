// src/components/GetStarted.jsx
export default function GetStarted() {
  return (
    <footer className="border-t py-6">
      <div className="container text-center text-sm">
        © {new Date().getFullYear()} SM Int'l — Built with React & Flask
      </div>
    </footer>
  );
}