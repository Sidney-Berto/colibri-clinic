interface HummingbirdLogoProps {
  className?: string;
  size?: number;
}

const HummingbirdLogo = ({ className = "", size = 48 }: HummingbirdLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body */}
      <ellipse
        cx="32"
        cy="36"
        rx="12"
        ry="16"
        className="fill-primary"
        transform="rotate(-15 32 36)"
      />
      
      {/* Wing */}
      <path
        d="M20 28C12 20 8 28 6 36C8 38 14 36 20 32C18 36 20 44 26 42C30 40 28 34 26 30C28 28 24 24 20 28Z"
        className="fill-primary/80"
      />
      <path
        d="M22 30C16 24 14 30 12 36C14 36 18 34 22 32"
        className="stroke-primary-foreground/50"
        strokeWidth="0.5"
        fill="none"
      />
      
      {/* Head */}
      <circle cx="42" cy="22" r="8" className="fill-primary" />
      
      {/* Eye */}
      <circle cx="44" cy="20" r="2" className="fill-primary-foreground" />
      <circle cx="44.5" cy="19.5" r="0.8" className="fill-foreground" />
      
      {/* Beak */}
      <path
        d="M50 22L62 20L50 24Z"
        className="fill-foreground/70"
      />
      
      {/* Tail feathers */}
      <path
        d="M22 48C18 52 14 58 10 60C14 58 18 54 22 52C18 56 16 60 14 64C18 60 22 56 24 52C22 58 24 62 26 64C26 60 26 56 26 52"
        className="fill-primary/60"
      />
      
      {/* Wing detail lines */}
      <path
        d="M16 30L10 34M18 32L12 38M20 34L16 40"
        className="stroke-primary-foreground/30"
        strokeWidth="0.5"
      />
      
      {/* Body gradient overlay */}
      <ellipse
        cx="34"
        cy="34"
        rx="6"
        ry="10"
        className="fill-primary-foreground/10"
        transform="rotate(-15 34 34)"
      />
    </svg>
  );
};

export default HummingbirdLogo;
