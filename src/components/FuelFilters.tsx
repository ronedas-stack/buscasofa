import React from 'react';

interface FuelFiltersProps {
    provinces: string[];
    cities: string[];
    selectedProvince: string;
    selectedCity: string;
    selectedFuel: string;
    onProvinceChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onFuelChange: (value: string) => void;
}

const FuelFilters: React.FC<FuelFiltersProps> = ({
    provinces,
    cities,
    selectedProvince,
    selectedCity,
    selectedFuel,
    onProvinceChange,
    onCityChange,
    onFuelChange,
}) => (
    <div className="fuel-filters">
        <select value={selectedProvince} onChange={e => onProvinceChange(e.target.value)}>
            <option value="">Provincia</option>
            {provinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
            ))}
        </select>
        <select value={selectedCity} onChange={e => onCityChange(e.target.value)}>
            <option value="">Ciudad</option>
            {cities.map(city => (
                <option key={city} value={city}>{city}</option>
            ))}
        </select>
        <select value={selectedFuel} onChange={e => onFuelChange(e.target.value)}>
            <option value="">Tipo de combustible</option>
            <option value="Precio Gasoleo A">Gasóleo A</option>
            <option value="Precio Gasolina 95 E5">Gasolina 95 E5</option>
            {/* Agrega más tipos si lo deseas */}
        </select>
    </div>
);

export default FuelFilters;