import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { selectTeamCount } from "../features/pokemon/selectors";
import { signOut } from "../services/auth";
import type { ThemeMode } from "../app/localStorage";
import "./NavBar.css";

type Props = {
  theme: ThemeMode;
  onChangeTheme: (t: ThemeMode) => void;
};

export default function NavBar({ theme, onChangeTheme }: Props) {
  const teamCount = useAppSelector(selectTeamCount);
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const next = encodeURIComponent(
    location.pathname + location.search + location.hash
  );

  const [open, setOpen] = useState(false);

  const LinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "navlink navlink--active" : "navlink";

  return (
    <nav className="nav" aria-label="Main">
      <div className="navinner">
        <div className="navleft">
          <NavLink to="/" className={LinkClass} end>
            Home
          </NavLink>
          <NavLink to="/pokedex" className={LinkClass}>
            Pokedex
          </NavLink>
          <NavLink to="/team" className={LinkClass}>
            Team{" "}
            {teamCount > 0 ? (
              <span className="navbadge">{teamCount}</span>
            ) : null}
          </NavLink>
          <NavLink to="/profile" className={LinkClass}>
            Profile
          </NavLink>
        </div>

        <div
          className="navright"
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <a className="navbrand" href="/" aria-label="Pokedex">
            Pokedex
          </a>

          <select
            value={theme}
            onChange={(e) => onChangeTheme(e.target.value as ThemeMode)}
            aria-label="Theme"
            style={{
              borderRadius: 8,
              padding: "4px 8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <option value="system">system</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>

          {user ? (
            <>
              <span className="navuser" aria-live="polite">
                {user.email}
              </span>
              <button
                className="navbtn"
                aria-label="Sign out"
                onClick={async () => {
                  await signOut();
                  navigate("/auth/login");
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              className="navbtn"
              aria-label="Sign in"
              onClick={() => navigate(`/auth/login?next=${next}`)}
            >
              Войти
            </button>
          )}

          <button
            className="navbtn navtoggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            ☰ Меню
          </button>
        </div>
      </div>

      {open && (
        <div
          className="navdrawer"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" className={LinkClass} end>
            Home
          </NavLink>
          <NavLink to="/pokedex" className={LinkClass}>
            Pokedex
          </NavLink>
          <NavLink to="/team" className={LinkClass}>
            Team
          </NavLink>
          <NavLink to="/profile" className={LinkClass}>
            Profile
          </NavLink>
          {!user ? (
            <button
              className="navbtn"
              onClick={() => navigate(`/auth/login?next=${next}`)}
              aria-label="Sign in"
            >
              Войти
            </button>
          ) : (
            <button
              className="navbtn"
              onClick={async () => {
                await signOut();
                navigate("/auth/login");
              }}
              aria-label="Sign out"
            >
              Выйти
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
