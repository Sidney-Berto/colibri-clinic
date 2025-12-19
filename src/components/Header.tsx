import HummingbirdLogo from "./HummingbirdLogo";

const Header = () => {
  return (
    <header className="w-full bg-card shadow-card border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3 animate-fade-in">
          <HummingbirdLogo size={48} className="animate-float" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              Life Clinic
            </h1>
            <p className="text-sm text-muted-foreground">
              Rede de acolhimento para reprodução humana
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
