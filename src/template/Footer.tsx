export const Footer = () => (
  <footer>
    <div className="flex justify-content-between align-items-center py-1 content">
      <div>
        <img src="/logo-black.svg" alt="logo" width="40" />
        <p className="m-0 text-xs text-500">© 2023 Tournament Generator. All rights reserved</p>
      </div>

      <div>
        <a href="https://anunes9.github.io/me/">
          <i className="pi pi-github" style={{ color: 'var(--gray-500)' }} />
        </a>
      </div>
    </div>
  </footer>
)

