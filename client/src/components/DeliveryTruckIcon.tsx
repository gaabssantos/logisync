export const DeliveryTruckIcon = ({ size = 64 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={(size * 48) / 64}
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Container / Baú Amarelo / Dourado */}
      <rect x="2" y="8" width="38" height="26" rx="3" fill="#F59E0B" />
      <rect x="6" y="12" width="30" height="18" rx="2" fill="#FBBF24" />
      <path d="M10 14V28M16 14V28M22 14V28M28 14V28" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Cabine Laranja / Vermelha */}
      <path
        d="M40 16H48C51.5 16 54 18.5 55.5 22L58 28.5C58.7 30.2 59 31.5 59 33.5C59 34.5 58.5 35 57 35H40V16Z"
        fill="#EF4444"
      />
      
      {/* Janela Cabine */}
      <path
        d="M43 19H48C49.8 19 51.5 20.2 52.3 22.2L53.5 25H43V19Z"
        fill="#38BDF8"
      />

      {/* Farol */}
      <path d="M58 29.5L60 30.5V33L58 33.5V29.5Z" fill="#FEF08A" />

      {/* Parachoque Dianteiro e Traseiro */}
      <rect x="39" y="33" width="20" height="3" rx="1.5" fill="#334155" />
      <rect x="0" y="32" width="4" height="3" rx="1" fill="#475569" />

      {/* Eixos */}
      <rect x="8" y="33" width="10" height="2" fill="#1E293B" />
      <rect x="42" y="33" width="10" height="2" fill="#1E293B" />

      {/* Roda Traseira */}
      <circle cx="13" cy="35" r="6" fill="#1E293B" />
      <circle cx="13" cy="35" r="3.2" fill="#94A3B8" />
      <circle cx="13" cy="35" r="1.5" fill="#1E293B" />

      {/* Roda Dianteira */}
      <circle cx="47" cy="35" r="6" fill="#1E293B" />
      <circle cx="47" cy="35" r="3.2" fill="#94A3B8" />
      <circle cx="47" cy="35" r="1.5" fill="#1E293B" />
    </svg>
  );
};
